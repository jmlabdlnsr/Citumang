import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const galleryTypeEnum = pgEnum("gallery_type", ["foto", "video_embed"]);

export const reservasiStatusEnum = pgEnum("reservasi_status", [
  "menunggu",
  "dikonfirmasi",
  "dibatalkan",
  "selesai",
]);

// ─── admin_users ────────────────────────────────────────────────────────────

export const adminUsers = pgTable("admin_users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── artikel_kategori (new) ─────────────────────────────────────────────────

export const artikelKategori = pgTable(
  "artikel_kategori",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar("slug", { length: 120 }).notNull(),
    namaId: varchar("nama_id", { length: 120 }).notNull(),
    namaEn: varchar("nama_en", { length: 120 }).notNull(),
  },
  (table) => [uniqueIndex("artikel_kategori_slug_idx").on(table.slug)],
);

// ─── packages ───────────────────────────────────────────────────────────────

export const packages = pgTable(
  "packages",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar("slug", { length: 160 }).notNull(),
    nameId: varchar("name_id", { length: 160 }).notNull(),
    nameEn: varchar("name_en", { length: 160 }).notNull(),
    descriptionId: text("description_id"),
    descriptionEn: text("description_en"),
    duration: varchar("duration", { length: 100 }),
    minPeserta: integer("min_peserta"),
    maksPeserta: integer("maks_peserta"),
    // Array JSON dari string fasilitas: ["Pemandu", "Pelampung", ...]
    fasilitas: jsonb("fasilitas").$type<string[]>(),
    coverObjectKey: varchar("cover_object_key", { length: 255 }),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("packages_slug_idx").on(table.slug),
    index("packages_active_sort_idx").on(table.active, table.sortOrder),
  ],
);

// ─── prices ─────────────────────────────────────────────────────────────────

export const prices = pgTable(
  "prices",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    packageId: integer("package_id")
      .notNull()
      .references(() => packages.id, { onDelete: "cascade" }),
    labelId: varchar("label_id", { length: 160 }).notNull(),
    labelEn: varchar("label_en", { length: 160 }).notNull(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("IDR"),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("prices_package_idx").on(table.packageId),
    index("prices_active_sort_idx").on(table.active, table.sortOrder),
  ],
);

// ─── gallery_items ───────────────────────────────────────────────────────────

export const galleryItems = pgTable(
  "gallery_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    titleId: varchar("title_id", { length: 160 }).notNull(),
    titleEn: varchar("title_en", { length: 160 }).notNull(),
    altId: varchar("alt_id", { length: 255 }).notNull().default(""),
    altEn: varchar("alt_en", { length: 255 }).notNull().default(""),
    // Tipe item: foto lokal/MinIO atau embed video
    tipe: galleryTypeEnum("tipe").notNull().default("foto"),
    // MinIO object key (path di dalam bucket), null untuk video_embed
    objectKey: varchar("object_key", { length: 255 }),
    // URL embed video (YouTube/Vimeo), null untuk foto
    embedUrl: text("embed_url"),
    // Legacy Cloudinary (dipertahankan untuk backward-compat dev lokal)
    cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }),
    cloudinaryUrl: text("cloudinary_url"),
    localUrl: text("local_url"),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("gallery_active_sort_idx").on(table.active, table.sortOrder),
    index("gallery_tipe_idx").on(table.tipe),
  ],
);

// ─── articles ────────────────────────────────────────────────────────────────

export const articles = pgTable(
  "articles",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar("slug", { length: 180 }).notNull(),
    kategoriId: integer("kategori_id").references(() => artikelKategori.id, {
      onDelete: "set null",
    }),
    titleId: varchar("title_id", { length: 180 }).notNull(),
    titleEn: varchar("title_en", { length: 180 }).notNull(),
    excerptId: text("excerpt_id"),
    excerptEn: text("excerpt_en"),
    contentId: text("content_id"),
    contentEn: text("content_en"),
    // MinIO object key untuk cover foto artikel
    coverObjectKey: varchar("cover_object_key", { length: 255 }),
    // Legacy Cloudinary (dipertahankan untuk backward-compat)
    coverCloudinaryPublicId: varchar("cover_cloudinary_public_id", { length: 255 }),
    coverCloudinaryUrl: text("cover_cloudinary_url"),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("articles_slug_idx").on(table.slug),
    index("articles_published_at_idx").on(table.published, table.publishedAt),
    index("articles_kategori_idx").on(table.kategoriId),
    // GIN full-text search untuk /artikel?q= (§7.3, Skenario D)
    index("articles_search_gin_idx").using(
      "gin",
      sql`to_tsvector('indonesian', coalesce(${table.titleId}, '') || ' ' || coalesce(${table.excerptId}, ''))`,
    ),
  ],
);

// ─── reservations ────────────────────────────────────────────────────────────

export const reservations = pgTable(
  "reservations",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    // Kode unik untuk penelusuran oleh pemesan (mis. CTM-20261125-XXXX)
    kodeReservasi: varchar("kode_reservasi", { length: 20 }).notNull().unique(),
    guestName: varchar("guest_name", { length: 100 }).notNull(),
    guestPhone: varchar("guest_phone", { length: 30 }),
    guestEmail: varchar("guest_email", { length: 255 }),
    visitDate: timestamp("visit_date", { mode: "date" }).notNull(),
    guestCount: integer("guest_count").notNull(),
    packageId: integer("package_id").references(() => packages.id, {
      onDelete: "set null",
    }),
    status: reservasiStatusEnum("status").notNull().default("menunggu"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("reservations_status_created_idx").on(table.status, table.createdAt),
    index("reservations_visit_date_idx").on(table.visitDate),
  ],
);

// ─── faq (new) ───────────────────────────────────────────────────────────────

export const faq = pgTable(
  "faq",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    pertanyaanId: text("pertanyaan_id").notNull(),
    pertanyaanEn: text("pertanyaan_en").notNull(),
    jawabanId: text("jawaban_id").notNull(),
    jawabanEn: text("jawaban_en").notNull(),
    urutan: integer("urutan").notNull().default(0),
    aktif: boolean("aktif").notNull().default(true),
  },
  (table) => [index("faq_aktif_urutan_idx").on(table.aktif, table.urutan)],
);
