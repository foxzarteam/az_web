"use client";

import { useState } from "react";
import Image from "next/image";
import { COLORS, DEFAULT_IMAGES, MOBILE_VALIDATION } from "@/app/config/constants";
import { validateMobileNumber, sanitizeMobileInput } from "@/app/utils/validation";
import { scrollToElement } from "@/app/utils/scroll";
import IndiaFlag from "./IndiaFlag";
import AnimatedText from "./AnimatedText";
import SuccessPopup from "@/app/components/shared/SuccessPopup";

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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const validation = handleFormSubmit(mobile);
    if (!validation.isValid) {
      setError(validation.error || "");
      return;
    }
    setError("");
    setShowSuccess(true);
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = handleMobileChange(e.target.value);
    setMobile(sanitized);
    if (error) setError("");
  };

  return (
    <section
      id="home"
      className="relative overflow-x-hidden pt-[4.5rem] sm:pt-24 md:pt-28 lg:pt-32 pb-0 sm:pb-10 lg:pb-0 min-h-0 lg:min-h-[420px]"
      style={{ backgroundColor: COLORS.PRIMARY }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md relative z-10 h-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 lg:items-center min-h-0 lg:min-h-[360px]">
          {/* Left: Heading + Form - on mobile: top (order-1); on laptop: left */}
          <div className="flex flex-col lg:col-span-6 justify-center items-start order-1 lg:order-1 min-w-0" data-aos="fade-right">
            <div className="w-full min-w-0 mb-4 sm:mb-5 lg:mb-6">
              <h1 className="text-white font-bold flex flex-nowrap items-center gap-1.5 sm:gap-2 whitespace-nowrap leading-tight text-[23px] xs:text-[23px] sm:text-xl md:text-2xl lg:text-[2.15rem] xl:text-[2.625rem]">
                <span>Get an instant</span>
                <AnimatedText />
              </h1>
              <p className="mt-1.5 sm:mt-2 text-white/90 font-medium whitespace-nowrap text-[10px] xs:text-xs sm:text-sm md:text-base">
                Compare Best Rates | Quick Approval | 100% Online
              </p>
            </div>
            <div className="w-full min-w-0 max-w-full ">
              {showSuccess && (
                <SuccessPopup
                  message="Application started! We'll contact you shortly to help with your request."
                  onClose={() => setShowSuccess(false)}
                  autoCloseMs={3000}
                />
              )}
              <div className="bg-white dark:bg-darkmode rounded-xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-7">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-midnight_text dark:text-white mb-3 sm:mb-4">Let&apos;s Get Started</h2>
                <label className="block text-xs sm:text-sm font-medium text-midnight_text dark:text-gray-300 mb-2">Mobile Number</label>
                <div className="flex items-center rounded-lg border border-gray-300 dark:border-dark_border overflow-hidden bg-white dark:bg-[#0c121e]">
                  <span className="pl-2.5 sm:pl-3 flex items-center shrink-0" aria-hidden>
                    <IndiaFlag />
                  </span>
                  <span className="pl-1.5 sm:pl-2 pr-2 sm:pr-3 text-sm sm:text-base text-midnight_text dark:text-gray-400 font-medium">+91</span>
                  <span className="h-5 sm:h-6 w-px bg-gray-300 dark:bg-dark_border" aria-hidden />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={handleMobileInputChange}
                    pattern="[0-9]*"
                    className="flex-1 py-3 sm:py-3.5 px-2.5 sm:px-3 min-w-0 text-sm sm:text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none dark:bg-transparent"
                  />
                </div>
                {error && <p className="text-red-600 text-xs sm:text-sm mt-2">{error}</p>}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-4 sm:mt-5 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-bold text-white bg-primary rounded-lg transition duration-300 hover:bg-blue-700"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          {/* Right: Hero Image - on mobile: full width (same as form), stick to bottom blue; on laptop: right column */}
          <div className="flex lg:col-span-6 justify-center lg:justify-end items-end lg:items-end order-2 lg:order-2 min-w-0 w-full lg:w-auto">
            <div className="relative w-full max-w-none sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[460px] 2xl:max-w-[520px] mx-0 lg:mx-0 lg:ml-auto min-h-[200px] xs:min-h-[240px] sm:min-h-0 lg:min-h-0">
              <Image
                src={DEFAULT_IMAGES.HERO}
                alt="hero"
                width={520}
                height={400}
                className="w-full h-auto object-contain object-bottom block lg:object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 360px, (max-width: 1024px) 400px, (max-width: 1280px) 420px, 520px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
