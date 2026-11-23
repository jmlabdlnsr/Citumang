import { desc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { updateReservationStatus } from "@/app/admin/actions";

const statuses = [
  ["new", "Baru"],
  ["confirmed", "Dikonfirmasi"],
  ["completed", "Selesai"],
  ["cancelled", "Dibatalkan"],
] as const;

export default async function ReservationsPage() {
  await connection();
  const rows = await db
    .select()
    .from(reservations)
    .orderBy(desc(reservations.createdAt));

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d87842]">Permintaan pengunjung</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1.2px]">Reservasi</h1>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
        {rows.length ? (
          <div className="divide-y divide-[#edf0ea]">
            {rows.map((item) => (
              <div key={item.id} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_180px_180px] md:items-center">
                <div>
                  <p className="font-bold">{item.guestName}</p>
                  <p className="text-xs text-[#68736d]">
                    {item.guestCount} orang · {item.visitDate.toLocaleDateString("id-ID")}
                  </p>
                  {item.guestPhone && (
                    <p className="mt-1 text-xs text-[#68736d]">{item.guestPhone}</p>
                  )}
                </div>
                <p className="text-xs text-[#68736d]">
                  {item.createdAt.toLocaleString("id-ID")}
                </p>
                <form action={updateReservationStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={item.id} />
                  <select name="status" defaultValue={item.status} className="h-10 min-w-0 flex-1 rounded-xl border border-[#dfe4dd] px-3 text-xs">
                    {statuses.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <button className="rounded-xl bg-[#17362d] px-3 text-[11px] font-bold text-white">Simpan</button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-[#68736d]">Belum ada reservasi.</p>
        )}
      </section>
    </div>
  );
}
