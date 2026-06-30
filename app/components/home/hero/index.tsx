"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DEFAULT_IMAGES, MOBILE_VALIDATION } from "@/app/config/constants";
import { validateMobileNumber, sanitizeMobileInput } from "@/app/utils/validation";
import { scrollToElement } from "@/app/utils/scroll";
import { fetchActiveServiceCards } from "@/app/utils/fetchActiveServiceCards";
import type { ServiceSliderCard } from "@/app/lib/services/types";
import IndiaFlag from "./IndiaFlag";
import HeroFeatureIcons from "./HeroFeatureIcons";
import HeroTrustStrip from "./HeroTrustStrip";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import { reportFormValidity } from "@/app/utils/formValidation";

const HERO_SERVICE_SLUGS = new Set(["personal-loan", "insurance"]);

const HERO_FALLBACK_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Select product" },
  { value: "personal-loan", label: "Personal Loan" },
  { value: "insurance", label: "Insurance" },
];

function slugFromServiceCard(card: ServiceSliderCard): string {
  return card.href.replace(/^\/products\//, "").replace(/\/$/, "").trim();
}

function pickHeroServiceCards(cards: ServiceSliderCard[]): ServiceSliderCard[] {
  return cards.filter((c) => HERO_SERVICE_SLUGS.has(slugFromServiceCard(c)));
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
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [heroServiceOptions, setHeroServiceOptions] = useState(HERO_FALLBACK_OPTIONS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { cards, status } = await fetchActiveServiceCards();
      if (cancelled || status !== "ok") return;
      const heroCards = pickHeroServiceCards(cards);
      if (heroCards.length === 0) return;
      setHeroServiceOptions([
        { value: "", label: "Select product" },
        ...heroCards.map((c) => ({
          value: slugFromServiceCard(c),
          label: c.title.trim() || slugFromServiceCard(c),
        })),
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (form: HTMLFormElement) => {
    if (!reportFormValidity(form)) return;

    const validation = handleFormSubmit(mobile);
    if (!validation.isValid) {
      setError(validation.error || "");
      return;
    }
    setError("");
    setShowApplyModal(true);
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(sanitizeMobileInput(e.target.value));
    if (error) setError("");
  };

  return (
    <section
      id="home"
      className="hero-section hero-section--with-strip relative overflow-x-hidden min-h-0 bg-[#F5F7FB] dark:bg-darkmode"
    >
      <div className="hero-section__bg" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md relative z-10 h-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-14 lg:items-center min-h-0">
          <div className="flex flex-col justify-center items-start min-w-0 order-1">
            <div className="w-full min-w-0 mb-1">
              <h1 className="!text-[1.375rem] xs:!text-[1.5rem] sm:!text-[clamp(1.75rem,3vw+0.5rem,2.75rem)] !leading-[1.15] font-bold text-midnight_text dark:text-white">
                Instant Personal Loan
              </h1>
              <p className="mt-0.5 text-[1.375rem] xs:text-[1.5rem] sm:text-[clamp(1.75rem,3vw+0.5rem,2.75rem)] font-bold leading-[1.15]">
                <span className="text-midnight_text dark:text-white">up to </span>
                <span className="theme-gradient-text">₹10 Lakhs</span>
              </p>
            </div>

            <HeroFeatureIcons />

            <div className="w-full min-w-0 max-w-full">
              {showSuccess && (
                <SuccessPopup
                  message="Application started! We'll contact you shortly to help with your request."
                  onClose={() => setShowSuccess(false)}
                  autoCloseMs={3000}
                />
              )}
              <LeadApplyModal
                open={showApplyModal}
                mobile={mobile.replace(/\D/g, "")}
                category="personal_loan"
                serviceOptions={heroServiceOptions}
                onClose={() => setShowApplyModal(false)}
                onEditMobile={() => setShowApplyModal(false)}
                onSuccess={() => {
                  setMobile("");
                  setTermsAccepted(false);
                  setShowSuccess(true);
                }}
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e.currentTarget);
                }}
                className="bg-white dark:bg-darklight rounded-2xl shadow-[0_8px_40px_rgba(16,45,71,0.08)] p-4 sm:p-5 md:p-7"
              >
                <h2 className="!text-lg sm:!text-xl font-bold text-midnight_text dark:text-white mb-0.5">
                  Check Your Eligibility Now
                </h2>
                <p className="text-xs sm:text-sm text-gray mb-4 sm:mb-5">It takes less than 2 minutes</p>

                <div className="flex items-center rounded-xl border border-[#E2E8F0] dark:border-dark_border overflow-hidden bg-white dark:bg-[#fafafa]">
                  <span className="pl-3 flex items-center shrink-0" aria-hidden>
                    <IndiaFlag />
                  </span>
                  <span className="pl-2 pr-2.5 text-sm sm:text-base text-midnight_text font-medium">+91</span>
                  <span className="h-6 w-px bg-[#E2E8F0] dark:bg-dark_border" aria-hidden />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChange={handleMobileInputChange}
                    pattern="[0-9]*"
                    className="flex-1 py-3.5 px-3 min-w-0 text-sm sm:text-base text-midnight_text placeholder:text-gray-400 focus:outline-none dark:bg-transparent border-0 rounded-none"
                  />
                </div>
                {error && <p className="text-red-600 text-xs sm:text-sm mt-2">{error}</p>}

                <TermsAgreementCheckbox
                  id="hero-terms"
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                  className="mt-4"
                  textClassName="text-xs sm:text-sm text-gray-600 dark:text-gray-300"
                />

                <button
                  type="submit"
                  className="btn-gradient w-full mt-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white rounded-xl transition duration-300 flex items-center justify-center gap-2"
                >
                  Check Eligibility
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-gray">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Your information is 100% secure with us
                </p>
              </form>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end items-end order-2 min-w-0 w-full">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[600px] xl:max-w-[660px] 2xl:max-w-[720px] mx-auto lg:mx-0 lg:ml-auto">
              <Image
                src={DEFAULT_IMAGES.HERO}
                alt="Instant personal loan - quick approval and online process"
                width={720}
                height={555}
                className="w-full h-auto object-contain object-bottom block"
                sizes="(max-width: 640px) 420px, (max-width: 768px) 520px, (max-width: 1024px) 600px, (max-width: 1280px) 660px, 720px"
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
