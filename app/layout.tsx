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
import BeepOnPageLoad from "./components/loan-helper/BeepOnPageLoad";
import { BEEP_AUTOPLAY_INLINE_SCRIPT } from "./components/loan-helper/beepAutoplayInlineScript";
import LoanHelperChat from "./components/loan-helper/LoanHelperChat";
import { WHATSAPP_BEEP_URL } from "./utils/loanHelperBeep";

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
    { media: "(prefers-color-scheme: light)", color: "#F0F6FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0c121e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: "Apni Zaroorat | Loans, Insurance & Credit Cards Online",
  description: "Apni Zaroorat – Compare and apply for personal loans, insurance, and credit cards online. Quick approval, best rates, 100% digital.",
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
      <head>
        <link rel="preload" href={WHATSAPP_BEEP_URL} as="fetch" type="audio/wav" />
      </head>
      <body className={`${dmSans.className} min-h-[100dvh] min-w-0`} suppressHydrationWarning>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          id="loan-advisor-beep"
          src={WHATSAPP_BEEP_URL}
          preload="auto"
          className="hidden"
          aria-hidden
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: BEEP_AUTOPLAY_INLINE_SCRIPT }}
        />
        <BeepOnPageLoad />
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
