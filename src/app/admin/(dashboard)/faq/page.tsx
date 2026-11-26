import { asc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { faq } from "@/db/schema";
import { createFaq, deleteFaq, toggleFaq } from "@/app/admin/actions";

export default async function FaqPage() {
  await connection();
  const rows = await db.select().from(faq).orderBy(asc(faq.urutan), asc(faq.id));

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d87842]">
          Konten situs
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1.2px]">
          FAQ
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
        {/* Form tambah FAQ */}
        <section className="rounded-2xl border border-[#e2e6df] bg-white p-5">
          <h2 className="mb-5 text-[16px] font-extrabold">Tambah pertanyaan</h2>
          <form action={createFaq} className="space-y-4">
            <TextArea label="Pertanyaan (Indonesia)" name="pertanyaanId" required />
            <TextArea label="Pertanyaan (Inggris)" name="pertanyaanEn" required />
            <TextArea label="Jawaban (Indonesia)" name="jawabanId" rows={4} required />
            <TextArea label="Jawaban (Inggris)" name="jawabanEn" rows={4} required />
            <div>
              <label className="mb-2 block text-xs font-bold" htmlFor="urutan">
                Urutan tampil
              </label>
              <input
                id="urutan"
                name="urutan"
                type="number"
                min={0}
                defaultValue={rows.length + 1}
                className="h-11 w-32 rounded-xl border border-[#dfe4dd] px-3 text-sm"
              />
            </div>
            <button className="h-11 w-full rounded-xl bg-[#d87842] text-xs font-bold text-white">
              Tambah FAQ
            </button>
          </form>
        </section>

        {/* Daftar FAQ */}
        <section className="overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
          <div className="border-b border-[#edf0ea] px-5 py-4">
            <h2 className="text-[16px] font-extrabold">Semua FAQ ({rows.length})</h2>
          </div>
          {rows.length ? (
            <div className="divide-y divide-[#edf0ea]">
              {rows.map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="mr-2 inline-block rounded-md bg-[#edf0ea] px-2 py-0.5 text-[10px] font-bold text-[#68736d]">
                        #{item.urutan}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.aktif
                            ? "bg-[#e8f1ec] text-[#356957]"
                            : "bg-[#f4f0ea] text-[#86612f]"
                        }`}
                      >
                        {item.aktif ? "Aktif" : "Disembunyikan"}
                      </span>
                      <p className="mt-2 text-sm font-bold">{item.pertanyaanId}</p>
                      <p className="mt-1 text-xs text-[#68736d] line-clamp-2">
                        {item.jawabanId}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <form action={toggleFaq}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="aktif"
                          value={item.aktif ? "false" : "true"}
                        />
                        <button className="rounded-lg border border-[#dfe4dd] px-3 py-2 text-[11px] font-bold">
                          {item.aktif ? "Sembunyikan" : "Tampilkan"}
                        </button>
                      </form>
                      <form action={deleteFaq}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="rounded-lg border border-[#ead9d4] px-3 py-2 text-[11px] font-bold text-[#a54f3d]">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-[#68736d]">
              Belum ada FAQ.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function TextArea({
  label,
  name,
  rows = 2,
  required,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        className="w-full rounded-xl border border-[#dfe4dd] px-3 py-2 text-sm"
      />
    </div>
  );
}
