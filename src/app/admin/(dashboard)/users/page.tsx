import { asc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import {
  createAdminUser,
  deleteAdminUser,
  toggleAdminUser,
} from "@/app/admin/actions";

export default async function UsersPage() {
  await connection();
  const [session, rows] = await Promise.all([
    getAdminSession(),
    db.select().from(adminUsers).orderBy(asc(adminUsers.createdAt)),
  ]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d87842]">
          Keamanan
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1.2px]">
          Akun Admin
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Form buat akun baru */}
        <section className="rounded-2xl border border-[#e2e6df] bg-white p-5">
          <h2 className="mb-5 text-[16px] font-extrabold">Tambah akun</h2>
          <form action={createAdminUser} className="space-y-4">
            <TextField label="Nama" name="name" placeholder="Nama lengkap" />
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="admin@example.com"
            />
            <TextField
              label="Kata sandi"
              name="password"
              type="password"
              placeholder="Minimal 8 karakter"
            />
            <button className="h-11 w-full rounded-xl bg-[#d87842] text-xs font-bold text-white">
              Buat akun
            </button>
          </form>
        </section>

        {/* Daftar akun */}
        <section className="overflow-hidden rounded-2xl border border-[#e2e6df] bg-white">
          <div className="border-b border-[#edf0ea] px-5 py-4">
            <h2 className="text-[16px] font-extrabold">
              Semua akun ({rows.length})
            </h2>
          </div>
          {rows.length ? (
            <div className="divide-y divide-[#edf0ea]">
              {rows.map((user) => {
                const isSelf = user.id === session?.id;
                return (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{user.name}</p>
                        {isSelf && (
                          <span className="rounded-full bg-[#edf0ea] px-2 py-0.5 text-[10px] font-bold text-[#68736d]">
                            Anda
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            user.active
                              ? "bg-[#e8f1ec] text-[#356957]"
                              : "bg-[#fdf0ef] text-[#a54f3d]"
                          }`}
                        >
                          {user.active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#68736d]">{user.email}</p>
                      <p className="text-[10px] text-[#aebfb8]">
                        Dibuat:{" "}
                        {user.createdAt.toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })}
                      </p>
                    </div>
                    {!isSelf && (
                      <div className="flex shrink-0 gap-2">
                        <form action={toggleAdminUser}>
                          <input type="hidden" name="id" value={user.id} />
                          <input
                            type="hidden"
                            name="active"
                            value={user.active ? "false" : "true"}
                          />
                          <button className="rounded-lg border border-[#dfe4dd] px-3 py-2 text-[11px] font-bold">
                            {user.active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </form>
                        <form action={deleteAdminUser}>
                          <input type="hidden" name="id" value={user.id} />
                          <button className="rounded-lg border border-[#ead9d4] px-3 py-2 text-[11px] font-bold text-[#a54f3d]">
                            Hapus
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-[#68736d]">
              Belum ada akun admin.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function TextField({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#dfe4dd] px-3 text-sm"
      />
    </div>
  );
}
