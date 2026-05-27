/**
 * Client-safe public site config. Env vars (NEXT_PUBLIC_*) override these defaults.
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
const DEFAULT_PUBLIC_API_BASE = "https://server-nu-bay-20.vercel.app";

const DEFAULT_CONTACT_EMAIL = "info@apnizaroorat.com";

/** Office address shown on the contact page and linked from the map. */
export const DEFAULT_CONTACT_ADDRESS = "Subhash Chowk, Jaipur, Rajasthan 302002";

const DEFAULT_GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Subhash+Chowk,+Jaipur,+Rajasthan+302002&hl=en&z=16&output=embed";

const DEFAULT_INDIA_MAP_SVG_URL = "https://simplemaps.com/static/svg/country/in/admin1/in.svg";

const DEFAULT_INDIA_MAP_FALLBACK_SVG_URL =
  "https://upload.wikimedia.org/wikipedia/commons/4/41/India_states_and_union_territories_map.svg";

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

export const PUBLIC_CONTACT_EMAIL =
  normalizeEnvValue(process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim() || DEFAULT_CONTACT_EMAIL;

export const PUBLIC_CONTACT_ADDRESS =
  normalizeEnvValue(process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? "").trim() || DEFAULT_CONTACT_ADDRESS;

/** Opens Google Maps for directions to the office address. */
export const PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PUBLIC_CONTACT_ADDRESS)}`;

/**
 * Site-wide support number (footer, contact page).
 * Intentionally not read from NEXT_PUBLIC_* so static export / stale CI env
 * cannot leave the wrong number on /contact.
 */
const SITE_CONTACT_PHONE_NATIONAL = "9251283215";
/** Display: +91 prefix and spaced local number */
export const PUBLIC_CONTACT_PHONE = `+91 ${SITE_CONTACT_PHONE_NATIONAL.slice(0, 5)} ${SITE_CONTACT_PHONE_NATIONAL.slice(5)}`;
/** Use in `href={\`tel:${...}\`}` (E.164-style, no spaces) */
export const PUBLIC_CONTACT_PHONE_TEL = `+91${SITE_CONTACT_PHONE_NATIONAL}`;

/** FormSubmit.co JSON endpoint for the contact email. */
export const PUBLIC_FORM_SUBMIT_AJAX_URL = PUBLIC_CONTACT_EMAIL
  ? `https://formsubmit.co/ajax/${PUBLIC_CONTACT_EMAIL}`
  : "";

export const PUBLIC_GOOGLE_MAPS_EMBED_URL =
  normalizeEnvValue(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? "").trim() ||
  DEFAULT_GOOGLE_MAPS_EMBED_URL;

export const PUBLIC_INDIA_MAP_SVG_URL =
  normalizeEnvValue(process.env.NEXT_PUBLIC_INDIA_MAP_SVG_URL ?? "").trim() || DEFAULT_INDIA_MAP_SVG_URL;

export const PUBLIC_INDIA_MAP_FALLBACK_SVG_URL =
  normalizeEnvValue(process.env.NEXT_PUBLIC_INDIA_MAP_FALLBACK_SVG_URL ?? "").trim() ||
  DEFAULT_INDIA_MAP_FALLBACK_SVG_URL;
