import Image from "next/image";
import { asc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { createGalleryItem, deleteGalleryItem } from "@/app/admin/actions";
import { isStorageConfigured } from "@/lib/storage";

export default async function GalleryPage() {
  await connection();
  const rows = await db
    .select()
    .from(galleryItems)
    .orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id));

  const minioReady = isStorageConfigured();

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d87842]">Media</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1.2px]">Galeri</h1>
        {!minioReady && (
          <p className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-800">
            ⚠ MinIO belum dikonfigurasi. File akan disimpan lokal dan/atau ke Cloudinary.
            Set <code>MINIO_ENDPOINT</code>, <code>MINIO_ACCESS_KEY</code>, <code>MINIO_SECRET_KEY</code>,{" "}
            <code>MINIO_BUCKET</code> di environment variables.
          </p>
        )}
      </header>

      <section className="mb-6 rounded-2xl border border-[#e2e6df] bg-white p-5">
        <h2 className="mb-5 text-[16px] font-extrabold">Unggah foto</h2>
        <form action={createGalleryItem} className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1.3fr]">
          <TextField label="Judul Indonesia" name="titleId" />
          <TextField label="Judul Inggris" name="titleEn" />
          <TextField label="Alt Indonesia" name="altId" />
          <TextField label="Alt Inggris" name="altEn" />
          <div>
            <label className="mb-2 block text-xs font-bold" htmlFor="file">File gambar</label>
            <input id="file" name="file" type="file" accept="image/*" required className="block h-11 w-full text-xs file:mr-3 file:h-11 file:border-0 file:bg-[#17362d] file:px-4 file:text-xs file:font-bold file:text-white" />
          </div>
          <button className="h-11 rounded-xl bg-[#d87842] text-xs font-bold text-white md:col-span-2 xl:col-span-5">
            {minioReady ? "Unggah ke MinIO" : "Unggah (lokal)"}
          </button>
        </form>
      </section>

      {rows.length ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((item) => {
            // Prioritas sumber gambar: MinIO objectKey URL > localUrl > cloudinaryUrl
            const imgSrc = item.objectKey
              ? item.localUrl // localUrl diisi publicUrl MinIO saat upload baru
              : item.localUrl ?? item.cloudinaryUrl ?? null;

            return (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
                <div className="relative aspect-[4/3] bg-[#edf0ea]">
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc}
                      alt={item.altId}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{item.titleId}</p>
                    <p className="truncate text-[10px] text-[#68736d]">
                      {item.objectKey ?? item.cloudinaryPublicId ?? "lokal"}
                    </p>
                  </div>
                  <form action={deleteGalleryItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="shrink-0 rounded-lg border border-[#ead9d4] px-3 py-2 text-[11px] font-bold text-[#a54f3d]">
                      Hapus
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-[#e2e6df] bg-white px-5 py-12 text-center text-sm text-[#68736d]">
          Belum ada foto di galeri.
        </section>
      )}
    </div>
  );
}

function TextField({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold" htmlFor={name}>{label}</label>
      <input id={name} name={name} required className="h-11 w-full rounded-xl border border-[#dfe4dd] px-3 text-sm" />
    </div>
  );
}
