import "server-only";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";

const sessionCookie = "citumang-admin-session";

function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "citumang-local-development-session-secret"
      : "");
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const userId = payload.userId;
    if (typeof userId !== "number") return null;

    const [user] = await db
      .select({
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
      })
      .from(adminUsers)
      .where(eq(adminUsers.id, userId))
      .limit(1);

    if (!user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.trim().toLowerCase()))
    .limit(1);

  if (!user || !user.active) return null;
  if (!(await bcrypt.compare(password, user.passwordHash))) return null;
  return user;
}
