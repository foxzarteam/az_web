/**
 * Display helpers for admin IP / location (pure, testable).
 * Run: node --experimental-strip-types app/lib/admin/formatIpLocation.test.ts
 * or: npx ts-node --transpile-only (from monorepo scripts).
 */

export function formatIpLocationDisplay(
  ip: string | null | undefined,
  location: string | null | undefined,
): string {
  const ipTrim = String(ip ?? "").trim();
  const locTrim = String(location ?? "").trim();
  if (!ipTrim && !locTrim) return "—";
  if (locTrim && ipTrim) return `${locTrim} (${ipTrim})`;
  if (locTrim) return locTrim;
  return ipTrim;
}
