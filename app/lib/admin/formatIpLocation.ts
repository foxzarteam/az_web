/**
 * Display helpers for admin IP / location.
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
