export const AFFILIATE_COOKIE = "az_ref";

export function normalizeAffiliateCode(raw: string): string | null {
  const c = raw.trim().toUpperCase();
  return /^[A-Za-z0-9]{6,12}$/.test(c) ? c : null;
}
