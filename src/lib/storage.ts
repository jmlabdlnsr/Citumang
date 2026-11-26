/**
 * src/lib/storage.ts — abstraksi tunggal untuk object storage (MinIO / S3-compatible).
 *
 * Desain §7.4: "Seluruh akses file ke MinIO dibungkus dalam satu modul di aplikasi.
 * Tidak boleh ada pemanggilan storage yang tersebar di banyak komponen."
 *
 * Kunci objek disimpan di DB, BUKAN URL lengkap — sehingga perubahan endpoint
 * tidak memaksa migrasi data.
 *
 * Env yang dibutuhkan (lihat .env.local.example):
 *   MINIO_ENDPOINT   — hostname:port, contoh: 10.10.10.12:9002
 *   MINIO_ACCESS_KEY — access key
 *   MINIO_SECRET_KEY — secret key
 *   MINIO_BUCKET     — nama bucket, contoh: citumang
 *   MINIO_USE_SSL    — "true" | "false" (opsional, default false untuk dev)
 */

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ─── Singleton S3Client ───────────────────────────────────────────────────────

function createClient(): S3Client {
  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKeyId = process.env.MINIO_ACCESS_KEY;
  const secretAccessKey = process.env.MINIO_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "MinIO belum dikonfigurasi. Set MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY di .env.local",
    );
  }

  const useSSL = process.env.MINIO_USE_SSL === "true";

  return new S3Client({
    endpoint: `${useSSL ? "https" : "http"}://${endpoint}`,
    region: "us-east-1", // MinIO mengabaikan region, tapi SDK memerlukannya
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // wajib untuk MinIO (path-style: /bucket/key)
  });
}

// Lazy singleton — hanya dibuat saat pertama kali dipakai agar cold-start ringan
let _client: S3Client | null = null;
function getClient(): S3Client {
  if (!_client) _client = createClient();
  return _client;
}

function getBucket(): string {
  const bucket = process.env.MINIO_BUCKET;
  if (!bucket) throw new Error("MINIO_BUCKET belum di-set di environment variables");
  return bucket;
}

// ─── Helpers untuk membentuk object key ──────────────────────────────────────

/**
 * Buat object key unik: `{prefix}/{uuid}.{ext}`
 * Contoh: "gallery/3f8a1b2c-....webp"
 */
export function makeObjectKey(prefix: string, originalName: string): string {
  const ext =
    originalName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const uuid = crypto.randomUUID();
  return `${prefix}/${uuid}.${ext}`;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadResult {
  /** Kunci objek di bucket — ini yang disimpan ke DB */
  objectKey: string;
  /** URL publik yang bisa langsung dipakai sebagai src gambar */
  publicUrl: string;
}

/**
 * Upload buffer ke MinIO. Kembalikan `objectKey` dan `publicUrl`.
 *
 * @param key     — object key (gunakan makeObjectKey())
 * @param body    — Buffer berisi bytes file
 * @param contentType — MIME type, contoh "image/jpeg"
 */
export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<UploadResult> {
  const bucket = getBucket();

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Object bisa diakses publik karena bucket dikonfigurasi public-read
      // (lihat README#minio-setup). Tidak perlu ACL di sini karena MinIO
      // bucket-level policy yang menanganinya.
    }),
  );

  return {
    objectKey: key,
    publicUrl: buildPublicUrl(key),
  };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Hapus objek dari bucket. Gagal diam-diam jika objek tidak ada.
 */
export async function deleteObject(key: string): Promise<void> {
  if (!key) return;
  await getClient()
    .send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
    .catch(() => undefined); // abaikan jika objek sudah tidak ada
}

// ─── Presigned URL (opsional, untuk download privat di masa depan) ────────────

/**
 * Buat presigned URL yang valid selama `expiresIn` detik (default 1 jam).
 * Gunakan ini jika bucket nanti dikonfigurasi private.
 */
export async function getPresignedUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new PutObjectCommand({ Bucket: getBucket(), Key: key });
  return getSignedUrl(getClient(), command, { expiresIn });
}

// ─── URL Builder ─────────────────────────────────────────────────────────────

/**
 * Bangun URL publik dari object key.
 * Format: http(s)://MINIO_ENDPOINT/MINIO_BUCKET/key
 */
export function buildPublicUrl(objectKey: string): string {
  const endpoint = process.env.MINIO_ENDPOINT ?? "";
  const bucket = process.env.MINIO_BUCKET ?? "";
  const useSSL = process.env.MINIO_USE_SSL === "true";
  return `${useSSL ? "https" : "http"}://${endpoint}/${bucket}/${objectKey}`;
}

/**
 * Periksa apakah MinIO sudah dikonfigurasi (env tersedia).
 * Gunakan ini untuk graceful fallback saat env belum di-set.
 */
export function isStorageConfigured(): boolean {
  return !!(
    process.env.MINIO_ENDPOINT &&
    process.env.MINIO_ACCESS_KEY &&
    process.env.MINIO_SECRET_KEY &&
    process.env.MINIO_BUCKET
  );
}
