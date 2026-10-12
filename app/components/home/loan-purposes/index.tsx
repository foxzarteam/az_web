"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LoanPurpose = {
  title: string;
  description: string;
  image: string;
};

const AUTO_MS = 4500;
const PAGE_SIZE = 2;
const SLIDE_MS = 900;

const LOAN_PURPOSES: LoanPurpose[] = [
  {
    title: "Medical Emergency",
    description: "Get instant funds for medical emergencies.",
    image: "/images/need/1.webp",
  },
  {
    title: "Marriage",
    description: "Make your special day more special.",
    image: "/images/need/2.webp",
  },
  {
    title: "Home Renovation",
    description: "Make your home dreams a reality.",
    image: "/images/need/3.webp",
  },
  {
    title: "Higher Education",
    description: "Invest in your or your child's future.",
    image: "/images/need/4.webp",
  },
  {
    title: "Travel",
    description: "Explore the world with ease.",
    image: "/images/need/5.webp",
  },
  {
    title: "Debt Consolidation",
    description: "Combine all your dues into one easy EMI.",
    image: "/images/need/6.webp",
  },
  {
    title: "Buying a Vehicle",
    description: "Bring home your dream car or bike.",
    image: "/images/need/7.webp",
  },
  {
    title: "Shopping & Gadgets",
    description: "Buy the latest gadgets and appliances.",
    image: "/images/need/8.webp",
  },
];

const PAGES = Array.from({ length: Math.ceil(LOAN_PURPOSES.length / PAGE_SIZE) }, (_, i) =>
  LOAN_PURPOSES.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE),
);
/** First slide is repeated so the mobile reel can loop without jumping back. */
const SLIDES = [...PAGES, PAGES[0]];

function PurposeCard({ purpose }: { purpose: LoanPurpose }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-center shadow-[0_4px_24px_rgba(16,45,71,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(16,45,71,0.12)] dark:bg-darklight">
      <div className="relative aspect-[16/9] w-full bg-[#EEF0FF]">
        <Image
          src={purpose.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col items-center px-3 py-4 sm:px-4 sm:py-5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray sm:text-[11px]">
          Loan for
        </p>
        <h3 className="mt-0.5 !text-sm font-bold leading-snug !text-midnight_text dark:!text-white sm:!text-base">
          {purpose.title}
        </h3>
        <p className="mt-1.5 flex-1 text-[11px] leading-snug text-gray dark:text-gray-400 sm:text-xs">
          {purpose.description}
        </p>
      </div>
    </article>
  );
}

export default function LoanPurposes() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);
  const activeDot = page % PAGES.length;

  useEffect(() => {
    if (paused || PAGES.length <= 1) return;
    const id = window.setInterval(() => {
      setAnimate(true);
      setPage((current) => current + 1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (page < PAGES.length) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setPage(0);
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [page]);

  useEffect(() => {
    if (animate || page !== 0) return;
    const id = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(id);
  }, [animate, page]);

  const goNext = () => {
    setAnimate(true);
    setPage((current) => (current >= PAGES.length ? current : current + 1));
  };

  const goPrev = () => {
    if (page === 0 || page >= PAGES.length) {
      setAnimate(false);
      setPage(PAGES.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setAnimate(true);
          setPage(PAGES.length - 1);
        });
      });
      return;
    }
    setAnimate(true);
    setPage((current) => current - 1);
  };

  return (
    <section
      className="bg-[#F5F7FB] py-12 dark:bg-semidark sm:py-16"
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
            Where Can a Loan <span className="theme-gradient-text">Help You?</span>
          </h2>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="overflow-hidden lg:overflow-visible" aria-roledescription="carousel">
            <div
              className={`flex max-lg:[transform:translateX(calc(var(--need-page)*-100%))] lg:grid lg:grid-cols-4 lg:gap-5 ${animate ? "transition-transform duration-[900ms] ease-in-out" : ""}`}
              style={{ "--need-page": page } as React.CSSProperties}
            >
              {SLIDES.map((pageItems, pageIndex) => {
                const isClone = pageIndex === PAGES.length;
                return (
                  <div
                    key={isClone ? "loop" : pageIndex}
                    className={`grid w-full shrink-0 grid-cols-1 gap-3 sm:gap-4 ${isClone ? "lg:hidden" : "lg:contents"}`}
                  >
                    {pageItems.map((purpose) => (
                      <PurposeCard key={purpose.title} purpose={purpose} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 lg:hidden">
            <button
              type="button"
              aria-label="Previous"
              onClick={goPrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-white text-primary shadow-sm dark:bg-darklight dark:text-white"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Loan purpose pages">
            {PAGES.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeDot}
                aria-label={`Show purposes ${index * PAGE_SIZE + 1} to ${Math.min((index + 1) * PAGE_SIZE, LOAN_PURPOSES.length)}`}
                onClick={() => {
                  setAnimate(true);
                  setPage(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeDot
                    ? "w-7 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600"
                }`}
              />
            ))}
            </div>
            <button
              type="button"
              aria-label="Next"
              onClick={goNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-white text-primary shadow-sm dark:bg-darklight dark:text-white"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
