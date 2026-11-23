import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSession, getAdminSession, verifyAdminCredentials } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const user = await verifyAdminCredentials(email, password);
  if (!user) {
    redirect("/admin/login?error=invalid");
  }
  await createSession(user.id);
  redirect("/admin/dashboard");
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  const { error } = await searchParams;

  return (
    <main className="min-h-screen grid place-items-center bg-[#edf1ec] px-5 py-10">
      <div className="w-full max-w-[440px] rounded-[24px] border border-[#dde3dc] bg-white p-7 shadow-[0_24px_70px_rgba(29,43,38,.12)] sm:p-10">
        <div className="mb-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#d87842] text-xl font-black text-white">
            C
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d87842]">
            Citumang Admin
          </p>
          <h1 className="mt-2 text-[32px] font-extrabold tracking-[-1.2px]">Masuk dashboard</h1>
        </div>

        {error === "invalid" && (
          <p className="mb-5 rounded-xl border border-[#efc4c0] bg-[#fff5f3] px-4 py-3 text-sm text-[#a43a32]">
            Email atau kata sandi tidak sesuai.
          </p>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-[#dfe4dd] px-4 outline-none transition focus:border-[#d87842] focus:ring-3 focus:ring-[#d87842]/15"
              placeholder="admin@citumang.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold" htmlFor="password">
              Kata sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-[#dfe4dd] px-4 outline-none transition focus:border-[#d87842] focus:ring-3 focus:ring-[#d87842]/15"
              placeholder="Masukkan kata sandi"
            />
          </div>
          <button className="h-12 w-full rounded-xl bg-[#d87842] text-sm font-bold text-white transition hover:bg-[#b65b2d]">
            Masuk
          </button>
        </form>
      </div>
    </main>
  );
}
