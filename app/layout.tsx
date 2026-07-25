import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Aoscompo from "@/utils/aos";
import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { getActiveServices } from "@/app/data/getActiveServices";
import { ServiceCardsProvider } from "@/app/components/providers/ServiceCardsProvider";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import LoanHelperChat from "./components/loan-helper/LoanHelperChat";

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
    default: "Apni Zaroorat | Personal Loans & Insurance Online",
    template: "%s | Apni Zaroorat",
  },
  description:
    "Apply online for personal loans from ₹25,000 to ₹10 lakh and explore insurance options with Apni Zaroorat. Check EMI and indicative eligibility before applying.",
  applicationName: "Apni Zaroorat",
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
    siteName: "Apni Zaroorat",
    title: "Apni Zaroorat | Personal Loans & Insurance Online",
    description:
      "Check personal loan EMI and indicative eligibility, then apply online through a quick and secure process.",
  },
  twitter: {
    card: "summary",
    title: "Apni Zaroorat | Personal Loans & Insurance Online",
    description:
      "Check personal loan EMI and indicative eligibility, then apply online through a quick and secure process.",
  },
  robots: {
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
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serviceCards = await getActiveServices();

  return (
    <html lang="en" suppressHydrationWarning className="min-h-[100dvh]">
      <body className={`${dmSans.className} min-h-[100dvh] min-w-0`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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
            <LoanHelperChat />
          </Aoscompo>
        </ThemeProvider>
      </body>
    </html>
  );
}
