"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_IMAGES } from "@/app/config/constants";
import { scrollToElement } from "@/app/utils/scroll";
import HeroFeatureIcons from "./HeroFeatureIcons";
import HeroTrustStrip from "./HeroTrustStrip";

export default function Hero() {
  return (
    <section
      id="home"
      className="hero-section hero-section--with-strip relative overflow-x-hidden min-h-0 bg-white dark:bg-darkmode"
    >
      <div className="hero-section__bg" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md relative z-10 h-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-14 lg:items-center min-h-0">
          <div className="flex flex-col justify-center items-start min-w-0 order-1">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2 sm:mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              Personal Loan
            </span>

            <h1 className="!text-[1.75rem] xs:!text-[2rem] sm:!text-[clamp(2.25rem,3.5vw+0.5rem,3.25rem)] !leading-[1.12] font-bold text-midnight_text dark:text-white">
              Personal Loan
              <br />
              For Your <span className="theme-gradient-text">Every Need</span>
            </h1>

            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base md:text-lg text-gray leading-relaxed">
              Apply for a personal loan in minutes with a secure process,
              minimal documentation, and quick approval.
            </p>

            <HeroFeatureIcons />

            <div className="mt-6 sm:mt-7 flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 w-full xs:w-auto">
              <Link
                href="/products/personal-loan"
                className="btn-gradient btn-shine relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-[0_8px_24px_rgba(66,54,251,0.35)] transition duration-300"
              >
                Apply for Personal Loan
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => scrollToElement("emi-calculator")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-white dark:bg-darklight px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-primary dark:text-white hover:border-primary hover:bg-primary/5 transition duration-300"
              >
                EMI Calculator
              </button>
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
                width={720}
                height={555}
                className="w-full h-auto object-contain object-bottom block"
                sizes="(max-width: 640px) 390px, (max-width: 768px) 490px, (max-width: 1024px) 560px, (max-width: 1280px) 620px, 670px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <HeroTrustStrip />
    </section>
  );
}
