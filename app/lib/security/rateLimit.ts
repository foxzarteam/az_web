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
  const picks = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
  ];
  for (const raw of picks) {
    const value = raw?.trim();
    if (!value) continue;
    for (const part of value.split(",")) {
      const hop = part.trim();
      if (!hop || hop === "unknown") continue;
      if (
        hop === "::1" ||
        hop.startsWith("127.") ||
        hop.startsWith("10.") ||
        hop.startsWith("192.168.") ||
        hop.startsWith("169.254.")
      ) {
        continue;
      }
      return hop;
    }
  }
  return "unknown";
}
