"use client";

import { useState } from "react";
import Image from "next/image";
import { COLORS, DEFAULT_IMAGES, MOBILE_VALIDATION } from "@/app/config/constants";
import { validateMobileNumber, sanitizeMobileInput } from "@/app/utils/validation";
import { scrollToElement } from "@/app/utils/scroll";
import IndiaFlag from "./IndiaFlag";
import AnimatedText from "./AnimatedText";

function handleMobileChange(value: string): string {
  return sanitizeMobileInput(value);
}

function handleFormSubmit(mobile: string): { isValid: boolean; error?: string } {
  const validation = validateMobileNumber(mobile);
  if (validation.isValid) {
    scrollToElement("featured");
  }
  return validation;
}

export default function Hero() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const validation = handleFormSubmit(mobile);
    if (!validation.isValid) {
      setError(validation.error || "");
      return;
    }
    setError("");
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = handleMobileChange(e.target.value);
    setMobile(sanitized);
    if (error) setError("");
  };

  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-28 pb-0 overflow-x-hidden min-h-0 lg:min-h-[380px]"
      style={{ backgroundColor: COLORS.PRIMARY }}
    >
      <div className="container mx-auto px-0 sm:px-4 lg:max-w-screen-xl md:max-w-screen-md relative z-10 h-full max-w-full">
        <div className="grid lg:grid-cols-12 grid-cols-1 lg:items-end gap-6 lg:gap-0 min-h-0 lg:min-h-[300px]">
          <div className="flex flex-col col-span-1 lg:col-span-6 justify-center items-start mb-4 lg:mb-[60px] px-4 sm:px-0" data-aos="fade-right">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-[40px] leading-[1.3] text-white font-bold flex flex-wrap items-center gap-2">
                <span>Get an instant</span>
                <AnimatedText />
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-white/90 font-medium">
                Compare Best Rates | Quick Approval | 100% Online
              </p>
            </div>
            <div className="w-full max-w-xl">
              <div className="bg-white dark:bg-darkmode rounded-xl shadow-lg p-5 sm:p-6 md:p-8">
                <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-4">Let&apos;s Get Started</h2>
                <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-2">Mobile Number</label>
                <div className="flex items-center rounded-lg border border-gray-300 dark:border-dark_border overflow-hidden bg-white dark:bg-[#0c121e]">
                  <span className="pl-3 flex items-center shrink-0" aria-hidden>
                    <IndiaFlag />
                  </span>
                  <span className="pl-2 pr-3 text-midnight_text dark:text-gray-400 font-medium">+91</span>
                  <span className="h-6 w-px bg-gray-300 dark:bg-dark_border" aria-hidden />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={handleMobileInputChange}
                    className="flex-1 py-3 sm:py-3.5 px-3 min-w-0 text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none dark:bg-transparent"
                  />
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-5 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white bg-primary rounded-lg transition duration-300 hover:bg-blue-700"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          <div className="flex col-span-1 lg:col-span-6 justify-center lg:justify-end items-end lg:items-end self-end lg:self-end px-4 sm:px-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[340px] lg:max-w-[480px] xl:max-w-[520px] lg:mt-12 mx-auto lg:mx-0">
              <Image
                src={DEFAULT_IMAGES.HERO}
                alt="hero"
                width={520}
                height={400}
                className="w-full h-auto object-contain object-bottom block"
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 340px, 520px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
