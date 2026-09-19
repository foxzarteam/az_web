import {
  PUBLIC_CONTACT_ADDRESS,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_PHONE,
  PUBLIC_CONTACT_PHONE_TEL,
  PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL,
  PUBLIC_GOOGLE_MAPS_EMBED_URL,
  PUBLIC_INDIA_MAP_FALLBACK_SVG_URL,
  PUBLIC_INDIA_MAP_SVG_URL,
  PUBLIC_SITE_URL,
} from "./publicEnv";

export const COLORS = {
  PRIMARY: "#4236FB",
  GRADIENT_START: "#4236FB",
  GRADIENT_END: "#FF7E29",
} as const;

/** Email from env; phone and address from publicEnv (display + tel/directions href). */
export const CONTACT = {
  PHONE: PUBLIC_CONTACT_PHONE,
  PHONE_TEL: PUBLIC_CONTACT_PHONE_TEL,
  EMAIL: PUBLIC_CONTACT_EMAIL,
  ADDRESS: PUBLIC_CONTACT_ADDRESS,
  MAPS_DIRECTIONS_URL: PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL,
} as const;

export {
  PUBLIC_CONTACT_ADDRESS,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_PHONE,
  PUBLIC_CONTACT_PHONE_TEL,
  PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL,
  PUBLIC_GOOGLE_MAPS_EMBED_URL,
  PUBLIC_INDIA_MAP_FALLBACK_SVG_URL,
  PUBLIC_INDIA_MAP_SVG_URL,
  PUBLIC_SITE_URL,
};

/**
 * Bounds for the home personal loan EMI calculator (illustrative ranges; actual offers vary by lender).
 * EMI uses the standard monthly reducing-balance formula used for personal loans in India.
 * STEP_AMOUNT must divide (MAX_AMOUNT - MIN_AMOUNT) exactly so the slider can reach ₹10L.
 */
export const PERSONAL_LOAN_EMI_LIMITS = {
  MIN_AMOUNT: 25_000,
  MAX_AMOUNT: 10_00_000,
  MIN_RATE: 10,
  MAX_RATE: 26,
  MIN_TENURE: 1,
  MAX_TENURE: 7,
  STEP_AMOUNT: 5_000,
  STEP_RATE: 0.1,
} as const;

export const MOBILE_VALIDATION = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 10,
} as const;

export const DEFAULT_IMAGES = {
  HERO: "/images/hero/hero.webp",
} as const;

export const SOCIAL_LINKS = {
  INSTAGRAM: "https://www.instagram.com/apni_zaroorat",
  YOUTUBE: "https://www.youtube.com/@Apni_Zaroorat",
  FACEBOOK: "https://www.facebook.com/apnizaroorat",
} as const;
