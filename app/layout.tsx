import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Aoscompo from "@/utils/aos";
import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { getActiveServices } from "@/app/data/getActiveServices";
import { ServiceCardsProvider } from "@/app/components/providers/ServiceCardsProvider";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import ScrollToTop from "./components/scroll-to-top";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Aoscompo>
            <ServiceCardsProvider cards={serviceCards}>
              <Header />
              {children}
              <Footer />
            </ServiceCardsProvider>
            <ScrollToTop />
          </Aoscompo>
        </ThemeProvider>
      </body>
    </html>
  );
}
