"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { COLORS, DEFAULT_IMAGES, MOBILE_VALIDATION } from "@/app/config/constants";
import { validateMobileNumber, sanitizeMobileInput } from "@/app/utils/validation";
import { scrollToElement } from "@/app/utils/scroll";
import IndiaFlag from "./IndiaFlag";
import AnimatedText from "./AnimatedText";
import SuccessPopup from "@/app/components/shared/SuccessPopup";

const HERO_SERVICES = [
  { value: "", label: "Select service" },
  { value: "personal-loan", label: "Personal Loan" },
  { value: "home-loan", label: "Home Loan" },
  { value: "business-loan", label: "Business Loan" },
  { value: "credit-card", label: "Credit Card" },
  { value: "insurance", label: "Insurance" },
];

const PAN_REGEX = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
const NAME_REGEX = /^[a-zA-Z\s.]*$/;

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
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fullName, setFullName] = useState("");
  const [service, setService] = useState("");
  const [pan, setPan] = useState("");
  const [modalErrors, setModalErrors] = useState<{ fullName?: string; service?: string; pan?: string }>({});

  const handleSubmit = () => {
    const validation = handleFormSubmit(mobile);
    if (!validation.isValid) {
      setError(validation.error || "");
      return;
    }
    setError("");
    setShowServiceModal(true);
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = handleMobileChange(e.target.value);
    setMobile(sanitized);
    if (error) setError("");
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value.replace(/[^a-zA-Z\s.]/g, ""));
    if (modalErrors.fullName) setModalErrors((p) => ({ ...p, fullName: undefined }));
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPan(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase());
    if (modalErrors.pan) setModalErrors((p) => ({ ...p, pan: undefined }));
  };

  const handleServiceModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { fullName?: string; service?: string; pan?: string } = {};
    const nameTrim = fullName.trim();
    if (!nameTrim) next.fullName = "Full name is required";
    else if (!NAME_REGEX.test(nameTrim)) next.fullName = "Name should not contain special characters or numbers";
    if (!service.trim()) next.service = "Please select a service";
    const panTrim = pan.trim().toUpperCase();
    if (!panTrim) next.pan = "PAN is required";
    else if (!PAN_REGEX.test(panTrim)) next.pan = "Invalid PAN (e.g. ABCDE1234F)";
    setModalErrors(next);
    if (Object.keys(next).length > 0) return;
    setShowServiceModal(false);
    setMobile("");
    setFullName("");
    setService("");
    setPan("");
    setModalErrors({});
    setShowSuccess(true);
  };

  useEffect(() => {
    if (!showServiceModal) return;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      position: document.body.style.position,
      top: document.body.style.top,
    };
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "0";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.paddingRight;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      window.scrollTo(0, scrollY);
    };
  }, [showServiceModal]);

  return (
    <section
      id="home"
      className="relative overflow-x-hidden pt-[5.25rem] sm:pt-24 md:pt-28 lg:pt-32 pb-0 sm:pb-10 lg:pb-0 min-h-0 lg:min-h-[420px]"
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
                Lowest Rates | Quick Approval | 100% Secure Online Process
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
              {showServiceModal &&
                typeof document !== "undefined" &&
                createPortal(
                  <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center px-4 sm:p-4 bg-black/50 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="hero-service-modal-title"
                  >
                    <div className="bg-gradient-to-r from-primary to-[#ff7a1a] p-[1px] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                      <div className="bg-white dark:bg-darklight rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 sm:p-6 pb-0 sm:pb-0">
                          <h2 id="hero-service-modal-title" className="text-lg sm:text-xl font-bold text-midnight_text dark:text-white">
                            Enter details
                          </h2>
                          <button
                            type="button"
                            onClick={() => {
                              setShowServiceModal(false);
                              setFullName("");
                              setService("");
                              setPan("");
                              setModalErrors({});
                            }}
                            className="p-2 -m-2 rounded-lg text-midnight_text dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Close"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                        <form onSubmit={handleServiceModalSubmit} className="p-6 sm:p-8 pt-4 sm:pt-6 space-y-4">
                          <div>
                            <label htmlFor="hero-fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Full Name *
                            </label>
                            <input
                              id="hero-fullname"
                              type="text"
                              value={fullName}
                              onChange={handleFullNameChange}
                              placeholder="As per PAN / Aadhaar"
                              className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-darkmode text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 ${modalErrors.fullName ? "border-red-500" : "border-gray-300 dark:border-dark_border"}`}
                            />
                            {modalErrors.fullName && <p className="mt-1 text-sm text-red-600">{modalErrors.fullName}</p>}
                          </div>
                          <div>
                            <label htmlFor="hero-service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Select service *
                            </label>
                            <select
                              id="hero-service"
                              value={service}
                              onChange={(e) => {
                                setService(e.target.value);
                                if (modalErrors.service) setModalErrors((p) => ({ ...p, service: undefined }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80 ${modalErrors.service ? "border-red-500" : "border-gray-300 dark:border-dark_border"}`}
                            >
                              {HERO_SERVICES.map((opt) => (
                                <option key={opt.value || "select"} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {modalErrors.service && <p className="mt-1 text-sm text-red-600">{modalErrors.service}</p>}
                          </div>
                          <div>
                            <label htmlFor="hero-pan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              PAN Card number *
                            </label>
                            <input
                              id="hero-pan"
                              type="text"
                              value={pan}
                              onChange={handlePanChange}
                              maxLength={10}
                              placeholder="e.g. ABCDE1234F"
                              className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-darkmode text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 ${modalErrors.pan ? "border-red-500" : "border-gray-300 dark:border-dark_border"}`}
                            />
                            {modalErrors.pan && <p className="mt-1 text-sm text-red-600">{modalErrors.pan}</p>}
                          </div>
                          <div className="pt-2">
                            <button
                              type="submit"
                              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-blue-700 transition-colors"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>,
                  document.body
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
