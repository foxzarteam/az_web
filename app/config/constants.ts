import {
  absoluteUrl,
  PUBLIC_API_BASE_URL,
  PUBLIC_CONTACT_ADDRESS,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_PHONE,
  PUBLIC_CONTACT_PHONE_TEL,
  PUBLIC_FORM_SUBMIT_AJAX_URL,
  PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL,
  PUBLIC_GOOGLE_MAPS_EMBED_URL,
  PUBLIC_INDIA_MAP_FALLBACK_SVG_URL,
  PUBLIC_INDIA_MAP_SVG_URL,
  PUBLIC_SITE_URL,
} from "./publicEnv";

export const COLORS = {
  PRIMARY: "#4236FB",
  PRIMARY_LIGHT: "#6B62FC",
  ACCENT: "#FF7E29",
  GRADIENT_START: "#4236FB",
  GRADIENT_MID: "#5A4DFC",
  GRADIENT_END: "#FF7E29",
} as const;

export const BRAND_GRADIENT =
  "linear-gradient(90deg, #4236FB 0%, #5A4DFC 50%, #FF7E29 100%)" as const;

/** Email from env; phone and address from publicEnv (display + tel/directions href). */
export const CONTACT = {
  PHONE: PUBLIC_CONTACT_PHONE,
  PHONE_TEL: PUBLIC_CONTACT_PHONE_TEL,
  EMAIL: PUBLIC_CONTACT_EMAIL,
  ADDRESS: PUBLIC_CONTACT_ADDRESS,
  MAPS_DIRECTIONS_URL: PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL,
} as const;

export {
  absoluteUrl,
  PUBLIC_API_BASE_URL,
  PUBLIC_CONTACT_ADDRESS,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_PHONE,
  PUBLIC_CONTACT_PHONE_TEL,
  PUBLIC_FORM_SUBMIT_AJAX_URL,
  PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL,
  PUBLIC_GOOGLE_MAPS_EMBED_URL,
  PUBLIC_INDIA_MAP_FALLBACK_SVG_URL,
  PUBLIC_INDIA_MAP_SVG_URL,
  PUBLIC_SITE_URL,
};

/**
 * Bounds for the home personal loan EMI calculator (illustrative ranges; actual offers vary by lender).
 * EMI uses the standard monthly reducing-balance formula used for personal loans in India.
 */
export const PERSONAL_LOAN_EMI_LIMITS = {
  MIN_AMOUNT: 50_000,
  MAX_AMOUNT: 50_00_000,
  MIN_RATE: 10.5,
  MAX_RATE: 26,
  MIN_TENURE: 1,
  MAX_TENURE: 7,
  STEP_AMOUNT: 10_000,
  STEP_RATE: 0.1,
} as const;

export const MOBILE_VALIDATION = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 10,
} as const;

export const SCROLL_THRESHOLD = 300;

export const DEFAULT_IMAGES = {
  HERO: "/images/hero/hero.png",
} as const;

export const FEATURED_SERVICES = [
  { title: "Personal Loan", description: "Paperless process at low rate" },
  { title: "Insurance", description: "Protect your life, health and assets" },
] as const;

export const SOCIAL_LINKS = {
  FACEBOOK: "#/",
  TWITTER: "#/",
} as const;
