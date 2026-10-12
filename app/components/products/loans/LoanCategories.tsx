"use client";

import Link from "next/link";
import { useLoanSelection } from "@/app/components/products/loans/loanSelection";

const LOAN_CARDS = [
  { slug: "personal-loan", label: "Personal Loan", src: "/images/loans/personal-loan.gif", srcOnWhite: "/images/loans/personal-loan-white.gif", href: "/products/loans/" },
  { slug: "home-loan", label: "Home Loan", src: "/images/loans/home-loan.gif", srcOnWhite: "/images/loans/home-loan-white.gif", href: "/products/loans/" },
  { slug: "car-loan", label: "Car Loan", src: "/images/loans/car-loan.gif?v=2", srcOnWhite: "/images/loans/car-loan-white.gif", href: "/products/loans/" },
  { slug: "business-loan", label: "Business Loan", src: "/images/loans/business-loan.gif", srcOnWhite: "/images/loans/business-loan-white.gif", href: "/products/loans/" },
] as const;

const INSURANCE_CARD = {
  slug: "insurance",
  label: "Insurance",
  src: "/images/loans/insurance.gif",
  srcOnWhite: "/images/loans/insurance-white.gif",
  href: "/products/insurance/",
} as const;

export default function LoanCategories({
  className = "!py-10 lg:!py-14",
  showInsurance = false,
  showApply = false,
  softBg = false,
  hideHeading = false,
  embedded = false,
}: {
  className?: string;
  showInsurance?: boolean;
  showApply?: boolean;
  softBg?: boolean;
  hideHeading?: boolean;
  /** Sit in the form column, same width as the apply form. */
  embedded?: boolean;
}) {
  const selection = useLoanSelection();
  const selectedSlug = selection?.slug ?? null;
  const cards = showInsurance ? [...LOAN_CARDS, INSURANCE_CARD] : LOAN_CARDS;
  const gridClass = showInsurance
    ? "sm:grid-cols-3 xl:grid-cols-5"
    : embedded
      ? "sm:grid-cols-4"
      : "lg:grid-cols-4";

  const heading = hideHeading ? null : (
    <div className={embedded ? "mb-4 text-center sm:mb-5" : "mb-8 text-center sm:mb-10"}>
      <h2
        id="loan-categories-heading"
        className={
          embedded
            ? "text-lg font-bold text-midnight_text dark:text-white sm:text-xl md:text-2xl"
            : "text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
        }
      >
        {showInsurance ? (
          <>
            Pick any one as per <span className="theme-gradient-text">your need</span>.
          </>
        ) : (
          <>
            Select the Right Loan for <span className="theme-gradient-text">You</span>
          </>
        )}
      </h2>
    </div>
  );

  const list = (
    <ul className={`grid grid-cols-2 gap-3 sm:gap-4 ${gridClass}`}>
      {cards.map((item) => {
        const selected = item.slug === selectedSlug;
        const cardBg = softBg ? "bg-white" : "bg-[#EEF0FF]";
        const imageSrc = softBg && "srcOnWhite" in item ? item.srcOnWhite : item.src;
        return (
          <li key={item.slug} className={`h-full ${item.slug === "insurance" ? "col-span-2 sm:col-span-1" : ""}`}>
            {selection ? (
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  selection.setSlug(item.slug);
                  if (!embedded) {
                    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`flex w-full flex-col items-center rounded-2xl p-[2px] text-center transition duration-300 ${embedded ? "" : "h-full"} ${
                  selected
                    ? "-translate-y-1 bg-[linear-gradient(90deg,#4236FB_0%,#4236FB_42%,#FF7E29_100%)] shadow-[0_16px_34px_rgba(66,54,251,0.22)]"
                    : "bg-transparent hover:-translate-y-0.5"
                }`}
              >
                <span className={`relative flex w-full flex-col items-center rounded-[14px] ${embedded ? "aspect-[2/1] justify-center overflow-hidden px-2 py-1.5 sm:px-3" : "h-full px-3 py-4 sm:px-4 sm:py-5"} ${cardBg}`}>
                  {selected ? (
                    <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(90deg,#4236FB,#FF7E29)] text-white shadow-[0_4px_10px_rgba(66,54,251,0.35)]">
                      <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                        <path d="M3.5 8.2 6.4 11l6.1-6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt=""
                    width={240}
                    height={240}
                    decoding="async"
                    className={embedded ? "h-11 w-11 object-contain sm:h-12 sm:w-12" : "h-24 w-24 object-contain sm:h-28 sm:w-28"}
                  />
                  <p className={`font-semibold leading-tight text-midnight_text ${embedded ? "mt-1 text-xs sm:text-sm" : "mt-3 text-xs leading-snug sm:text-sm"}`}>{item.label}</p>
                </span>
              </button>
            ) : (
              <div className="flex h-full w-full flex-col items-center rounded-2xl bg-transparent p-[2px] text-center">
                <span className={`relative flex h-full w-full flex-col items-center rounded-[14px] px-3 py-4 sm:px-4 sm:py-5 ${cardBg}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt=""
                    width={240}
                    height={240}
                    decoding="async"
                    className="h-24 w-24 object-contain sm:h-28 sm:w-28"
                  />
                  <p className="mt-3 text-xs font-semibold leading-snug text-midnight_text sm:text-sm">{item.label}</p>
                  {showApply ? (
                    <Link
                      href={item.href}
                      className="btn-gradient btn-shine mt-4 inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-white shadow-[0_8px_18px_rgba(66,54,251,0.28)] sm:min-h-10 sm:text-sm"
                    >
                      Apply Now
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                        <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ) : null}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  if (embedded) {
    return (
      <div className={`w-full min-w-0 ${className}`} aria-labelledby={hideHeading ? undefined : "loan-categories-heading"}>
        {heading}
        {list}
      </div>
    );
  }

  return (
    <section
      id="products"
      className={`${softBg ? "bg-[#F5F7FB]" : "bg-white"} dark:bg-darkmode ${className}`}
      aria-labelledby={hideHeading ? undefined : "loan-categories-heading"}
      aria-label={hideHeading ? "Loan and insurance options" : undefined}
    >
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        {heading}
        {list}
      </div>
    </section>
  );
}
