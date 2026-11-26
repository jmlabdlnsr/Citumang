import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return Response.json(
      { status: "ok", db: "ok", timestamp: new Date().toISOString() },
      { status: 200 },
    );
  } catch (err) {
    console.error("[healthcheck] database unreachable:", err);
    return Response.json(
      { status: "error", db: "unreachable", timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
