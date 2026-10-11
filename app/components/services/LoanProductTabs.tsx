"use client";

import type { ReactNode } from "react";
import type { LoanProductTab } from "@/app/lib/services/types";

type LoanProductTabsProps = {
  products: LoanProductTab[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

function IconBadge({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 ${bg}`}>
      {children}
    </span>
  );
}

function LoanTabIcon({ slug }: { slug: string }) {
  const key = slug.toLowerCase();
  if (key.includes("home")) {
    return (
      <IconBadge bg="bg-[#FFF1E7]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5.2v-5.2H10.2V21H5a1 1 0 0 1-1-1v-8.8Z" fill="#F97316" />
          <path d="M10 12.5h4v3h-4v-3Z" fill="#fff" />
        </svg>
      </IconBadge>
    );
  }
  if (key.includes("business")) {
    return (
      <IconBadge bg="bg-[#E7F8F1]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <rect x="3" y="8" width="18" height="12" rx="2" fill="#10B981" />
          <path d="M9 8V6.2A1.2 1.2 0 0 1 10.2 5h3.6A1.2 1.2 0 0 1 15 6.2V8" fill="#059669" />
          <path d="M3 13h18" stroke="#fff" strokeWidth="1.4" />
          <rect x="11" y="12" width="2" height="2.4" rx="0.4" fill="#fff" />
        </svg>
      </IconBadge>
    );
  }
  if (key.includes("car") || key.includes("vehicle")) {
    return (
      <IconBadge bg="bg-[#E8F1FF]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path d="M6.2 15.2 7.6 11a2 2 0 0 1 1.9-1.3h5a2 2 0 0 1 1.9 1.3l1.4 4.2H6.2Z" fill="#2563EB" />
          <path d="M8.4 11.1 9.5 8.4A1.4 1.4 0 0 1 10.8 7.5h2.6c.6 0 1.1.3 1.3.9l1 2.7H8.4Z" fill="#93C5FD" />
          <path d="M4.2 14.6h15.6c.6 0 1 .5.9 1.1l-.3 1.5a1 1 0 0 1-1 .8H5.6a1 1 0 0 1-1-.8l-.3-1.5c-.1-.6.3-1.1.9-1.1Z" fill="#1D4ED8" />
          <circle cx="7.6" cy="17.6" r="1.7" fill="#0F172A" />
          <circle cx="7.6" cy="17.6" r="0.7" fill="#fff" />
          <circle cx="16.4" cy="17.6" r="1.7" fill="#0F172A" />
          <circle cx="16.4" cy="17.6" r="0.7" fill="#fff" />
        </svg>
      </IconBadge>
    );
  }
  return (
    <IconBadge bg="bg-[#EEF0FF]">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="2" fill="#4236FB" />
        <path d="M3 10h18" stroke="#C7D2FE" strokeWidth="1.6" />
        <rect x="6" y="13" width="5" height="1.6" rx="0.8" fill="#fff" />
        <circle cx="16.2" cy="13.8" r="1.2" fill="#FBBF24" />
      </svg>
    </IconBadge>
  );
}

export default function LoanProductTabs({ products, selectedSlug, onSelect }: LoanProductTabsProps) {
  if (products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden shadow-[0_8px_18px_rgba(16,24,40,0.12)]">
      <div className="bg-[#f4f6f9]">
        <div
          role="tablist"
          aria-label="Loan type"
          className="grid w-full grid-cols-2 sm:flex sm:items-stretch"
        >
          {products.map((product) => {
            const selected = product.slug === selectedSlug;
            return (
              <button
                key={product.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onSelect(product.slug)}
                className={`flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wide transition-colors sm:min-h-11 sm:px-3 sm:text-sm ${
                  selected
                    ? "theme-gradient-bg z-10 text-white shadow-[0_2px_8px_rgba(66,54,251,0.28)]"
                    : "z-0 bg-white text-[#4b5568] shadow-[0_1px_2px_rgba(16,24,40,0.06)] hover:bg-[#f8fafc]"
                }`}
              >
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                  <LoanTabIcon slug={product.slug} />
                  <span className="truncate">{product.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="theme-gradient-bg h-px" aria-hidden />
    </div>
  );
}
