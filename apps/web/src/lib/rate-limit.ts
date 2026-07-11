// Simple in-memory rate limiter — no external service required.
//
// LIMITATION: state is per server instance/process. On a single long-running
// server (a VPS, a Docker container, `next start`) this works exactly as
// expected. On serverless platforms with multiple cold-started instances
// (e.g. Vercel under load) each instance has its own counters, so the
// *effective* limit is (your configured limit) × (number of warm instances)
// rather than a hard global cap. For a college project or early-stage
// product this is a reasonable, zero-dependency starting point; if you later
// need a hard global limit across many instances, swap this for
// `@upstash/ratelimit` (Redis-backed) — same call signature, drop-in.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so this Map doesn't grow unbounded on a long-lived process.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 60_000).unref?.();

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
