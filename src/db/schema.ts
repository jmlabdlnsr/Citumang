import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

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

export const galleryItems = pgTable(
  "gallery_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    titleId: varchar("title_id", { length: 160 }).notNull(),
    titleEn: varchar("title_en", { length: 160 }).notNull(),
    altId: varchar("alt_id", { length: 255 }).notNull(),
    altEn: varchar("alt_en", { length: 255 }).notNull(),
    cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }).notNull(),
    cloudinaryUrl: text("cloudinary_url").notNull(),
    localUrl: text("local_url"),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("gallery_active_sort_idx").on(table.active, table.sortOrder)],
);

export const articles = pgTable(
  "articles",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar("slug", { length: 180 }).notNull(),
    titleId: varchar("title_id", { length: 180 }).notNull(),
    titleEn: varchar("title_en", { length: 180 }).notNull(),
    excerptId: text("excerpt_id"),
    excerptEn: text("excerpt_en"),
    contentId: text("content_id"),
    contentEn: text("content_en"),
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
  ],
);

export const reservations = pgTable(
  "reservations",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    guestName: varchar("guest_name", { length: 100 }).notNull(),
    guestPhone: varchar("guest_phone", { length: 30 }),
    visitDate: timestamp("visit_date", { mode: "date" }).notNull(),
    guestCount: integer("guest_count").notNull(),
    packageId: integer("package_id").references(() => packages.id, {
      onDelete: "set null",
    }),
    status: varchar("status", { length: 30 }).notNull().default("new"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("reservations_status_created_idx").on(table.status, table.createdAt)],
);
