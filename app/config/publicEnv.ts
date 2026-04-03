/**
 * Client-safe public configuration from .env.local (NEXT_PUBLIC_*).
 * Re-exported from @/app/config/constants. See env.local.example for keys.
 */

function trimTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

/** Strips accidental wrapping quotes from .env values */
function normalizeEnvValue(s: string): string {
  let v = s.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

/**
 * Lead API origin (https, no trailing slash).
 * If env is missing on static export, browser would call same-site `/api/leads` → 404 HTML → submit fails.
 * Override with NEXT_PUBLIC_API_URL when your backend URL changes.
 */
const DEFAULT_PUBLIC_API_BASE = "https://az-app-khaki.vercel.app";

function resolvePublicApiBaseUrl(): string {
  let raw = normalizeEnvValue(process.env.NEXT_PUBLIC_API_URL ?? "");
  if (!raw) return trimTrailingSlashes(DEFAULT_PUBLIC_API_BASE);
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  return trimTrailingSlashes(raw);
}

export const PUBLIC_API_BASE_URL = resolvePublicApiBaseUrl();

/**
 * Canonical front-end site origin (no trailing slash).
 * Resolution order — change only env, one place:
 * 1. NEXT_PUBLIC_SITE_URL — use for custom domain / static host (recommended for production)
 * 2. VERCEL_URL — auto on Vercel builds (preview & prod deployment host)
 * 3. http://localhost:3000 — local builds
 */
function resolvePublicSiteUrl(): string {
  const explicit = trimTrailingSlashes(
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim()
  );
  if (explicit) return explicit;

  const vercel = (process.env.VERCEL_URL ?? "").trim();
  if (vercel) {
    const origin = vercel.startsWith("http://") || vercel.startsWith("https://")
      ? vercel
      : `https://${vercel}`;
    return trimTrailingSlashes(origin);
  }

  return "http://localhost:3000";
}

export const PUBLIC_SITE_URL = resolvePublicSiteUrl();

/** Absolute URL for a site path (path must start with / or is normalized). */
export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_SITE_URL}${p}`;
}

export const PUBLIC_CONTACT_EMAIL = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();

export const PUBLIC_CONTACT_PHONE = (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "").trim();

/** FormSubmit.co JSON endpoint for the contact email. */
export const PUBLIC_FORM_SUBMIT_AJAX_URL = PUBLIC_CONTACT_EMAIL
  ? `https://formsubmit.co/ajax/${PUBLIC_CONTACT_EMAIL}`
  : "";

export const PUBLIC_GOOGLE_MAPS_EMBED_URL = (
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? ""
).trim();

export const PUBLIC_INDIA_MAP_SVG_URL = (
  process.env.NEXT_PUBLIC_INDIA_MAP_SVG_URL ?? ""
).trim();

export const PUBLIC_INDIA_MAP_FALLBACK_SVG_URL = (
  process.env.NEXT_PUBLIC_INDIA_MAP_FALLBACK_SVG_URL ?? ""
).trim();
