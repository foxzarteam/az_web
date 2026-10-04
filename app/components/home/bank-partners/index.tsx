import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import BankLogoCarousel, { type BankLogo } from "../bank-logo-carousel";

function bankLogos(): BankLogo[] {
  const dir = path.join(process.cwd(), "public", "images", "bank-logos");
  return fs
    .readdirSync(dir)
    .filter((name) => /\.(svg|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((file) => ({
      src: `/images/bank-logos/${encodeURI(file)}`,
      alt: file
        .replace(/\.(svg|webp)$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\blogo\b/gi, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b[a-z]/g, (letter) => letter.toUpperCase()),
    }));
}

export default function BankPartners() {
  const logos = bankLogos();

  return (
    <section aria-labelledby="trusted-banking-partners" className="bg-white py-12 dark:bg-darkmode sm:py-16">
      <div className="container mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <h2
          id="trusted-banking-partners"
          className="mb-8 text-center text-xl font-bold text-midnight_text dark:text-white xs:text-2xl sm:mb-10 sm:text-3xl md:text-4xl"
        >
          Our <span className="theme-gradient-text">100+</span> Trusted Banking <span className="theme-gradient-text">Partners</span>
        </h2>
        <BankLogoCarousel logos={logos} />
        <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <Link
            href="/products/personal-loan"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-white px-4 py-2.5 text-sm font-bold text-primary transition duration-300 hover:border-primary hover:bg-primary/5 dark:bg-darklight dark:text-white sm:px-6 sm:py-3 sm:text-base"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEEAFF] text-base font-bold leading-none text-[#4236FB]" aria-hidden>
              ₹
            </span>
            Apply for Personal Loan
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/products/insurance"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-white px-4 py-2.5 text-sm font-bold text-primary transition duration-300 hover:border-primary hover:bg-primary/5 dark:bg-darklight dark:text-white sm:px-6 sm:py-3 sm:text-base"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F8EF] text-[#059669]" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M12 3.5 5.5 6.2v5.2c0 3.8 2.6 6.7 6.5 8.1 3.9-1.4 6.5-4.3 6.5-8.1V6.2L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="m9.2 12.1 1.8 1.8 3.8-3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Apply for Insurance
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
