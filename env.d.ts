declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    NEXT_PUBLIC_CONTACT_EMAIL?: string;
    NEXT_PUBLIC_CONTACT_PHONE?: string;
    NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL?: string;
    NEXT_PUBLIC_INDIA_MAP_SVG_URL?: string;
    NEXT_PUBLIC_INDIA_MAP_FALLBACK_SVG_URL?: string;
    /** Dev only: prefilled admin login email (see LoginForm). */
    NEXT_PUBLIC_ADMIN_LOGIN_PREFILL_EMAIL?: string;
    /** Dev only: prefilled admin login password — must match `public.auth` row; never rely on this in prod (prefill disabled there). */
    NEXT_PUBLIC_ADMIN_LOGIN_PREFILL_PASSWORD?: string;
  }
}
