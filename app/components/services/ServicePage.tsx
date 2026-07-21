"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import { reportFormValidity } from "@/app/utils/formValidation";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import { MOBILE_VALIDATION } from "@/app/config/constants";
import { mapServiceToCategory } from "@/app/utils/leadApi";
import {
  INSURANCE_TYPE_OPTIONS,
  LOAN_AMOUNT_OPTIONS,
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  validateLeadPanNameMobile,
  type LeadFieldErrors,
} from "@/app/utils/leadForm";
import { isAllowedProductSlug } from "@/app/lib/services/allowedProducts";
import { fetchActiveServiceCards } from "@/app/utils/fetchActiveServiceCards";
import { sanitizeMobileInput } from "@/app/utils/validation";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
  serviceSlug?: string;
};

const FALLBACK_SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Select product" },
  { value: "personal-loan", label: "Personal Loan" },
  { value: "insurance", label: "Insurance" },
];

function slugFromServiceHref(href: string): string {
  return href.replace(/^\/products\//, "").replace(/\/$/, "").trim();
}

function slugFromPathname(pathname: string): string {
  const m = pathname.match(/\/products\/([^/]+)/);
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

const inputClass =
  "w-full px-3.5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode/80 text-sm sm:text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70";

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
    [serviceSlugProp, pathname],
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [serviceOptions, setServiceOptions] = useState(FALLBACK_SERVICE_OPTIONS);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [service, setService] = useState(pageServiceSlug);
  const [loanAmt, setLoanAmt] = useState("");
  const [insType, setInsType] = useState("");
  const [pan, setPan] = useState("");
  const [formError, setFormError] = useState("");

  const selectedCategory = mapServiceToCategory(service);
  const showLoanAmount = selectedCategory === "personal_loan";
  const showInsuranceType = selectedCategory === "insurance";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { cards, status } = await fetchActiveServiceCards();
      if (cancelled || status !== "ok" || cards.length === 0) return;
      const allowed = cards.filter((c) => isAllowedProductSlug(slugFromServiceHref(c.href)));
      if (allowed.length === 0) return;
      setServiceOptions([
        { value: "", label: "Select product" },
        ...allowed.map((c) => {
          const slug = slugFromServiceHref(c.href);
          return { value: slug, label: c.title.trim() || slug };
        }),
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setFullName("");
    setMobile("");
    setService(pageServiceSlug);
    setLoanAmt("");
    setInsType("");
    setPan("");
    setTermsAccepted(false);
    setFormError("");
  };

  const handleSubmit = (form: HTMLFormElement) => {
    if (!reportFormValidity(form)) return;

    const errors: LeadFieldErrors = validateLeadPanNameMobile({
      pan,
      mobileDigits: mobile.replace(/\D/g, ""),
      fullName,
    });
    if (!service.trim()) errors.service = "Please select a product";
    if (showLoanAmount && !loanAmt.trim()) errors.loanAmt = "Please select loan amount range";
    if (showInsuranceType && !insType.trim()) errors.insType = "Please select insurance type";

    const firstError = Object.values(errors)[0];
    if (firstError) {
      setFormError(firstError);
      return;
    }

    setFormError("");
    setShowApplyModal(true);
  };

  return (
    <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 bg-gradient-to-b from-light to-white dark:from-darkmode dark:to-semidark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          <div className="min-w-0 flex flex-col w-full order-1 lg:order-1 lg:col-span-6 lg:justify-center" data-aos="fade-right">
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

            <div className="bg-gradient-to-r from-primary to-[#ff7a1a] p-[1px] rounded-2xl sm:rounded-3xl shadow-xl w-full min-w-0 flex flex-col">
              <div className="bg-white dark:bg-darklight rounded-2xl sm:rounded-3xl py-5 sm:py-6 lg:py-7 px-4 sm:px-5 md:px-6 flex flex-1 flex-col min-h-0">
                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-midnight_text dark:text-white">
                    Apply for {title}
                  </h2>
                </div>

                {showSuccess && (
                  <SuccessPopup
                    message={getSuccessMessage(title)}
                    onClose={() => setShowSuccess(false)}
                    autoCloseMs={3000}
                  />
                )}

                <LeadApplyModal
                  open={showApplyModal}
                  mobile={mobile.replace(/\D/g, "")}
                  details={{ fullName, service, loanAmt, insType, pan }}
                  onClose={() => setShowApplyModal(false)}
                  onEditMobile={() => setShowApplyModal(false)}
                  onSuccess={() => {
                    resetForm();
                    setShowSuccess(true);
                  }}
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e.currentTarget);
                  }}
                  className="mt-3 flex flex-1 flex-col gap-4 min-h-0"
                >
                  {formError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 break-words">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="service-fullname" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="service-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(sanitizeLeadNameInput(e.target.value))}
                      placeholder="Full Name (As per PAN)"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                      Mobile Number *
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
                        onChange={(e) => setMobile(sanitizeMobileInput(e.target.value))}
                        pattern="[0-9]*"
                        className="flex-1 py-2.5 sm:py-3 px-2.5 sm:px-3 min-w-0 text-sm sm:text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="service-product" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                        Select product *
                      </label>
                      <select
                        id="service-product"
                        value={service}
                        onChange={(e) => {
                          setService(e.target.value);
                          setLoanAmt("");
                          setInsType("");
                        }}
                        className={inputClass}
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt.value || "select"} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {showLoanAmount && (
                      <div>
                        <label htmlFor="service-loan-amt" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                          Loan amount range *
                        </label>
                        <select
                          id="service-loan-amt"
                          value={loanAmt}
                          onChange={(e) => setLoanAmt(e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Select amount range</option>
                          {LOAN_AMOUNT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {showInsuranceType && (
                      <div>
                        <label htmlFor="service-ins-type" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                          Insurance type *
                        </label>
                        <select
                          id="service-ins-type"
                          value={insType}
                          onChange={(e) => setInsType(e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Select insurance type</option>
                          {INSURANCE_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="service-pan" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                      PAN Card number *
                    </label>
                    <input
                      id="service-pan"
                      type="text"
                      value={pan}
                      onChange={(e) => setPan(sanitizeLeadPanInput(e.target.value))}
                      maxLength={10}
                      placeholder="e.g. ABCDE1234F"
                      className={inputClass}
                    />
                  </div>

                  <TermsAgreementCheckbox
                    id="service-terms"
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                  />

                  <div className="mt-auto w-full pt-2 sm:pt-3">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl btn-gradient text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 transition-opacity shadow-md min-h-[44px]"
                    >
                      Apply Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 order-2 lg:order-2 w-full items-center justify-center lg:col-span-6" data-aos="fade-left">
            <Image
              src={imageSrc}
              alt={title}
              width={640}
              height={480}
              className="block h-auto w-full max-w-[560px] object-contain lg:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
