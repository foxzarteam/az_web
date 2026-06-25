"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox, { TERMS_AGREEMENT_ERROR } from "@/app/components/shared/TermsAgreementCheckbox";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import { MOBILE_VALIDATION } from "@/app/config/constants";
import { completeLead, leadIdFromResponse, mapServiceToCategory, startLead } from "@/app/utils/leadApi";
import { fetchActiveServiceCards } from "@/app/utils/fetchActiveServiceCards";
import {
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  validateLeadPanNameMobile,
} from "@/app/utils/leadForm";
import { sanitizeMobileInput, validateMobileNumber } from "@/app/utils/validation";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
  /** e.g. personal-loan — defaults from URL /services/[slug] */
  serviceSlug?: string;
};

const FALLBACK_SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Select service" },
  { value: "personal-loan", label: "Personal Loan" },
  { value: "home-loan", label: "Home Loan" },
  { value: "business-loan", label: "Business Loan" },
  { value: "credit-card", label: "Credit Card" },
  { value: "insurance", label: "Insurance" },
];

function slugFromServiceHref(href: string): string {
  return href.replace(/^\/services\//, "").replace(/\/$/, "").trim();
}

function slugFromPathname(pathname: string): string {
  const m = pathname.match(/\/services\/([^/]+)/);
  return m?.[1]?.trim() ?? "";
}

function getSuccessMessage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("personal")) return "Your Personal Loan application has been received. We'll contact you shortly.";
  if (t.includes("home")) return "Your Home Loan application has been received. We'll contact you shortly.";
  if (t.includes("business")) return "Your Business Loan application has been received. We'll contact you shortly.";
  if (t.includes("credit")) return "Your Credit Card application has been received. We'll contact you shortly.";
  if (t.includes("insurance")) return "Your Insurance request has been received. We'll contact you shortly.";
  return `Your ${title} application has been received. We'll contact you shortly.`;
}

export default function ServicePage({
  title,
  subtitle,
  imageSrc,
  badge,
  hideHeader,
  serviceSlug: serviceSlugProp,
}: ServicePageProps) {
  const pathname = usePathname();
  const pageServiceSlug = useMemo(
    () => (serviceSlugProp?.trim() || slugFromPathname(pathname) || "").trim(),
    [serviceSlugProp, pathname]
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [service, setService] = useState("");
  const [pan, setPan] = useState("");
  const [serviceOptions, setServiceOptions] = useState(FALLBACK_SERVICE_OPTIONS);
  const [modalErrors, setModalErrors] = useState<{
    pan?: string;
    mobile?: string;
    fullName?: string;
    service?: string;
    api?: string;
    terms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isStartingLead, setIsStartingLead] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  useEffect(() => {
    if (pageServiceSlug) setService(pageServiceSlug);
  }, [pageServiceSlug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { cards, status } = await fetchActiveServiceCards();
      if (cancelled || status !== "ok" || cards.length === 0) return;
      setServiceOptions([
        { value: "", label: "Select service" },
        ...cards.map((c) => {
          const slug = slugFromServiceHref(c.href);
          return { value: slug, label: c.title.trim() || slug };
        }),
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showDetailsModal) return;
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
  }, [showDetailsModal]);

  const openDetailsModal = async () => {
    const validation = validateMobileNumber(mobile);
    if (!validation.isValid) {
      setMobileError(validation.error || "Enter a valid 10-digit mobile number");
      return;
    }

    const mobileTrim = mobile.replace(/\D/g, "");
    const category = mapServiceToCategory(pageServiceSlug || service || "personal-loan");

    setIsStartingLead(true);
    setMobileError("");

    try {
      const response = await startLead(mobileTrim, category);
      if (!response.success) {
        setMobileError(response.message || "This number already exists.");
        return;
      }

      const id = leadIdFromResponse(response.data);
      if (!id) {
        setMobileError("Could not save mobile number. Please try again.");
        return;
      }

      setLeadId(id);
      if (pageServiceSlug) setService(pageServiceSlug);
      setShowDetailsModal(true);
    } catch {
      setMobileError("Network error. Please try again later.");
    } finally {
      setIsStartingLead(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setFullName("");
    setPan("");
    setModalErrors({});
    setTermsAccepted(false);
    setLeadId(null);
    if (pageServiceSlug) setService(pageServiceSlug);
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(sanitizeMobileInput(e.target.value));
    if (mobileError) setMobileError("");
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(sanitizeLeadNameInput(e.target.value));
    if (modalErrors.fullName) setModalErrors((p) => ({ ...p, fullName: undefined }));
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPan(sanitizeLeadPanInput(e.target.value));
    if (modalErrors.pan) setModalErrors((p) => ({ ...p, pan: undefined }));
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobileTrim = mobile.replace(/\D/g, "");
    const base = validateLeadPanNameMobile({
      pan,
      mobileDigits: mobileTrim,
      fullName,
    });
    const next: typeof modalErrors = { ...base };
    if (!service.trim()) next.service = "Please select a service";
    if (!termsAccepted) next.terms = TERMS_AGREEMENT_ERROR;

    setModalErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!leadId) {
      setModalErrors((p) => ({ ...p, api: "Session expired. Please enter your mobile number again." }));
      return;
    }

    setIsSubmitting(true);
    setModalErrors((p) => ({ ...p, api: undefined }));

    try {
      const response = await completeLead(leadId, {
        pan: pan.trim().toUpperCase(),
        fullName: fullName.trim(),
        category: mapServiceToCategory(service),
      });

      if (response.success) {
        setShowDetailsModal(false);
        setMobile("");
        setFullName("");
        setPan("");
        setModalErrors({});
        setLeadId(null);
        if (pageServiceSlug) setService(pageServiceSlug);
        setShowSuccess(true);
      } else {
        setModalErrors((p) => ({ ...p, api: response.message || "Failed to submit. Please try again." }));
      }
    } catch {
      setModalErrors((p) => ({ ...p, api: "Network error. Please try again later." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 bg-gradient-to-b from-light to-white dark:from-darkmode dark:to-semidark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          <div className="min-w-0 flex flex-col w-full order-1 lg:order-1 lg:justify-center" data-aos="fade-right">
            {!hideHeader && (
              <>
                {badge && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {badge}
                  </span>
                )}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-midnight_text dark:text-white mb-3 sm:mb-4">
                  {title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray dark:text-gray-300 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                  {subtitle}
                </p>
              </>
            )}

            <div className="bg-gradient-to-r from-primary to-[#ff7a1a] p-[1px] rounded-2xl sm:rounded-3xl shadow-xl w-full min-w-0 flex flex-col lg:min-h-[300px]">
              <div className="bg-white dark:bg-darklight rounded-2xl sm:rounded-3xl py-5 sm:py-6 lg:py-8 px-4 sm:px-5 md:px-6 flex flex-1 flex-col min-h-0">
                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-midnight_text dark:text-white">
                    Let&apos;s Get Started
                  </h2>
                  <p className="mt-1 text-sm text-gray dark:text-gray-400">
                    Apply for {title}
                  </p>
                </div>

                {showSuccess && (
                  <SuccessPopup
                    message={getSuccessMessage(title)}
                    onClose={() => setShowSuccess(false)}
                    autoCloseMs={3000}
                  />
                )}

                {showDetailsModal &&
                  typeof document !== "undefined" &&
                  createPortal(
                    <div
                      className="fixed inset-0 z-[99999] flex items-center justify-center px-4 sm:p-4 bg-black/50 backdrop-blur-sm"
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="service-lead-modal-title"
                    >
                      <div className="bg-gradient-to-r from-primary to-[#ff7a1a] p-[1px] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-white dark:bg-darklight rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
                          <div className="flex items-center justify-between p-4 sm:p-6 pb-0">
                            <h2 id="service-lead-modal-title" className="text-lg sm:text-xl font-bold text-midnight_text dark:text-white">
                              Enter details
                            </h2>
                            <button
                              type="button"
                              onClick={closeDetailsModal}
                              className="p-2 -m-2 rounded-lg text-midnight_text dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                              aria-label="Close"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                          <form onSubmit={handleDetailsSubmit} className="p-6 sm:p-8 pt-4 space-y-4">
                            {(modalErrors.api || modalErrors.mobile) && (
                              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {modalErrors.api ?? modalErrors.mobile}
                                </p>
                              </div>
                            )}
                            <div>
                              <label htmlFor="service-fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name *
                              </label>
                              <input
                                id="service-fullname"
                                type="text"
                                value={fullName}
                                onChange={handleFullNameChange}
                                placeholder="Full Name (As per PAN)"
                                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-darkmode text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 ${modalErrors.fullName ? "border-red-500" : "border-gray-300 dark:border-dark_border"}`}
                              />
                              {modalErrors.fullName && <p className="mt-1 text-sm text-red-600">{modalErrors.fullName}</p>}
                            </div>
                            <div>
                              <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Select service *
                              </label>
                              <select
                                id="service-select"
                                value={service}
                                onChange={(e) => {
                                  setService(e.target.value);
                                  if (modalErrors.service) setModalErrors((p) => ({ ...p, service: undefined }));
                                }}
                                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80 ${modalErrors.service ? "border-red-500" : "border-gray-300 dark:border-dark_border"}`}
                              >
                                {serviceOptions.map((opt) => (
                                  <option key={opt.value || "select"} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {modalErrors.service && <p className="mt-1 text-sm text-red-600">{modalErrors.service}</p>}
                            </div>
                            <div>
                              <label htmlFor="service-pan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                PAN Card number *
                              </label>
                              <input
                                id="service-pan"
                                type="text"
                                value={pan}
                                onChange={handlePanChange}
                                maxLength={10}
                                placeholder="e.g. ABCDE1234F"
                                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-darkmode text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 ${modalErrors.pan ? "border-red-500" : "border-gray-300 dark:border-dark_border"}`}
                              />
                              {modalErrors.pan && <p className="mt-1 text-sm text-red-600">{modalErrors.pan}</p>}
                            </div>
                            <TermsAgreementCheckbox
                              id="service-terms"
                              checked={termsAccepted}
                              onChange={(checked) => {
                                setTermsAccepted(checked);
                                if (modalErrors.terms) setModalErrors((p) => ({ ...p, terms: undefined }));
                              }}
                              error={modalErrors.terms}
                            />
                            <button
                              type="submit"
                              disabled={isSubmitting || !termsAccepted}
                              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}

                <div className="mt-4 flex flex-1 flex-col gap-4 min-h-0">
                  <div>
                    <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="flex items-center rounded-lg sm:rounded-xl border border-gray-300 dark:border-dark_border overflow-hidden bg-white dark:bg-darkmode/80">
                  <span className="pl-2.5 sm:pl-3 flex items-center shrink-0" aria-hidden>
                    <IndiaFlag />
                  </span>
                  <span className="pl-1.5 sm:pl-2 pr-2 sm:pr-3 text-sm text-midnight_text dark:text-white font-medium">+91</span>
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
                    className="flex-1 py-2.5 sm:py-3 px-2.5 sm:px-3 min-w-0 text-sm sm:text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
                    {mobileError && <p className="text-red-600 text-xs sm:text-sm mt-2">{mobileError}</p>}
                  </div>

                  <div className="mt-auto w-full pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => void openDetailsModal()}
                      disabled={isStartingLead}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-primary hover:bg-blue-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 transition-colors shadow-md min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isStartingLead ? "Please wait…" : "Apply Now"}
                    </button>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-500 mt-2">
                      By submitting, you agree to be contacted by Apni Zaroorat and its lending partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 order-2 lg:order-2 w-full h-full min-h-[280px] lg:min-h-[420px]" data-aos="fade-left">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 shadow-2xl sm:rounded-3xl lg:min-h-[420px]">
              <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-primary/20 blur-3xl sm:h-32 sm:w-32" />
              <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-accent/30 blur-3xl sm:-bottom-12 sm:-right-12 sm:h-40 sm:w-40" />
              <div className="relative z-10 h-full min-h-[280px] w-full lg:min-h-[420px]">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={640}
                  height={480}
                  className="h-full min-h-[280px] w-full object-cover object-center lg:min-h-[420px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
