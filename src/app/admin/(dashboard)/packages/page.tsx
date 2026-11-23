import { asc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { packages, prices } from "@/db/schema";
import {
  createPackage,
  createPrice,
  deletePackage,
  deletePrice,
} from "@/app/admin/actions";

export default async function PackagesPage() {
  await connection();
  const [packageRows, priceRows] = await Promise.all([
    db.select().from(packages).orderBy(asc(packages.sortOrder), asc(packages.id)),
    db.select().from(prices).orderBy(asc(prices.sortOrder), asc(prices.id)),
  ]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d87842]">Konten wisata</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1.2px]">Paket & Harga</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-2xl border border-[#e2e6df] bg-white">
          <div className="border-b border-[#edf0ea] px-5 py-4">
            <h2 className="text-[16px] font-extrabold">Daftar paket</h2>
          </div>
          {packageRows.length ? (
            <div className="divide-y divide-[#edf0ea]">
              {packageRows.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="font-bold">{item.nameId}</p>
                    <p className="text-xs text-[#68736d]">{item.nameEn} · {item.duration || "Durasi belum diatur"}</p>
                  </div>
                  <form action={deletePackage}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-lg border border-[#ead9d4] px-3 py-2 text-[11px] font-bold text-[#a54f3d]">
                      Hapus
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-[#68736d]">Belum ada paket wisata.</p>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#e2e6df] bg-white p-5">
            <h2 className="mb-5 text-[16px] font-extrabold">Tambah paket</h2>
            <form action={createPackage} className="space-y-4">
              <Field label="Slug" name="slug" placeholder="paket-river-tubing" />
              <Field label="Nama Indonesia" name="nameId" />
              <Field label="Nama Inggris" name="nameEn" />
              <Field label="Durasi" name="duration" placeholder="3 jam" />
              <TextArea label="Deskripsi Indonesia" name="descriptionId" />
              <TextArea label="Deskripsi Inggris" name="descriptionEn" />
              <Submit label="Tambah paket" />
            </form>
          </section>

          {packageRows.length > 0 && (
            <section className="rounded-2xl border border-[#e2e6df] bg-white p-5">
              <h2 className="mb-5 text-[16px] font-extrabold">Tambah harga</h2>
              <form action={createPrice} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold">Paket</label>
                  <select name="packageId" required className="h-11 w-full rounded-xl border border-[#dfe4dd] px-3 text-sm">
                    {packageRows.map((item) => (
                      <option key={item.id} value={item.id}>{item.nameId}</option>
                    ))}
                  </select>
                </div>
                <Field label="Label Indonesia" name="labelId" placeholder="Per orang" />
                <Field label="Label Inggris" name="labelEn" placeholder="Per person" />
                <Field label="Harga (IDR)" name="amount" type="number" placeholder="150000" />
                <Submit label="Tambah harga" />
              </form>
            </section>
          )}
        </div>
      </div>

      {priceRows.length > 0 && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
          <div className="border-b border-[#edf0ea] px-5 py-4">
            <h2 className="text-[16px] font-extrabold">Daftar harga</h2>
          </div>
          <div className="divide-y divide-[#edf0ea]">
            {priceRows.map((item) => {
              const packageName = packageRows.find((row) => row.id === item.packageId)?.nameId ?? "Paket";
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-bold">{packageName}</p>
                    <p className="text-xs text-[#68736d]">{item.labelId} · Rp {item.amount.toLocaleString("id-ID")}</p>
                  </div>
                  <form action={deletePrice}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-lg border border-[#ead9d4] px-3 py-2 text-[11px] font-bold text-[#a54f3d]">Hapus</button>
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} required className="h-11 w-full rounded-xl border border-[#dfe4dd] px-3 text-sm outline-none focus:border-[#d87842]" />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} rows={3} className="w-full rounded-xl border border-[#dfe4dd] px-3 py-2 text-sm outline-none focus:border-[#d87842]" />
    </div>
  );
}

function Submit({ label }: { label: string }) {
  return <button className="h-11 w-full rounded-xl bg-[#d87842] text-xs font-bold text-white">{label}</button>;
}
