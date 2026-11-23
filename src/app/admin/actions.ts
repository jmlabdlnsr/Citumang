"use server";

import cloudinary from "cloudinary";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import { articles, galleryItems, packages, prices, reservations } from "@/db/schema";
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
  await db.insert(articles).values({
    slug,
    titleId: z.string().trim().min(2).parse(formData.get("titleId")),
    titleEn: z.string().trim().min(2).parse(formData.get("titleEn")),
    excerptId: String(formData.get("excerptId") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    contentId: String(formData.get("contentId") ?? ""),
    contentEn: String(formData.get("contentEn") ?? ""),
    published: formData.get("published") === "true",
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
    await cloudinary.v2.uploader.destroy(item.cloudinaryPublicId);
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
  const status = z.enum(["new", "confirmed", "completed", "cancelled"]).parse(
    formData.get("status"),
  );
  await db
    .update(reservations)
    .set({ status, updatedAt: new Date() })
    .where(eq(reservations.id, Number(formData.get("id"))));
  revalidatePath("/admin/reservations");
  revalidatePath("/admin/dashboard");
}
