CREATE TABLE "admin_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "articles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(180) NOT NULL,
	"title_id" varchar(180) NOT NULL,
	"title_en" varchar(180) NOT NULL,
	"excerpt_id" text,
	"excerpt_en" text,
	"content_id" text,
	"content_en" text,
	"cover_cloudinary_public_id" varchar(255),
	"cover_cloudinary_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gallery_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title_id" varchar(160) NOT NULL,
	"title_en" varchar(160) NOT NULL,
	"alt_id" varchar(255) NOT NULL,
	"alt_en" varchar(255) NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"cloudinary_url" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "packages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(160) NOT NULL,
	"name_id" varchar(160) NOT NULL,
	"name_en" varchar(160) NOT NULL,
	"description_id" text,
	"description_en" text,
	"duration" varchar(100),
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"package_id" integer NOT NULL,
	"label_id" varchar(160) NOT NULL,
	"label_en" varchar(160) NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'IDR' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reservations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"guest_name" varchar(100) NOT NULL,
	"guest_phone" varchar(30),
	"visit_date" timestamp NOT NULL,
	"guest_count" integer NOT NULL,
	"package_id" integer,
	"status" varchar(30) DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("published","published_at");--> statement-breakpoint
CREATE INDEX "gallery_active_sort_idx" ON "gallery_items" USING btree ("active","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "packages_slug_idx" ON "packages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "packages_active_sort_idx" ON "packages" USING btree ("active","sort_order");--> statement-breakpoint
CREATE INDEX "prices_package_idx" ON "prices" USING btree ("package_id");--> statement-breakpoint
CREATE INDEX "prices_active_sort_idx" ON "prices" USING btree ("active","sort_order");--> statement-breakpoint
CREATE INDEX "reservations_status_created_idx" ON "reservations" USING btree ("status","created_at");