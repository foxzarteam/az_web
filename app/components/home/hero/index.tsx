"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_IMAGES } from "@/app/config/constants";
import HeroFeatureIcons from "./HeroFeatureIcons";

const ROTATING_NEEDS = ["Personal Loan", "Home Loan", "Vehicle Loan", "Business Loan", "Insurance"];

export default function Hero() {
  const [needIndex, setNeedIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setNeedIndex((current) => (current + 1) % ROTATING_NEEDS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="hero-section relative overflow-x-hidden min-h-0 bg-white dark:bg-darkmode"
    >
      <div className="hero-section__bg" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md relative z-10 h-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-14 lg:items-center min-h-0">
          <div className="hero-copy order-1 flex w-full min-w-0 flex-col items-start justify-center">
            <h1 className="hero-headline font-bold text-midnight_text dark:text-white">
              <span className="block whitespace-nowrap">Everything You Need in</span>
              <span className="flex flex-nowrap items-baseline gap-x-[0.35em] whitespace-nowrap">
                <span>One Place</span>
                <span className="inline-grid h-[1.15em] overflow-hidden align-baseline leading-[1.12]" aria-live="polite">
                  <span className="invisible col-start-1 row-start-1 select-none" aria-hidden>
                    Business Loan
                  </span>
                  <span key={needIndex} className="hero-need-in theme-gradient-text col-start-1 row-start-1">
                    {ROTATING_NEEDS[needIndex]}
                  </span>
                </span>
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray sm:mt-6 sm:text-lg">
              Apply in minutes for a loan or insurance that fits your needs
            </p>

            <HeroFeatureIcons />

            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/products/loans/"
                className="btn-gradient btn-shine relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(66,54,251,0.35)] transition duration-300 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Apply for Loan
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/products/insurance/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-white px-6 py-3.5 text-sm font-bold text-primary transition duration-300 hover:border-primary hover:bg-primary/5 dark:bg-darklight dark:text-white sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Apply for Insurance
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <p className="mt-4 sm:mt-5 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray">
              <svg viewBox="0 0 20 20" className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0" fill="none" aria-hidden>
                <path d="M10 2l6 2.5v5c0 3.5-2.5 6-6 7.5C6.5 15.5 4 13 4 9.5v-5L10 2z" fill="#16A34A" opacity="0.15" />
                <path d="M10 2l6 2.5v5c0 3.5-2.5 6-6 7.5C6.5 15.5 4 13 4 9.5v-5L10 2z" stroke="#16A34A" strokeWidth="1.3" />
                <path d="M7.5 10l1.8 1.8L12.5 8.5" stroke="#16A34A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Safe &amp; Secure Process
            </p>
          </div>

          <div className="flex justify-center lg:justify-end items-end order-2 min-w-0 w-full">
            <div className="relative w-full max-w-[390px] sm:max-w-[430px] md:max-w-[490px] lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[670px] mx-auto lg:mx-0 lg:ml-auto">
              <Image
                src={DEFAULT_IMAGES.HERO}
                alt="Personal loan for your every need - quick approval and minimal documents"
                width={1324}
                height={1188}
                className="w-full h-auto object-contain object-bottom block"
                sizes="(max-width: 640px) 390px, (max-width: 768px) 490px, (max-width: 1024px) 560px, (max-width: 1280px) 620px, 670px"
                priority
                quality={75}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
