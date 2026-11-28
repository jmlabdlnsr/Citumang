/**
 * POST /api/reservasi — satu-satunya jalur tulis anonim ke database (§6.5).
 * Rate limit: 5 permintaan per 10 menit per IP.
 * Dipakai sebagai skenario beban utama JMeter Skenario C (§9.2).
 */

import { db } from "@/db";
import { packages, reservations } from "@/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reservasiSchema = z.object({
  guestName: z.string().trim().min(2).max(100),
  guestPhone: z.string().trim().max(30).optional().or(z.literal("")),
  guestEmail: z.string().trim().email().max(255).optional().or(z.literal("")),
  visitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  guestCount: z.coerce.number().int().min(1).max(200),
  packageId: z.coerce.number().int().positive().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function generateKode(): string {
  const dateStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" })
    .format(new Date())
    .replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CTM-${dateStr}-${rand}`;
}

export async function POST(request: Request) {
  // ── Rate limiting ────────────────────────────────────────────────────────
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const rl = checkRateLimit(ip, 5, 10 * 60 * 1000);

  if (!rl.allowed) {
    return Response.json(
      { error: "Terlalu banyak permintaan. Coba lagi dalam beberapa menit." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const parsed = reservasiSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Data tidak valid.", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // ── Validasi tanggal (harus hari ini atau setelahnya, zona Asia/Jakarta) ──
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(
    new Date(),
  );
  if (data.visitDate < today) {
    return Response.json(
      { error: "Tanggal kunjungan harus hari ini atau setelahnya." },
      { status: 422 },
    );
  }

  // ── Validasi paket (opsional) ─────────────────────────────────────────────
  const packageId =
    data.packageId && typeof data.packageId === "number" ? data.packageId : null;
  if (packageId) {
    const [pkg] = await db
      .select({ id: packages.id })
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);
    if (!pkg) {
      return Response.json(
        { error: "Paket wisata tidak ditemukan." },
        { status: 422 },
      );
    }
  }

  // ── Generate kode unik (retry jika collision) ─────────────────────────────
  let kodeReservasi = generateKode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const [existing] = await db
      .select({ id: reservations.id })
      .from(reservations)
      .where(eq(reservations.kodeReservasi, kodeReservasi))
      .limit(1);
    if (!existing) break;
    kodeReservasi = generateKode();
  }

  // ── Simpan ke database ────────────────────────────────────────────────────
  await db.insert(reservations).values({
    kodeReservasi,
    guestName: data.guestName,
    guestPhone: data.guestPhone || null,
    guestEmail: data.guestEmail || null,
    visitDate: new Date(data.visitDate + "T12:00:00+07:00"),
    guestCount: data.guestCount,
    packageId,
    notes: data.notes || null,
  });

  return Response.json({ kodeReservasi }, { status: 201 });
}
