"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

type LoanPurpose = {
  title: string;
  description: string;
  icon: ReactNode;
  /** Literal Tailwind classes so the JIT scanner picks them up */
  iconWrapClass: string;
};

const iconClass = "h-6 w-6 sm:h-7 sm:w-7";
const AUTO_MS = 4500;
const PAGE_SIZE = 4;

function IconMedical() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 8.5v6M9 11.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconWedding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <circle cx="9.5" cy="13.5" r="5" fill="currentColor" opacity="0.15" />
      <circle cx="9.5" cy="13.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.5" cy="13.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5.5h4l-2 3-2-3Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M4.5 10.5 12 4l7.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19v-8.5Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M4.5 10.5 12 4l7.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 20.5v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconEducation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path d="m12 4 10 4.5L12 13 2 8.5 12 4Z" fill="currentColor" opacity="0.15" />
      <path d="m12 4 10 4.5L12 13 2 8.5 12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M6.5 10.8v4.2c0 1.2 2.5 2.5 5.5 2.5s5.5-1.3 5.5-2.5v-4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M22 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconTravel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M21 4.5 3.5 11l5 2 2 5.5 2.5-4 4.5 2L21 4.5Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M21 4.5 3.5 11l5 2 2 5.5 2.5-4 4.5 2L21 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8.5 13 21 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconDebt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.12" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14.8 9.2A3.4 3.4 0 0 0 12 8c-1.9 0-3.4 1.1-3.4 2.4S10.1 12.5 12 12.5s3.4 1 3.4 2.3S13.9 17 12 17a3.4 3.4 0 0 1-2.8-1.2M12 6.5V8m0 9v1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconVehicle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M5.5 11 7 6.8A1.5 1.5 0 0 1 8.4 5.8h7.2A1.5 1.5 0 0 1 17 6.8L18.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="3.5" y="11" width="17" height="6" rx="1.5" fill="currentColor" opacity="0.15" />
      <rect x="3.5" y="11" width="17" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 17v1.5M18 17v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7.5" cy="14" r="1" fill="currentColor" />
      <circle cx="16.5" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

function IconShopping() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M5.5 8h13l-1 11a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4l-1-11Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M5.5 8h13l-1 11a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4l-1-11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 10.5V6.5a3 3 0 0 1 6 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const LOAN_PURPOSES: LoanPurpose[] = [
  {
    title: "Medical Emergency",
    description: "Get instant funds for medical emergencies.",
    icon: <IconMedical />,
    iconWrapClass: "bg-[#FDEBEC] text-[#EF4444]",
  },
  {
    title: "Marriage",
    description: "Make your special day more special.",
    icon: <IconWedding />,
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
  },
  {
    title: "Home Renovation",
    description: "Make your home dreams a reality.",
    icon: <IconHome />,
    iconWrapClass: "bg-[#E7F8F1] text-[#10B981]",
  },
  {
    title: "Higher Education",
    description: "Invest in your or your child's future.",
    icon: <IconEducation />,
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
  },
  {
    title: "Travel",
    description: "Explore the world with ease.",
    icon: <IconTravel />,
    iconWrapClass: "bg-[#E8F6FE] text-[#0EA5E9]",
  },
  {
    title: "Debt Consolidation",
    description: "Combine all your dues into one easy EMI.",
    icon: <IconDebt />,
    iconWrapClass: "bg-[#F3EEFF] text-[#8B5CF6]",
  },
  {
    title: "Buying a Vehicle",
    description: "Bring home your dream car or bike.",
    icon: <IconVehicle />,
    iconWrapClass: "bg-[#FDEEF6] text-[#EC4899]",
  },
  {
    title: "Shopping & Gadgets",
    description: "Buy the latest gadgets and appliances.",
    icon: <IconShopping />,
    iconWrapClass: "bg-[#E6F7F5] text-[#14B8A6]",
  },
];

const PAGES = Array.from({ length: Math.ceil(LOAN_PURPOSES.length / PAGE_SIZE) }, (_, i) =>
  LOAN_PURPOSES.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE),
);

function PurposeCard({ purpose }: { purpose: LoanPurpose }) {
  return (
    <article className="flex h-full flex-col items-center rounded-2xl bg-white px-3 py-5 text-center shadow-[0_4px_24px_rgba(16,45,71,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(16,45,71,0.12)] dark:bg-darklight sm:px-4 sm:py-6">
      <div className="theme-gradient-bg mb-3 rounded-full p-[2px] sm:mb-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 ${purpose.iconWrapClass}`}
        >
          {purpose.icon}
        </div>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray sm:text-[11px]">
        Personal Loan for
      </p>
      <h3 className="mt-0.5 !text-sm font-bold leading-snug !text-midnight_text dark:!text-white sm:!text-base">
        {purpose.title}
      </h3>
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray dark:text-gray-400 sm:text-[13px]">
        {purpose.description}
      </p>
    </article>
  );
}

export default function LoanPurposes() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || PAGES.length <= 1) return;
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % PAGES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="bg-[#F5F7FB] dark:bg-semidark"
      aria-labelledby="loan-purposes-heading"
    >
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mb-8 text-center sm:mb-10" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
            Loan for Every Need
          </span>
          <h2
            id="loan-purposes-heading"
            className="mt-2 text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl lg:text-[2rem]"
          >
            Where Can a Personal Loan <span className="theme-gradient-text">Help You?</span>
          </h2>
        </div>

        {/* Desktop: all 8 cards in 4-col grid */}
        <div className="hidden grid-cols-2 gap-3 sm:gap-4 lg:grid lg:grid-cols-4 lg:gap-5">
          {LOAN_PURPOSES.map((purpose) => (
            <PurposeCard key={purpose.title} purpose={purpose} />
          ))}
        </div>

        {/* Mobile / tablet: 4 cards at a time, slow auto-slide */}
        <div
          className="lg:hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="overflow-hidden" aria-roledescription="carousel">
            <div
              className="flex transition-transform duration-[900ms] ease-in-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {PAGES.map((pageItems, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid w-full shrink-0 grid-cols-2 gap-3 sm:gap-4"
                  aria-hidden={pageIndex !== page}
                >
                  {pageItems.map((purpose) => (
                    <PurposeCard key={purpose.title} purpose={purpose} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Loan purpose pages">
            {PAGES.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === page}
                aria-label={`Show purposes ${index * PAGE_SIZE + 1} to ${Math.min((index + 1) * PAGE_SIZE, LOAN_PURPOSES.length)}`}
                onClick={() => setPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === page
                    ? "w-7 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <Link
            href="/products/personal-loan"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-white px-6 py-3 text-sm font-bold text-primary transition duration-300 hover:border-primary hover:bg-primary/5 dark:bg-darklight dark:text-white sm:px-8 sm:py-3.5 sm:text-base"
          >
            Apply for Personal Loan
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
