import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { AFFILIATE_COOKIE, normalizeAffiliateCode } from "@/app/lib/affiliate/code";

export { AFFILIATE_COOKIE } from "@/app/lib/affiliate/code";

export function readAffiliateCode(): string {
  if (typeof document === "undefined") return "";
  const parts = document.cookie.split("; ");
  const row = parts.find((p) => p.startsWith(`${AFFILIATE_COOKIE}=`));
  if (!row) return "";
  return normalizeAffiliateCode(decodeURIComponent(row.slice(AFFILIATE_COOKIE.length + 1))) ?? "";
}

export function affiliateShareUrl(code: string): string {
  const c = normalizeAffiliateCode(code);
  if (!c) return "";
  const origin = PUBLIC_SITE_URL.replace(/\/+$/, "") || "http://localhost:3000";
  return `${origin}/r/${encodeURIComponent(c)}`;
}

export function affiliateQrSrc(shareUrl: string, size = 180): string {
  if (!shareUrl) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(shareUrl)}`;
}
