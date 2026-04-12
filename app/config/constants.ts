import {
  absoluteUrl,
  PUBLIC_API_BASE_URL,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_PHONE,
  PUBLIC_FORM_SUBMIT_AJAX_URL,
  PUBLIC_GOOGLE_MAPS_EMBED_URL,
  PUBLIC_INDIA_MAP_FALLBACK_SVG_URL,
  PUBLIC_INDIA_MAP_SVG_URL,
  PUBLIC_SITE_URL,
} from "./publicEnv";

export const COLORS = {
  PRIMARY: "#2F73F2",
  GRADIENT_START: "#ffa104",
  GRADIENT_END: "#ff4512",
} as const;

/** Email / phone from NEXT_PUBLIC_CONTACT_* in .env.local */
export const CONTACT = {
  PHONE: PUBLIC_CONTACT_PHONE,
  EMAIL: PUBLIC_CONTACT_EMAIL,
} as const;

export {
  absoluteUrl,
  PUBLIC_API_BASE_URL,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_PHONE,
  PUBLIC_FORM_SUBMIT_AJAX_URL,
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
  { title: "Home Loan", description: "Instant approval at lowest interest rates" },
  { title: "Personal Loan", description: "Paperless process at low rate" },
  { title: "Business Loan", description: "Fund your business with flexible tenure" },
  { title: "Credit Card", description: "Choose cards from all top banks" },
  { title: "Insurance", description: "Protect your life, health and assets" },
] as const;

export const COMPANY_STATS = [
  { value: "99%", label: "Happy Customers" },
  { value: "80K+", label: "Loans Disbursed" },
  { value: "50+", label: "Bank Partners" },
] as const;

export const SOCIAL_LINKS = {
  FACEBOOK: "#/",
  TWITTER: "#/",
} as const;
