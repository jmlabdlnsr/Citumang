import { asc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { articles, artikelKategori } from "@/db/schema";
import {
  createArticle,
  deleteArticle,
  toggleArticle,
  createArtikelKategori,
  deleteArtikelKategori,
} from "@/app/admin/actions";

export default async function ArticlesPage() {
  await connection();
  const [rows, kategoriRows] = await Promise.all([
    db.select().from(articles).orderBy(asc(articles.createdAt)),
    db.select().from(artikelKategori).orderBy(asc(artikelKategori.namaId)),
  ]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d87842]">Konten situs</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1.2px]">Artikel</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[#e2e6df] bg-white p-5">
          <h2 className="mb-5 text-[16px] font-extrabold">Tambah artikel</h2>
          <form action={createArticle} className="space-y-4">
            <TextField label="Slug" name="slug" placeholder="tips-rafting-citumang" />
            <TextField label="Judul Indonesia" name="titleId" />
            <TextField label="Judul Inggris" name="titleEn" />
            <div>
              <label className="mb-2 block text-xs font-bold" htmlFor="kategoriId">
                Kategori
              </label>
              <select
                id="kategoriId"
                name="kategoriId"
                className="h-11 w-full rounded-xl border border-[#dfe4dd] px-3 text-sm"
              >
                <option value="">— Tanpa kategori —</option>
                {kategoriRows.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.namaId}
                  </option>
                ))}
              </select>
            </div>
            <TextArea label="Ringkas Indonesia" name="excerptId" />
            <TextArea label="Ringkas Inggris" name="excerptEn" />
            <TextArea label="Isi Indonesia" name="contentId" />
            <TextArea label="Isi Inggris" name="contentEn" />
            <label className="flex items-center gap-3 text-xs font-bold">
              <input type="checkbox" name="published" value="true" className="size-4 accent-[#d87842]" />
              Terbitkan sekarang
            </label>
            <button className="h-11 w-full rounded-xl bg-[#d87842] text-xs font-bold text-white">Tambah artikel</button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
          <div className="border-b border-[#edf0ea] px-5 py-4">
            <h2 className="text-[16px] font-extrabold">Semua artikel</h2>
          </div>
          {rows.length ? (
            <div className="divide-y divide-[#edf0ea]">
              {rows.map((item) => {
                const kat = kategoriRows.find((k) => k.id === item.kategoriId);
                return (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-bold">{item.titleId}</p>
                      <p className="mt-1 text-xs text-[#68736d]">
                        {item.slug}
                        {kat ? (
                          <span className="ml-2 rounded bg-[#edf0ea] px-1.5 py-0.5 text-[10px] font-semibold">
                            {kat.namaId}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={toggleArticle}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                        <button className="rounded-lg border border-[#dfe4dd] px-3 py-2 text-[11px] font-bold">
                          {item.published ? "Arsipkan" : "Terbitkan"}
                        </button>
                      </form>
                      <form action={deleteArticle}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="rounded-lg border border-[#ead9d4] px-3 py-2 text-[11px] font-bold text-[#a54f3d]">Hapus</button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-[#68736d]">Belum ada artikel.</p>
          )}
        </section>
      </div>

      {/* ── Manajemen Kategori ── */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[#e2e6df] bg-white p-5">
          <h2 className="mb-5 text-[16px] font-extrabold">Tambah kategori</h2>
          <form action={createArtikelKategori} className="space-y-4">
            <TextField label="Slug" name="slug" placeholder="panduan-wisata" />
            <TextField label="Nama Indonesia" name="namaId" placeholder="Panduan Wisata" />
            <TextField label="Nama Inggris" name="namaEn" placeholder="Travel Guide" />
            <button className="h-11 w-full rounded-xl bg-[#17362d] text-xs font-bold text-white">Tambah kategori</button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
          <div className="border-b border-[#edf0ea] px-5 py-4">
            <h2 className="text-[16px] font-extrabold">Kategori artikel</h2>
          </div>
          {kategoriRows.length ? (
            <div className="divide-y divide-[#edf0ea]">
              {kategoriRows.map((k) => (
                <div key={k.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div>
                    <p className="font-bold text-sm">{k.namaId}</p>
                    <p className="text-xs text-[#68736d]">{k.slug}</p>
                  </div>
                  <form action={deleteArtikelKategori}>
                    <input type="hidden" name="id" value={k.id} />
                    <button className="rounded-lg border border-[#ead9d4] px-3 py-2 text-[11px] font-bold text-[#a54f3d]">Hapus</button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-[#68736d]">Belum ada kategori.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function TextField({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold" htmlFor={name}>{label}</label>
      <input id={name} name={name} required placeholder={placeholder} className="h-11 w-full rounded-xl border border-[#dfe4dd] px-3 text-sm" />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} rows={3} className="w-full rounded-xl border border-[#dfe4dd] px-3 py-2 text-sm" />
    </div>
  );
}
