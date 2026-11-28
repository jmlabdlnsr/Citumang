import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { clearSession, getAdminSession } from "@/lib/auth";

const nav = [
  { href: "/admin/dashboard", label: "Ringkasan", icon: "▦" },
  { href: "/admin/packages", label: "Paket & Harga", icon: "◇" },
  { href: "/admin/gallery", label: "Galeri", icon: "□" },
  { href: "/admin/articles", label: "Artikel", icon: "≡" },
  { href: "/admin/reservations", label: "Reservasi", icon: "✓" },
  { href: "/admin/faq", label: "FAQ", icon: "?" },
  { href: "/admin/users", label: "Akun Admin", icon: "◎" },
];

async function logout() {
  "use server";
  await clearSession();
  redirect("/admin/login");
}

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f4f6f1] text-[#1d2b26] lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-[#dde3dc] bg-[#17362d] px-4 py-4 text-white lg:min-h-screen lg:border-r lg:border-b-0 lg:px-5 lg:py-7">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#d87842] text-lg font-black">
              C
            </span>
            <span>
              <strong className="block text-[15px]">Citumang</strong>
              <small className="block text-[10px] text-[#aebfb8]">Panel Admin</small>
            </span>
          </Link>
          <form action={logout} className="lg:hidden">
            <button className="rounded-lg border border-white/15 px-3 py-2 text-xs">Keluar</button>
          </form>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:block lg:space-y-1 lg:overflow-visible">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#cad7d1] transition hover:bg-white/8 hover:text-white lg:px-3.5"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-white/8 text-sm">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-white/10 pt-5 lg:block">
          <div className="mb-3 px-2">
            <p className="truncate text-xs font-bold">{session.name}</p>
            <p className="truncate text-[10px] text-[#aebfb8]">{session.email}</p>
          </div>
          <form action={logout}>
            <button className="w-full rounded-xl border border-white/10 px-3 py-2.5 text-left text-xs text-[#cad7d1] hover:bg-white/8">
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 p-4 sm:p-7 lg:p-10">{children}</main>
    </div>
  );
}
