import type { Metadata } from "next";
import { CONTACT, PUBLIC_SITE_URL } from "@/app/config/constants";

/** Site-wide brand strings — keep in sync with root layout defaults. */
export const SITE_NAME = "Apni Zaroorat";
export const SITE_TAGLINE = "Personal Loans & Insurance Online";
export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";
export const DEFAULT_OG_IMAGE_ALT = "Apni Zaroorat — personal loans and insurance online";

/** Indexing is off until launch — flip to true when enabling robots.txt. */
export const SEO_INDEXING_ENABLED = false;

const DEFAULT_KEYWORDS = [
  "personal loan online",
  "personal loan India",
  "personal loan EMI calculator",
  "personal loan eligibility",
  "instant personal loan",
  "insurance online",
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
};

/**
 * Shared page metadata: canonical, Open Graph, Twitter, robots.
 * Pass short `title` without brand — root template adds `| Apni Zaroorat`.
 * Use `absoluteTitle: true` via title object when the home page needs a full default.
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
}: BuildPageMetadataInput): Metadata {
  const canonical = seoPath(path);
  const url = absoluteSeoUrl(path);
  const shouldIndex = SEO_INDEXING_ENABLED && !noIndex;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type,
      locale: "en_IN",
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
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
      title: `${title} | ${SITE_NAME}`,
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
    url: PUBLIC_SITE_URL,
    logo: absoluteSeoUrl("/images/logo/logo.webp"),
    image: absoluteSeoUrl(DEFAULT_OG_IMAGE),
    email: CONTACT.EMAIL,
    telephone: CONTACT.PHONE_TEL,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.ADDRESS,
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302002",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.PHONE_TEL,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${PUBLIC_SITE_URL}/#website`,
    url: PUBLIC_SITE_URL,
    name: SITE_NAME,
    description: `${SITE_NAME} — ${SITE_TAGLINE}`,
    publisher: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    inLanguage: "en-IN",
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

export function graphJsonLd(...nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
