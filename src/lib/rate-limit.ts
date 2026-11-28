/**
 * In-memory rate limiter — aman untuk single-instance container di CT 101.
 * Jika nanti scale ke multi-instance, ganti dengan implementasi berbasis Redis.
 */

interface Entry {
  count: number;
  resetAt: number; // Unix ms
}

const store = new Map<string, Entry>();

// Bersihkan entry kedaluwarsa setiap 15 menit agar store tidak membengkak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (now > val.resetAt) store.delete(key);
  }
}, 15 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Periksa apakah permintaan dari `key` masih diperbolehkan.
 * @param key      Identifier unik, biasanya IP address
 * @param max      Maks permintaan dalam satu window (default 5)
 * @param windowMs Durasi window dalam ms (default 10 menit)
 */
export function checkRateLimit(
  key: string,
  max = 5,
  windowMs = 10 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, remaining: max - 1, resetAt: entry.resetAt };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}
