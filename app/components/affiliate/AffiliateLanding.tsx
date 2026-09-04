import Link from "next/link";
import CtaBanner from "@/app/about/components/cta-banner";
import FaqSection from "@/app/components/home/faq";
import { PRODUCTS_HUB_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import HowItWorksSection, { type HowItWorksStep } from "@/app/components/products/HowItWorksSection";

const PRODUCTS = [
  {
    name: "Personal Loan",
    href: "/products/personal-loan#apply",
    gif: "/images/loan.gif",
    imageAlt: "Personal loan",
    badge: "Up to ₹10 lakh",
    blurb: "Paperless apply, quick digital process with minimal documentation.",
    points: ["₹25,000 to ₹10 lakh", "Salaried & self-employed", "Digital application"],
    cta: "Apply for personal loan",
  },
  {
    name: "Insurance",
    href: "/products/insurance#apply",
    gif: "/images/insurance.gif",
    imageAlt: "Insurance",
    badge: "Life · Health · Motor",
    blurb: "Choose your cover and apply online in a few guided steps.",
    points: ["Life, health & motor", "Compare what fits you", "Simple online application"],
    cta: "Apply for insurance",
  },
] as const;

const toolIconClass = "h-8 w-8 sm:h-9 sm:w-9";

const TOOLS = [
  {
    name: "Check eligibility",
    href: "/check-eligibility/",
    blurb: "Free indicative score for a personal loan. No impact on your credit score.",
    cta: "Check now",
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
    blobClass: "bg-[#4236FB]/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={toolIconClass} aria-hidden="true">
        <path d="M12 3 5 6.2v5.3c0 4.1 2.8 7.8 7 8.7 4.2-.9 7-4.6 7-8.7V6.2L12 3Z" fill="currentColor" />
        <path d="m8.8 12.1 2.1 2.1 4.4-4.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "EMI calculator",
    href: "/emi-calculator/",
    blurb: "See monthly EMI, interest, and total repayment before you apply.",
    cta: "Calculate EMI",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    blobClass: "bg-[#FF7E29]/25",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={toolIconClass} aria-hidden="true">
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" fill="currentColor" />
        <rect x="7.25" y="5.75" width="9.5" height="3.25" rx="0.8" fill="white" />
        <circle cx="8.6" cy="12.4" r="0.95" fill="white" />
        <circle cx="12" cy="12.4" r="0.95" fill="white" />
        <circle cx="15.4" cy="12.4" r="0.95" fill="white" />
        <circle cx="8.6" cy="16.15" r="0.95" fill="white" />
        <circle cx="12" cy="16.15" r="0.95" fill="white" />
        <circle cx="15.4" cy="16.15" r="0.95" fill="white" />
      </svg>
    ),
  },
] as const;

const iconClass = "h-6 w-6 sm:h-7 sm:w-7";

const STEPS: HowItWorksStep[] = [
  {
    num: 1,
    title: "Pick a product",
    description: "Choose personal loan or insurance from the cards above.",
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <rect x="4" y="5" width="7" height="14" rx="1.5" fill="currentColor" opacity="0.12" />
        <rect x="13" y="5" width="7" height="14" rx="1.5" fill="currentColor" opacity="0.12" />
        <rect x="4" y="5" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="5" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Fill the form",
    description: "Share basic details on the product page and submit online.",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8.5h6M9 12h4.5M9 15.5h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "We verify details",
    description: "We verify your details and find the best option for you.",
    iconWrapClass: "bg-[#E7F8F1] text-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <circle cx="10" cy="9" r="3" fill="currentColor" opacity="0.2" />
        <circle cx="10" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 19c.6-2.8 2.8-4.3 5.5-4.3 1 0 2 .2 2.8.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16.5" cy="15.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m19 18 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "You get the offer",
    description: "Once approved, the loan or insurance cover comes through to you.",
    iconWrapClass: "bg-[#F3EEFF] text-[#8B5CF6]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <path d="M4 9.5 12 4l8 5.5V20H4V9.5Z" fill="currentColor" opacity="0.12" />
        <path d="M4 9.5 12 4l8 5.5V20H4V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9.5 12h5M12 12v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function PlayIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.037 4.688a.53.53 0 0 1 .78-.581l14.7 8.5a.53.53 0 0 1 0 .918l-14.7 8.5a.53.53 0 0 1-.78-.581V4.688z" />
    </svg>
  );
}

function ProductGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="product-gif-frame theme-gradient-bg mx-auto md:mx-0">
      <div className="product-gif-frame__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={160} height={160} />
      </div>
    </div>
  );
}

export default function AffiliateLanding() {
  return (
    <div className="bg-white dark:bg-semidark">
      <div
        id="products"
        className="affiliate-hero theme-gradient-bg relative overflow-hidden px-4 pb-12 pt-24 sm:px-6"
      >
        <h1 className="sr-only">Apply for a loan or insurance</h1>
        <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#FF7E29]/30 blur-3xl" />
        <div className="container relative z-[1] mx-auto w-full max-w-full sm:px-2 lg:max-w-screen-xl lg:px-8">
          <div className="mb-6 text-center sm:mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-white sm:px-5 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Free online apply
            </span>
            <p className="mt-3 text-xl font-bold text-white xs:text-2xl sm:text-3xl">
              Choose what you need
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {PRODUCTS.map((product) => (
              <article
                key={product.name}
                className="min-w-0 self-start rounded-3xl bg-white p-3.5 shadow-[0_16px_48px_rgba(16,45,71,0.18)] ring-1 ring-white/40 dark:bg-darklight dark:ring-white/10 sm:p-6"
              >
                <div className="flex min-w-0 flex-col items-center gap-4 md:flex-row md:items-start md:gap-5">
                  <ProductGif src={product.gif} alt={product.imageAlt} />
                  <div className="w-full min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-[#DAE7FF] px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      {product.badge}
                    </span>
                    <p className="mt-2 text-xl font-bold leading-tight text-midnight_text dark:text-white sm:text-2xl">
                      {product.name}
                    </p>
                    <p className="mt-1.5 text-sm leading-snug text-slate-600 dark:text-slate-300">
                      {product.blurb}
                    </p>
                    <ul className="mt-4 space-y-2.5 text-left text-sm text-slate-600 dark:text-slate-300">
                      {product.points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5">
                          <span className="theme-gradient-bg flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none text-white">
                            ✓
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href={product.href}
                  className="btn-gradient btn-shine mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
                >
                  <PlayIcon />
                  {product.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>

      <HowItWorksSection
        headingPrefix="Apply in"
        headingHighlight="4 simple steps"
        steps={STEPS}
      />

      <section className="!bg-white !py-12 dark:!bg-semidark sm:!py-16">
        <div className="container mx-auto max-w-full px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="!text-xl font-bold !text-midnight_text dark:!text-white xs:!text-2xl sm:!text-3xl">
              Helpful <span className="theme-gradient-text">tools</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl px-1 text-sm text-gray sm:text-base">
              Plan your EMI or check eligibility before you apply — both are free.
            </p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {TOOLS.map((tool) => (
              <article
                key={tool.name}
                className="relative flex min-h-[220px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#F5F7FB] p-5 shadow-[0_8px_28px_rgba(16,45,71,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(66,54,251,0.12)] dark:border-dark_border dark:bg-darklight sm:min-h-[240px] sm:p-6"
              >
                <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${tool.blobClass}`} />
                <div className={`pointer-events-none absolute -bottom-10 left-8 h-20 w-20 rounded-full blur-2xl ${tool.blobClass}`} />
                <div className="relative flex flex-1 flex-col">
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="theme-gradient-bg shrink-0 rounded-2xl p-[2px]">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-[14px] sm:h-16 sm:w-16 ${tool.iconWrapClass}`}
                      >
                        {tool.icon}
                      </div>
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-base font-bold leading-tight text-midnight_text dark:text-white sm:text-lg lg:text-xl">
                        {tool.name}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {tool.blurb}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto pt-5">
                    <Link
                      href={tool.href}
                      className="btn-gradient btn-shine inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white sm:w-auto sm:px-5"
                    >
                      {tool.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        className="!pt-6 sm:!pt-8 md:!pt-10 lg:!pt-12"
        items={PRODUCTS_HUB_FAQ_ITEMS}
      />

      <CtaBanner
        title="Ready to apply?"
        description="Start a personal loan or insurance application — simple, digital, and secure."
        primaryHref="/products/personal-loan#apply"
        primaryLabel="Personal loan"
        secondaryHref="/products/insurance#apply"
        secondaryLabel="Insurance"
      />
    </div>
  );
}
