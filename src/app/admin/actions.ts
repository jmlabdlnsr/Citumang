"use server";

import cloudinary from "cloudinary";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import {
  adminUsers,
  artikelKategori,
  articles,
  faq,
  galleryItems,
  packages,
  prices,
  reservations,
} from "@/db/schema";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/auth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function requireAdmin() {
  if (!(await getAdminSession())) throw new Error("Unauthorized");
}

const packageSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9-]+$/),
  nameId: z.string().trim().min(2),
  nameEn: z.string().trim().min(2),
  duration: z.string().trim().optional(),
  descriptionId: z.string().trim().optional(),
  descriptionEn: z.string().trim().optional(),
});

export async function createPackage(formData: FormData) {
  await requireAdmin();
  const data = packageSchema.parse({
    slug: formData.get("slug"),
    nameId: formData.get("nameId"),
    nameEn: formData.get("nameEn"),
    duration: formData.get("duration"),
    descriptionId: formData.get("descriptionId"),
    descriptionEn: formData.get("descriptionEn"),
  });
  await db.insert(packages).values(data);
  revalidatePath("/admin/packages");
  revalidatePath("/admin/dashboard");
}

export async function deletePackage(formData: FormData) {
  await requireAdmin();
  await db.delete(packages).where(eq(packages.id, Number(formData.get("id"))));
  revalidatePath("/admin/packages");
  revalidatePath("/admin/dashboard");
}

const priceSchema = z.object({
  packageId: z.coerce.number().positive(),
  labelId: z.string().trim().min(2),
  labelEn: z.string().trim().min(2),
  amount: z.coerce.number().int().nonnegative(),
});

export async function createPrice(formData: FormData) {
  await requireAdmin();
  const data = priceSchema.parse({
    packageId: formData.get("packageId"),
    labelId: formData.get("labelId"),
    labelEn: formData.get("labelEn"),
    amount: formData.get("amount"),
  });
  await db.insert(prices).values(data);
  revalidatePath("/admin/packages");
}

export async function deletePrice(formData: FormData) {
  await requireAdmin();
  await db.delete(prices).where(eq(prices.id, Number(formData.get("id"))));
  revalidatePath("/admin/packages");
}

export async function createArticle(formData: FormData) {
  await requireAdmin();
  const slug = z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .parse(formData.get("slug"));
  const rawKategoriId = formData.get("kategoriId");
  const kategoriId =
    rawKategoriId && String(rawKategoriId).trim() !== ""
      ? z.coerce.number().int().positive().parse(rawKategoriId)
      : undefined;
  await db.insert(articles).values({
    slug,
    titleId: z.string().trim().min(2).parse(formData.get("titleId")),
    titleEn: z.string().trim().min(2).parse(formData.get("titleEn")),
    excerptId: String(formData.get("excerptId") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    contentId: String(formData.get("contentId") ?? ""),
    contentEn: String(formData.get("contentEn") ?? ""),
    published: formData.get("published") === "true",
    ...(kategoriId !== undefined ? { kategoriId } : {}),
  });
  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  await db.delete(articles).where(eq(articles.id, Number(formData.get("id"))));
  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
}

export async function toggleArticle(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  await db
    .update(articles)
    .set({
      published,
      publishedAt: published ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id));
  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
}

export async function createGalleryItem(formData: FormData) {
  await requireAdmin();
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Konfigurasi Cloudinary belum lengkap");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("File galeri belum dipilih");
  }

  const bytes = await file.arrayBuffer();
  const extension =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "img";
  const localFileName = `${crypto.randomUUID()}.${extension}`;
  const localDirectory = path.join(process.cwd(), "public", "uploads", "gallery");
  await mkdir(localDirectory, { recursive: true });
  await writeFile(
    path.join(localDirectory, localFileName),
    Buffer.from(bytes),
  );
  const localUrl = `/uploads/gallery/${localFileName}`;

  const upload = await cloudinary.v2.uploader.upload(
    `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`,
    { folder: "citumang/gallery", resource_type: "image" },
  );

  await db.insert(galleryItems).values({
    titleId: z.string().trim().min(2).parse(formData.get("titleId")),
    titleEn: z.string().trim().min(2).parse(formData.get("titleEn")),
    altId: z.string().trim().min(2).parse(formData.get("altId")),
    altEn: z.string().trim().min(2).parse(formData.get("altEn")),
    cloudinaryPublicId: upload.public_id,
    cloudinaryUrl: upload.secure_url,
    localUrl,
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/dashboard");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const [item] = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, id))
    .limit(1);
  if (item) {
    await cloudinary.v2.uploader.destroy(item.cloudinaryPublicId ?? "");
    if (item.localUrl?.startsWith("/uploads/gallery/")) {
      const localPath = path.join(process.cwd(), "public", item.localUrl);
      await unlink(localPath).catch(() => undefined);
    }
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/dashboard");
}

export async function updateReservationStatus(formData: FormData) {
  await requireAdmin();
  const status = z.enum(["menunggu", "dikonfirmasi", "dibatalkan", "selesai"]).parse(
    formData.get("status"),
  );
  await db
    .update(reservations)
    .set({ status, updatedAt: new Date() })
    .where(eq(reservations.id, Number(formData.get("id"))));
  revalidatePath("/admin/reservations");
  revalidatePath("/admin/dashboard");
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

export async function createFaq(formData: FormData) {
  await requireAdmin();
  await db.insert(faq).values({
    pertanyaanId: z.string().trim().min(5).parse(formData.get("pertanyaanId")),
    pertanyaanEn: z.string().trim().min(5).parse(formData.get("pertanyaanEn")),
    jawabanId: z.string().trim().min(5).parse(formData.get("jawabanId")),
    jawabanEn: z.string().trim().min(5).parse(formData.get("jawabanEn")),
    urutan: z.coerce.number().int().nonnegative().default(0).parse(
      formData.get("urutan") || "0",
    ),
  });
  revalidatePath("/admin/faq");
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  await db.delete(faq).where(eq(faq.id, Number(formData.get("id"))));
  revalidatePath("/admin/faq");
}

export async function toggleFaq(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const aktif = formData.get("aktif") === "true";
  await db.update(faq).set({ aktif }).where(eq(faq.id, id));
  revalidatePath("/admin/faq");
}

// ─── Artikel Kategori ───────────────────────────────────────────────────────

export async function createArtikelKategori(formData: FormData) {
  await requireAdmin();
  await db.insert(artikelKategori).values({
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung")
      .parse(formData.get("slug")),
    namaId: z.string().trim().min(2).parse(formData.get("namaId")),
    namaEn: z.string().trim().min(2).parse(formData.get("namaEn")),
  });
  revalidatePath("/admin/articles");
}

export async function deleteArtikelKategori(formData: FormData) {
  await requireAdmin();
  await db
    .delete(artikelKategori)
    .where(eq(artikelKategori.id, Number(formData.get("id"))));
  revalidatePath("/admin/articles");
}

// ─── Admin Users ────────────────────────────────────────────────────────────

export async function createAdminUser(formData: FormData) {
  await requireAdmin();
  const name = z.string().trim().min(2).parse(formData.get("name"));
  const email = z.string().trim().email().parse(formData.get("email"));
  const password = z
    .string()
    .min(8, "Password minimal 8 karakter")
    .parse(formData.get("password"));

  // Cek duplikat email
  const existing = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (existing.length > 0) throw new Error("Email sudah terdaftar");

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(adminUsers).values({ name, email, passwordHash });
  revalidatePath("/admin/users");
}

export async function toggleAdminUser(formData: FormData) {
  await requireAdmin();
  const session = await getAdminSession();
  const id = Number(formData.get("id"));
  if (session?.id === id) throw new Error("Tidak bisa menonaktifkan akun sendiri");
  const active = formData.get("active") === "true";
  await db.update(adminUsers).set({ active }).where(eq(adminUsers.id, id));
  revalidatePath("/admin/users");
}

export async function deleteAdminUser(formData: FormData) {
  await requireAdmin();
  const session = await getAdminSession();
  const id = Number(formData.get("id"));
  if (session?.id === id) throw new Error("Tidak bisa menghapus akun sendiri");
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  revalidatePath("/admin/users");
}
