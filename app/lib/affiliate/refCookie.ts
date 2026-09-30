import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { normalizeAffiliateCode } from "@/app/lib/affiliate/code";

/** Tab session only. Closing the tab clears it. Not a cookie. */
const PARTNER_SESSION_KEY = "az_partner_ref";

function codeFromLocation(): string {
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

function readPartnerSession(): string {
  if (typeof window === "undefined") return "";
  try {
    return normalizeAffiliateCode(sessionStorage.getItem(PARTNER_SESSION_KEY) ?? "") ?? "";
  } catch {
    return "";
  }
}

/**
 * If this tab was opened from a partner link (`/r/CODE` or `?ref=`), remember that code
 * for the rest of the tab. A new partner link in the same tab replaces the previous one.
 */
export function captureAffiliateCodeFromLocation(): string {
  const fromUrl = codeFromLocation();
  if (!fromUrl || typeof window === "undefined") return readPartnerSession();
  try {
    sessionStorage.setItem(PARTNER_SESSION_KEY, fromUrl);
  } catch {
    return fromUrl;
  }
  return fromUrl;
}

/** Partner code for this browser tab. URL updates the session; otherwise the stored tab code. */
export function readAffiliateCode(): string {
  const fromUrl = codeFromLocation();
  if (fromUrl) return captureAffiliateCodeFromLocation();
  return readPartnerSession();
}

export function affiliateShareUrl(code: string): string {
  const c = normalizeAffiliateCode(code);
  if (!c) return "";
  const origin = PUBLIC_SITE_URL.replace(/\/+$/, "") || "http://localhost:3000";
  return `${origin}/r/${encodeURIComponent(c)}/`;
}

export function affiliateQrSrc(shareUrl: string, size = 180): string {
  if (!shareUrl) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(shareUrl)}`;
}
