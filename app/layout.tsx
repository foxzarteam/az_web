import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Aoscompo from "@/utils/aos";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import ScrollToTop from "./components/scroll-to-top";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apni Zaroorat | Loans, Insurance & Credit Cards Online",
  description: "Apni Zaroorat – Compare and apply for personal loans, insurance, and credit cards online. Quick approval, best rates, 100% digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Aoscompo>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </Aoscompo>
        </ThemeProvider>
      </body>
    </html>
  );
}
