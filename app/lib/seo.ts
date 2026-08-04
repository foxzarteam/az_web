import type { Metadata } from "next";
import { CONTACT, PUBLIC_SITE_URL } from "@/app/config/constants";

/** Site-wide brand strings — keep in sync with root layout defaults. */
export const SITE_NAME = "Apni Zaroorat";
export const SITE_TAGLINE = "Personal Loans & Insurance Online";
export const SITE_DEFAULT_DESCRIPTION =
  "Apply online for personal loans from ₹25,000 to ₹10 lakh and explore insurance options with Apni Zaroorat. Check EMI and indicative eligibility before applying.";

export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";
export const DEFAULT_OG_IMAGE_ALT =
  "Apni Zaroorat — personal loans and insurance online";

/**
 * Public pages always open for Google / Bing crawl & index.
 * Admin stays noindex via `app/admin/layout.tsx` (not robots Disallow alone).
 */
export const SEO_INDEXING_ENABLED = true;

/**
 * Primary deep links Google may surface as sitelinks (must match real, strong pages).
 * Names + short snippets are written for SERP-style previews like the reference screenshot.
 */
export const SITELINK_PAGES = [
  {
    name: "About Company",
    path: "/about",
    description:
      "Apni Zaroorat is your trusted partner for personal loans and insurance — secure, transparent, India-wide.",
  },
  {
    name: "Personal Loan",
    path: "/products/personal-loan",
    description:
      "Instant personal loan online up to ₹10 lakh. Minimal documentation, digital process, fast approval path.",
  },
  {
    name: "Insurance",
    path: "/products/insurance",
    description:
      "Compare life, health and motor insurance plans online and apply with guided support from Apni Zaroorat.",
  },
  {
    name: "Contact Us",
    path: "/contact",
    description:
      "Email, call, or visit our Jaipur office. Get help for loans, insurance and application status.",
  },
  {
    name: "Become a Partner",
    path: "/become-partner",
    description:
      "Partner with Apni Zaroorat to distribute personal loans and insurance and grow your business.",
  },
] as const;

const DEFAULT_KEYWORDS = [
  "personal loan online",
  "personal loan India",
  "personal loan EMI calculator",
  "personal loan eligibility",
  "instant personal loan",
  "insurance online",
  "life insurance",
  "health insurance",
  "Apni Zaroorat",
  "loan apply online",
  "Jaipur personal loan",
] as const;

/** Trailing-slash path for sitemap / canonical (matches next.config trailingSlash). */
export function seoPath(path: string): string {
  if (!path || path === "/") return "/";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean.endsWith("/") ? clean : `${clean}/`;
}

export function absoluteSeoUrl(path: string): string {
  const p = seoPath(path);
  return p === "/" ? `${PUBLIC_SITE_URL}/` : `${PUBLIC_SITE_URL}${p}`;
}

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  /** When true, title is used as-is (no `| Apni Zaroorat` template expansion for OG). */
  absoluteTitle?: boolean;
};

/**
 * Shared page metadata: canonical, Open Graph, Twitter, robots.
 * Pass short `title` without brand — root template adds `| Apni Zaroorat`.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [...DEFAULT_KEYWORDS],
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  type = "website",
  noIndex,
  absoluteTitle = false,
}: BuildPageMetadataInput): Metadata {
  const canonical = seoPath(path);
  const url = absoluteSeoUrl(path);
  const shouldIndex = !noIndex;
  const displayTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type,
      locale: "en_IN",
      url,
      siteName: SITE_NAME,
      title: displayTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [image],
    },
    robots: shouldIndex
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow: false,
          noarchive: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        },
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${PUBLIC_SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_NAME,
    alternateName: ["ApniZaroorat", "Apni Zaroorat Loans"],
    url: PUBLIC_SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteSeoUrl("/images/logo/logo.webp"),
    },
    image: absoluteSeoUrl(DEFAULT_OG_IMAGE),
    description: SITE_DEFAULT_DESCRIPTION,
    email: CONTACT.EMAIL,
    telephone: CONTACT.PHONE_TEL,
    foundingLocation: {
      "@type": "Place",
      name: "Jaipur, Rajasthan, India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.ADDRESS,
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302002",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT.PHONE_TEL,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
        email: CONTACT.EMAIL,
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "Personal loans",
      "Insurance",
      "EMI calculation",
      "Loan eligibility",
      "Financial products India",
    ],
    sameAs: [] as string[],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${PUBLIC_SITE_URL}/#website`,
    url: PUBLIC_SITE_URL,
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    description: SITE_DEFAULT_DESCRIPTION,
    publisher: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    inLanguage: ["en-IN", "hi-IN"],
  };
}

/** Schema for clear primary nav — helps engines understand deep-link structure (sitelinks candidates). */
export function siteNavigationJsonLd() {
  return {
    "@type": "ItemList",
    "@id": `${PUBLIC_SITE_URL}/#sitenavigation`,
    name: `${SITE_NAME} primary pages`,
    itemListElement: SITELINK_PAGES.map((page, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: page.name,
      description: page.description,
      url: absoluteSeoUrl(page.path),
    })),
  };
}

/** Offer catalog of core products for homepage knowledge graph / AEO. */
export function serviceCatalogJsonLd() {
  return {
    "@type": "OfferCatalog",
    "@id": `${PUBLIC_SITE_URL}/#services`,
    name: "Apni Zaroorat products",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Personal Loan",
          description:
            "Personal loans from ₹25,000 to ₹10 lakh with online application.",
          url: absoluteSeoUrl("/products/personal-loan"),
          provider: { "@id": `${PUBLIC_SITE_URL}/#organization` },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Insurance",
          description:
            "Life, health and motor insurance plans — compare and apply online.",
          url: absoluteSeoUrl("/products/insurance"),
          provider: { "@id": `${PUBLIC_SITE_URL}/#organization` },
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteSeoUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function financialServiceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@type": "FinancialService",
    name: input.name,
    description: input.description,
    url: absoluteSeoUrl(input.path),
    provider: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: input.serviceType,
  };
}

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}) {
  return {
    "@type": input.type ?? "WebPage",
    "@id": `${absoluteSeoUrl(input.path)}#webpage`,
    url: absoluteSeoUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
    about: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    inLanguage: "en-IN",
  };
}

export function graphJsonLd(...nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
