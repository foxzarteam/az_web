"use client";

import { useProductsApply } from "@/app/components/affiliate/ProductsApplyProvider";

const PRODUCTS = [
  {
    key: "personal_loan" as const,
    name: "Personal Loan",
    gif: "/images/loan.webp",
    imageAlt: "Personal loan",
    badge: "Up to ₹10 lakh",
    blurb: "Paperless apply, quick digital process with minimal documentation.",
    points: ["₹25,000 to ₹10 lakh", "Salaried & self-employed", "Digital application"],
    cta: "Apply for personal loan",
  },
  {
    key: "insurance" as const,
    name: "Insurance",
    gif: "/images/insurance.webp",
    imageAlt: "Insurance",
    badge: "Life · Health · Motor",
    blurb: "Choose your cover and apply online in a few guided steps.",
    points: ["Life, health & motor", "Compare what fits you", "Simple online application"],
    cta: "Apply for insurance",
  },
] as const;

function PlayIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.037 4.688a.53.53 0 0 1 .78-.581l14.7 8.5a.53.53 0 0 1 0 .918l-14.7 8.5a.53.53 0 0 1-.78-.581V4.688z" />
    </svg>
  );
}

function ProductGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex w-full justify-center md:w-auto md:justify-start">
      <div className="product-gif-frame theme-gradient-bg">
        <div className="product-gif-frame__inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} width={224} height={224} decoding="async" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

/**
 * Products hub cards — Apply opens same-page modals so partner `/r/CODE` URL stays put.
 */
export default function ProductsHubCards() {
  const { openPersonalLoan, openInsurance } = useProductsApply();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      {PRODUCTS.map((product) => (
        <article
          key={product.key}
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
          <button
            type="button"
            onClick={() => {
              if (product.key === "personal_loan") openPersonalLoan();
              else openInsurance();
            }}
            className="btn-gradient btn-shine mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
          >
            <PlayIcon />
            {product.cta}
          </button>
        </article>
      ))}
    </div>
  );
}
