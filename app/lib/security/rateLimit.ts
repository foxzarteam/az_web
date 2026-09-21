/**
 * Simple in-memory rate limiter (same approach as Nest).
 * Per-process only — fine for single Next instance / warm isolate.
 */
const buckets = new Map<string, number[]>();

export function allowRateLimitedAction(
  key: string,
  maxPerWindow = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxPerWindow) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}

export function clientIpFromRequest(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const trueClient = request.headers.get("true-client-ip")?.trim();
  if (trueClient) return trueClient;
  const vercel = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) {
    const first = vercel.split(",")[0]?.trim();
    if (first) return first;
  }
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || "unknown";
}
