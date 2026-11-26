/**
 * src/lib/queries.ts — semua query baca ke database untuk halaman publik.
 *
 * Desain §6.5 & §7.4:
 * - Semua baca melalui file ini, bukan langsung dari komponen.
 * - Fungsi dikembalikan dengan tipe eksplisit supaya page.tsx aman diinfer.
 * - Cache default Next.js (force-cache) berlaku kecuali dinonaktifkan.
 */

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  articles,
  artikelKategori,
  faq,
  galleryItems,
  packages,
  prices,
} from "@/db/schema";
import { buildPublicUrl } from "@/lib/storage";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Bangun URL gambar dari objectKey atau localUrl/cloudinaryUrl (fallback). */
function resolveImageUrl(
  objectKey: string | null | undefined,
  localUrl: string | null | undefined,
  cloudinaryUrl?: string | null | undefined,
): string | null {
  if (objectKey) return buildPublicUrl(objectKey);
  if (localUrl) return localUrl;
  if (cloudinaryUrl) return cloudinaryUrl;
  return null;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type PublicPackage = {
  id: number;
  slug: string;
  nameId: string;
  nameEn: string;
  descriptionId: string | null;
  descriptionEn: string | null;
  duration: string | null;
  minPeserta: number | null;
  maksPeserta: number | null;
  fasilitas: string[];
  coverUrl: string | null;
  prices: Array<{
    id: number;
    labelId: string;
    labelEn: string;
    amount: number;
    currency: string;
  }>;
};

export type PublicGalleryItem = {
  id: number;
  titleId: string;
  titleEn: string;
  altId: string;
  altEn: string;
  tipe: "foto" | "video_embed";
  imageUrl: string | null;
  embedUrl: string | null;
};

export type PublicArticle = {
  id: number;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string | null;
  excerptEn: string | null;
  coverUrl: string | null;
  kategoriId: number | null;
  kategoriNamaId: string | null;
  kategoriNamaEn: string | null;
  publishedAt: Date | null;
};

export type PublicFaq = {
  id: number;
  pertanyaanId: string;
  pertanyaanEn: string;
  jawabanId: string;
  jawabanEn: string;
  urutan: number;
};

// ─── Packages ────────────────────────────────────────────────────────────────

/**
 * Ambil semua paket aktif beserta harganya, diurutkan berdasarkan sortOrder.
 * Dipakai di section #paket-wisata beranda.
 */
export async function getPublicPackages(): Promise<PublicPackage[]> {
  const pkgs = await db
    .select()
    .from(packages)
    .where(eq(packages.active, true))
    .orderBy(asc(packages.sortOrder), asc(packages.id));

  if (pkgs.length === 0) return [];

  const pkgIds = pkgs.map((p) => p.id);
  const allPrices = await db
    .select()
    .from(prices)
    .where(
      and(
        eq(prices.active, true),
        sql`${prices.packageId} = ANY(ARRAY[${sql.join(pkgIds.map((id) => sql`${id}`), sql`, `)}]::int[])`,
      ),
    )
    .orderBy(asc(prices.sortOrder), asc(prices.id));

  return pkgs.map((pkg) => ({
    id: pkg.id,
    slug: pkg.slug,
    nameId: pkg.nameId,
    nameEn: pkg.nameEn,
    descriptionId: pkg.descriptionId ?? null,
    descriptionEn: pkg.descriptionEn ?? null,
    duration: pkg.duration ?? null,
    minPeserta: pkg.minPeserta ?? null,
    maksPeserta: pkg.maksPeserta ?? null,
    fasilitas: pkg.fasilitas ?? [],
    coverUrl: resolveImageUrl(pkg.coverObjectKey, null),
    prices: allPrices
      .filter((pr) => pr.packageId === pkg.id)
      .map((pr) => ({
        id: pr.id,
        labelId: pr.labelId,
        labelEn: pr.labelEn,
        amount: pr.amount,
        currency: pr.currency,
      })),
  }));
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

/**
 * Ambil item galeri aktif, diurutkan berdasarkan sortOrder.
 * Dipakai di section #galeri beranda.
 * @param limit Batas jumlah item (default: semua)
 */
export async function getPublicGallery(limit?: number): Promise<PublicGalleryItem[]> {
  const rows = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.active, true))
    .orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id))
    .limit(limit ?? 1000);

  return rows.map((item) => ({
    id: item.id,
    titleId: item.titleId,
    titleEn: item.titleEn,
    altId: item.altId,
    altEn: item.altEn,
    tipe: item.tipe,
    imageUrl: item.tipe === "foto"
      ? resolveImageUrl(item.objectKey, item.localUrl, item.cloudinaryUrl)
      : null,
    embedUrl: item.embedUrl ?? null,
  }));
}

// ─── Articles ────────────────────────────────────────────────────────────────

/**
 * Ambil artikel yang sudah dipublikasikan, diurutkan terbaru dulu.
 * @param limit Batas jumlah (default: semua)
 * @param search Kata kunci full-text search (opsional)
 */
export async function getPublicArticles(
  limit?: number,
  search?: string,
): Promise<PublicArticle[]> {
  const rows = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      titleId: articles.titleId,
      titleEn: articles.titleEn,
      excerptId: articles.excerptId,
      excerptEn: articles.excerptEn,
      coverObjectKey: articles.coverObjectKey,
      coverCloudinaryUrl: articles.coverCloudinaryUrl,
      kategoriId: articles.kategoriId,
      namaId: artikelKategori.namaId,
      namaEn: artikelKategori.namaEn,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .leftJoin(artikelKategori, eq(articles.kategoriId, artikelKategori.id))
    .where(
      search
        ? and(
            eq(articles.published, true),
            sql`to_tsvector('indonesian', coalesce(${articles.titleId}, '') || ' ' || coalesce(${articles.excerptId}, '')) @@ plainto_tsquery('indonesian', ${search})`,
          )
        : eq(articles.published, true),
    )
    .orderBy(desc(articles.publishedAt), desc(articles.id))
    .limit(limit ?? 1000);

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    titleId: r.titleId,
    titleEn: r.titleEn,
    excerptId: r.excerptId ?? null,
    excerptEn: r.excerptEn ?? null,
    coverUrl: resolveImageUrl(r.coverObjectKey, null, r.coverCloudinaryUrl),
    kategoriId: r.kategoriId ?? null,
    kategoriNamaId: r.namaId ?? null,
    kategoriNamaEn: r.namaEn ?? null,
    publishedAt: r.publishedAt,
  }));
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

/**
 * Ambil FAQ yang aktif, diurutkan berdasarkan `urutan`.
 * Dipakai di section #informasi beranda.
 */
export async function getPublicFaq(): Promise<PublicFaq[]> {
  const rows = await db
    .select()
    .from(faq)
    .where(eq(faq.aktif, true))
    .orderBy(asc(faq.urutan), asc(faq.id));

  return rows.map((r) => ({
    id: r.id,
    pertanyaanId: r.pertanyaanId,
    pertanyaanEn: r.pertanyaanEn,
    jawabanId: r.jawabanId,
    jawabanEn: r.jawabanEn,
    urutan: r.urutan,
  }));
}
