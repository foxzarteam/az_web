export const COLORS = {
  PRIMARY: "#2F73F2",
  PRIMARY_DARK: "#1e5fd9",
  GRADIENT_START: "#ffa104",
  GRADIENT_END: "#ff4512",
  GRADIENT: "linear-gradient(135deg, #ffa104 0%, #ff4512 100%)",
} as const;

export const CONTACT = {
  PHONE: "+919098870980",
  EMAIL: "info@apnizaroorat.com",
} as const;

export const LOAN_LIMITS = {
  MIN_AMOUNT: 10000,
  MAX_AMOUNT: 10000000,
  MIN_RATE: 1,
  MAX_RATE: 30,
  MIN_TENURE: 1,
  MAX_TENURE: 30,
  STEP_AMOUNT: 10000,
  STEP_RATE: 0.1,
} as const;

export const MOBILE_VALIDATION = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 10,
} as const;

export const SCROLL_THRESHOLD = 300;

export const DEFAULT_IMAGES = {
  HERO: "/images/hero/hero.png",
  LOGO_WHITE: "/images/logo/logo-white.svg",
} as const;

export const FEATURED_SERVICES = [
  { title: "Home Loan", description: "Instant approval at lowest interest rates", badge: "Quick Sanction" },
  { title: "Personal Loan", description: "Paperless process at low rate", badge: "Quick Disbursal" },
  { title: "Business Loan", description: "Fund your business with flexible tenure", badge: "Flexible Repayment" },
  { title: "Credit Card", description: "Choose cards from all top banks", badge: "Rewards Unlimited" },
] as const;

export const COMPANY_STATS = [
  { value: "99%", label: "Happy Customers" },
  { value: "50K+", label: "Loans Disbursed" },
  { value: "25+", label: "Bank Partners" },
] as const;

export const SOCIAL_LINKS = {
  FACEBOOK: "#/",
  TWITTER: "#/",
} as const;
