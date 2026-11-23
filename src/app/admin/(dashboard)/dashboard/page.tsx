import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/db";
import { articles, galleryItems, packages, reservations } from "@/db/schema";

export default async function DashboardPage() {
  await connection();
  const [
    [{ value: packageCount }],
    [{ value: galleryCount }],
    [{ value: articleCount }],
    [{ value: reservationCount }],
    recentReservations,
  ] = await Promise.all([
    db.select({ value: count() }).from(packages),
    db.select({ value: count() }).from(galleryItems),
    db.select({ value: count() }).from(articles),
    db.select({ value: count() }).from(reservations),
    db
      .select()
      .from(reservations)
      .where(eq(reservations.status, "new"))
      .orderBy(desc(reservations.createdAt))
      .limit(5),
  ]);

  const cards = [
    { label: "Paket wisata", value: packageCount, href: "/admin/packages", tone: "bg-[#fff2e8] text-[#b65b2d]" },
    { label: "Galeri", value: galleryCount, href: "/admin/gallery", tone: "bg-[#e8f1ec] text-[#356957]" },
    { label: "Artikel", value: articleCount, href: "/admin/articles", tone: "bg-[#edf0f8] text-[#4d5f82]" },
    { label: "Reservasi baru", value: reservationCount, href: "/admin/reservations", tone: "bg-[#f7eee0] text-[#86612f]" },
  ];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d87842]">Dashboard</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-1.2px]">Ringkasan situs</h1>
        </div>
        <Link
          href="/id"
          target="_blank"
          className="rounded-xl border border-[#dde3dc] bg-white px-4 py-3 text-xs font-bold shadow-sm"
        >
          Lihat situs
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-[#e2e6df] bg-white p-5 shadow-[0_8px_30px_rgba(29,43,38,.04)] transition hover:-translate-y-0.5"
          >
            <div className={`mb-5 grid size-10 place-items-center rounded-xl text-lg ${card.tone}`}>
              {card.value}
            </div>
            <p className="text-xs text-[#68736d]">{card.label}</p>
            <p className="mt-1 text-2xl font-extrabold">{card.value}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
        <div className="flex items-center justify-between border-b border-[#edf0ea] px-5 py-4">
          <h2 className="text-[16px] font-extrabold">Reservasi terbaru</h2>
          <Link href="/admin/reservations" className="text-xs font-bold text-[#d87842]">
            Lihat semua
          </Link>
        </div>
        {recentReservations.length ? (
          <div className="divide-y divide-[#edf0ea]">
            {recentReservations.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-bold">{item.guestName}</p>
                  <p className="text-xs text-[#68736d]">
                    {item.guestCount} orang · {item.visitDate.toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span className="rounded-full bg-[#fff2e8] px-3 py-1.5 text-[10px] font-bold text-[#b65b2d]">
                  Baru
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-[#68736d]">
            Belum ada reservasi baru.
          </p>
        )}
      </section>
    </div>
  );
}
