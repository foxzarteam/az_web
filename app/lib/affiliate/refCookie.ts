import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { AFFILIATE_COOKIE, normalizeAffiliateCode } from "@/app/lib/affiliate/code";

export { AFFILIATE_COOKIE } from "@/app/lib/affiliate/code";

/**
 * Partner code only from the current page URL (`/r/CODE` or `?ref=`).
 * Cookie is not used for attribution (legacy cookie name kept for clear-on-middleware).
 */
export function readAffiliateCode(): string {
  if (typeof window === "undefined") return "";

  const path = window.location.pathname || "";
  const pathMatch = path.match(/^\/r\/([A-Za-z0-9]{6,12})\/?$/i);
  if (pathMatch) {
    return normalizeAffiliateCode(pathMatch[1]) ?? "";
  }

  try {
    const ref = new URLSearchParams(window.location.search).get("ref");
    return normalizeAffiliateCode(ref ?? "") ?? "";
  } catch {
    return "";
  }
}

export function affiliateShareUrl(code: string): string {
  const c = normalizeAffiliateCode(code);
  if (!c) return "";
  const origin = PUBLIC_SITE_URL.replace(/\/+$/, "") || "http://localhost:3000";
  // trailingSlash: true — include slash to avoid an extra redirect hop
  return `${origin}/r/${encodeURIComponent(c)}/`;
}

export function affiliateQrSrc(shareUrl: string, size = 180): string {
  if (!shareUrl) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(shareUrl)}`;
}
