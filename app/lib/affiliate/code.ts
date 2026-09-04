export const AFFILIATE_COOKIE = "az_ref";
export const AFFILIATE_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function normalizeAffiliateCode(raw: string): string | null {
  const c = raw.trim().toUpperCase();
  return /^[A-Za-z0-9]{6,12}$/.test(c) ? c : null;
}
