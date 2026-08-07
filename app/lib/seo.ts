import type { Metadata } from "next";
import { CONTACT, PUBLIC_SITE_URL } from "@/app/config/constants";
import { PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL } from "@/app/config/publicEnv";

/** Site-wide brand strings — keep in sync with root layout defaults. */
export const SITE_NAME = "Apni Zaroorat";
export const SITE_TAGLINE = "Apply for Personal Loans & Insurance Online";
export const SITE_DEFAULT_DESCRIPTION =
  "Apply for a personal loan online and explore insurance options with Apni Zaroorat. Check loan eligibility, calculate EMI and find suitable financial solutions online.";

export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";
export const DEFAULT_OG_IMAGE_ALT =
  "Apni Zaroorat — personal loans and insurance online";

/**
 * Flip to false on staging clones that must not be indexed.
 * Wired into buildPageMetadata + root layout robots.
 */
export const SEO_INDEXING_ENABLED = true;

/**
 * Primary deep links Google may surface as sitelinks (must match real, strong pages).
 * Order + clear names help; Google still chooses whether/which to show.
 */
export const SITELINK_PAGES = [
  {
    name: "Products",
    path: "/products/personal-loan",
    description:
      "Personal loans and insurance products online — apply with Apni Zaroorat in minutes.",
  },
  {
    name: "Contact Us",
    path: "/contact",
    description:
      "Get support for loans, insurance and applications across India. Call, email, or visit our office.",
  },
  {
    name: "Partner",
    path: "/become-partner",
    description:
      "Join Apni Zaroorat as a partner and earn by distributing personal loans and insurance India-wide.",
  },
  {
    name: "Insurance",
    path: "/products/insurance",
    description:
      "Compare life, health and motor insurance online with guided digital applications.",
  },
  {
    name: "About Us",
    path: "/about",
    description:
      "Know Apni Zaroorat — trusted partner for personal loans and insurance across India.",
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
  "personal loan up to 10 lakh",
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
  absoluteTitle?: boolean;
};

/**
 * Shared page metadata: canonical, hreflang, Open Graph, Twitter, robots.
 * Strong cross-page glue via absolute URLs + consistent brand strings.
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
  const shouldIndex = SEO_INDEXING_ENABLED && !noIndex;
  const displayTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const mergedKeywords = Array.from(
    new Set([...keywords, SITE_NAME, "Apni Zaroorat personal loan"]),
  );

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    applicationName: SITE_NAME,
    category: "finance",
    referrer: "origin-when-cross-origin",
    authors: [{ name: SITE_NAME, url: PUBLIC_SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical,
      languages: {
        "en-IN": url,
        "x-default": url,
      },
    },
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
          type: image.endsWith(".webp") ? "image/webp" : "image/jpeg",
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
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
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
    "@type": ["Organization", "FinancialService"],
    "@id": `${PUBLIC_SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_NAME,
    alternateName: [
      "ApniZaroorat",
      "Apni Zaroorat Loans",
      "apnizaroorat.com",
    ],
    url: `${PUBLIC_SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${PUBLIC_SITE_URL}/#logo`,
      url: absoluteSeoUrl("/images/logo/logo.webp"),
      contentUrl: absoluteSeoUrl("/images/logo/logo.webp"),
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    image: {
      "@type": "ImageObject",
      url: absoluteSeoUrl(DEFAULT_OG_IMAGE),
      width: 1200,
      height: 630,
    },
    description: SITE_DEFAULT_DESCRIPTION,
    email: CONTACT.EMAIL,
    telephone: CONTACT.PHONE_TEL,
    slogan: SITE_TAGLINE,
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
        url: absoluteSeoUrl("/contact"),
      },
      {
        "@type": "ContactPoint",
        telephone: CONTACT.PHONE_TEL,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
        url: absoluteSeoUrl("/become-partner"),
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
      "Life insurance",
      "Health insurance",
      "Motor insurance",
    ],
    hasOfferCatalog: { "@id": `${PUBLIC_SITE_URL}/#services` },
    sameAs: [] as string[],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${PUBLIC_SITE_URL}/#website`,
    url: `${PUBLIC_SITE_URL}/`,
    name: SITE_NAME,
    alternateName: [SITE_TAGLINE, "apnizaroorat.com"],
    description: SITE_DEFAULT_DESCRIPTION,
    publisher: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    inLanguage: ["en-IN", "hi-IN"],
    copyrightHolder: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    about: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    hasPart: SITELINK_PAGES.map((page) => ({
      "@type": "WebPage",
      name: page.name,
      url: absoluteSeoUrl(page.path),
      description: page.description,
    })),
  };
}

export function siteNavigationJsonLd() {
  return {
    "@type": "ItemList",
    "@id": `${PUBLIC_SITE_URL}/#sitenavigation`,
    name: `${SITE_NAME} primary pages`,
    numberOfItems: SITELINK_PAGES.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: SITELINK_PAGES.map((page, index) => ({
      "@type": "SiteNavigationElement",
      "@id": `${absoluteSeoUrl(page.path)}#nav`,
      position: index + 1,
      name: page.name,
      description: page.description,
      url: absoluteSeoUrl(page.path),
    })),
  };
}

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
            "Personal loans from Rs 25,000 to Rs 10 lakh with online application.",
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

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  pagePath?: string,
) {
  const listPath = pagePath ?? items[items.length - 1]?.path ?? "/";
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteSeoUrl(listPath)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteSeoUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
  path = "/",
) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteSeoUrl(path)}#faq`,
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
    "@id": `${absoluteSeoUrl(input.path)}#service`,
    name: input.name,
    description: input.description,
    url: absoluteSeoUrl(input.path),
    provider: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: input.serviceType,
    termsOfService: absoluteSeoUrl("/terms-and-conditions"),
  };
}

export function personalLoanProductJsonLd() {
  return {
    "@type": "LoanOrCredit",
    "@id": `${absoluteSeoUrl("/products/personal-loan")}#loan`,
    name: "Personal Loan",
    description:
      "Unsecured personal loan online from Rs 25,000 to Rs 10 lakh via Apni Zaroorat partner lenders.",
    url: absoluteSeoUrl("/products/personal-loan"),
    provider: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "India" },
    currency: "INR",
    amount: {
      "@type": "MonetaryAmount",
      currency: "INR",
      minValue: 25000,
      maxValue: 1000000,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@type": ["LocalBusiness", "FinancialService"],
    "@id": `${PUBLIC_SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: absoluteSeoUrl(DEFAULT_OG_IMAGE),
    url: `${PUBLIC_SITE_URL}/`,
    telephone: CONTACT.PHONE_TEL,
    email: CONTACT.EMAIL,
    priceRange: "$$",
    parentOrganization: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.ADDRESS,
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302002",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.9124,
      longitude: 75.7873,
    },
    hasMap: PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "19:00",
    },
    areaServed: { "@type": "Country", name: "India" },
  };
}

export type WebPageSchemaType =
  | "WebPage"
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage"
  | "WebSite";

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  type?: WebPageSchemaType;
  image?: string;
}) {
  const url = absoluteSeoUrl(input.path);
  const image = input.image ?? DEFAULT_OG_IMAGE;
  return {
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
    about: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    publisher: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteSeoUrl(image),
    },
    inLanguage: "en-IN",
    dateModified: new Date().toISOString().slice(0, 10),
  };
}

/**
 * Full SEO “glue” graph for every public page so Google can link brand ↔ site ↔ page.
 * Core: Organization + WebSite + SiteNavigation + WebPage + Breadcrumb (+ extras).
 */
export function pageSeoGlue(input: {
  name: string;
  description: string;
  path: string;
  pageType?: WebPageSchemaType;
  image?: string;
  crumbs?: { name: string; path: string }[];
  extra?: Record<string, unknown>[];
  includeServiceCatalog?: boolean;
  includeLocalBusiness?: boolean;
}) {
  const isHome = !input.path || input.path === "/";
  const crumbs =
    input.crumbs ??
    (isHome
      ? [{ name: "Home", path: "/" }]
      : [
          { name: "Home", path: "/" },
          { name: input.name, path: input.path },
        ]);

  const nodes: Record<string, unknown>[] = [
    organizationJsonLd(),
    websiteJsonLd(),
    siteNavigationJsonLd(),
    webPageJsonLd({
      name: input.name,
      description: input.description,
      path: input.path,
      type: input.pageType ?? (isHome ? "WebPage" : "WebPage"),
      image: input.image,
    }),
    breadcrumbJsonLd(crumbs, input.path),
  ];

  if (input.includeServiceCatalog) {
    nodes.push(serviceCatalogJsonLd());
  }
  if (input.includeLocalBusiness) {
    nodes.push(localBusinessJsonLd());
  }
  if (input.extra?.length) {
    nodes.push(...input.extra);
  }

  return graphJsonLd(...nodes);
}

export function graphJsonLd(...nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
