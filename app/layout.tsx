import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Aoscompo from "@/utils/aos";
import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { getActiveServices } from "@/app/data/getActiveServices";
import { ServiceCardsProvider } from "@/app/components/providers/ServiceCardsProvider";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SEO_INDEXING_ENABLED,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/app/lib/seo";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import LoanHelperChatLazy from "./components/loan-helper/LoanHelperChatLazy";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0c121e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Apply online for personal loans from ₹25,000 to ₹10 lakh and explore insurance options with Apni Zaroorat. Check EMI and indicative eligibility before applying.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: PUBLIC_SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "finance",
  keywords: [
    "personal loan online",
    "personal loan EMI calculator",
    "personal loan eligibility",
    "instant personal loan",
    "insurance online",
    "Apni Zaroorat",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Check personal loan EMI and indicative eligibility, then apply online through a quick and secure process.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Check personal loan EMI and indicative eligibility, then apply online through a quick and secure process.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: SEO_INDEXING_ENABLED
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
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/images/logo/app_icon.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "geo.region": "IN-RJ",
    "geo.placename": "Jaipur",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serviceCards = await getActiveServices();

  return (
    <html lang="en-IN" suppressHydrationWarning className="min-h-[100dvh]">
      <body className={`${dmSans.className} min-h-[100dvh] min-w-0`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Aoscompo>
            <ServiceCardsProvider cards={serviceCards}>
              <Header />
              <div
                id="main-content"
                className="relative min-w-0 w-full max-w-full pb-[env(safe-area-inset-bottom,0px)]"
              >
                {children}
              </div>
              <Footer />
            </ServiceCardsProvider>
            <LoanHelperChatLazy />
          </Aoscompo>
        </ThemeProvider>
      </body>
    </html>
  );
}
