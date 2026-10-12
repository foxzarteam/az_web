"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ConfirmationResult } from "firebase/auth";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox, {
  LeadCreditDisclaimer,
} from "@/app/components/shared/TermsAgreementCheckbox";
import { reportFormValidity } from "@/app/lib/formValidation";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import CheckApplicationStatusLink from "@/app/components/leads/CheckApplicationStatusLink";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import EmploymentIncomeFields from "@/app/components/leads/EmploymentIncomeFields";
import { MOBILE_VALIDATION } from "@/app/config/constants";
import { customerLogin } from "@/app/lib/customer/authApi";
import { applyLead, isExistingApplicationError, leadIdFromResponse, mapServiceToCategory, type CreateLeadResponse } from "@/app/lib/leads/leadApi";
import {
  firstLeadFieldError,
  personalLoanApplyPayload,
  validatePersonalLoanApplyForm,
} from "@/app/lib/leads/personalLoanApply";
import { useLoanProducts, useServiceCards } from "@/app/components/providers/ServiceCardsProvider";
import { fetchActiveServiceCards } from "@/app/lib/services/fetchActiveServiceCards";
import type { LoanProductTab } from "@/app/lib/services/types";
import { mergeLoanPageTabs } from "@/app/lib/services/loanPageTabs";
import { useLoanSelection } from "@/app/components/products/loans/loanSelection";
import { useInsuranceSelection } from "@/app/components/products/insurance/insuranceSelection";
import { productHrefToSlug } from "@/app/lib/services/allowedProducts";
import { useInsuranceTypeOptions } from "@/app/lib/services/useInsuranceTypeOptions";
import InsuranceTypeSelect from "@/app/components/leads/InsuranceTypeSelect";
import {
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  sanitizeLeadPincodeInput,
  validateLeadPanNameMobile,
  validateLeadPincode,
  type LeadFieldErrors,
} from "@/app/lib/leads/leadForm";
import { sanitizeMobileInput } from "@/app/lib/validation";
import { primeOtpRecaptcha, sendFirebasePhoneOtp, warmFirebaseAuth } from "@/app/lib/firebase/phoneAuth";
import { stashApplyThanks } from "@/app/lib/customer/applyThanks";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
  serviceSlug?: string;
  /** /products/loans: tabs for each active loan product. Amount range follows the selected tab. */
  loanTabs?: boolean;
  /** No page hero: clear the fixed navbar and draw a theme line under it. */
  navBorder?: boolean;
  /** Rendered under the nav line and above the apply form. */
  aboveForm?: ReactNode;
};

function slugFromPathname(pathname: string): string {
  const m = pathname.match(/\/products\/([^/]+)/);
  return m?.[1]?.trim() ?? "";
}

const inputClass =
  "w-full min-h-10 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode/80 text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70";

function loanTypeGif(slug: string): string {
  const key = slug.toLowerCase();
  if (key.includes("home")) return "/images/loans/home-loan.gif";
  if (key.includes("car") || key.includes("vehicle")) return "/images/loans/car-loan.gif";
  if (key.includes("business")) return "/images/loans/business-loan.gif";
  return "/images/loans/personal-loan.gif";
}

const mobileShellClass =
  "flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-dark_border dark:bg-darkmode/80";

const mobileInputClass =
  "min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none";

export default function ServicePage({
  title,
  subtitle,
  imageSrc,
  badge,
  hideHeader,
  serviceSlug: serviceSlugProp,
  loanTabs = false,
  navBorder = false,
  aboveForm,
}: ServicePageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageServiceSlug = useMemo(
    () => (serviceSlugProp?.trim() || slugFromPathname(pathname) || "").trim(),
    [serviceSlugProp, pathname],
  );

  const [existingAppMessage, setExistingAppMessage] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [pendingLeadId, setPendingLeadId] = useState("");
  const [otpSendPromise, setOtpSendPromise] = useState<Promise<ConfirmationResult> | null>(null);
  const applyPromiseRef = useRef<Promise<CreateLeadResponse> | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    warmFirebaseAuth();
  }, []);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [loanAmount, setLoanAmount] = useState(0);
  const insuranceSelection = useInsuranceSelection();
  const [localInsType, setLocalInsType] = useState("");
  const insType = insuranceSelection?.value ?? localInsType;
  const setInsType = insuranceSelection?.setValue ?? setLocalInsType;
  const [netMonthlyIncome, setNetMonthlyIncome] = useState("");
  const [pan, setPan] = useState("");
  const [formError, setFormError] = useState("");
  const loanSelection = useLoanSelection();
  const [localLoanSlug, setLocalLoanSlug] = useState("personal-loan");
  const loanSlug = loanSelection?.slug ?? localLoanSlug;
  const setLoanSlug = loanSelection?.setSlug ?? setLocalLoanSlug;
  const catalogLoans = useLoanProducts();
  const [fetchedLoans, setFetchedLoans] = useState<LoanProductTab[] | null>(null);
  const apiLoans = useMemo(() => {
    const hasRange = (list: LoanProductTab[]) =>
      list.some((item) => item.limitStart != null && item.limitEnd != null);
    const fetched = fetchedLoans ?? [];
    if (!hasRange(catalogLoans) && hasRange(fetched)) return fetched;
    if (catalogLoans.length > 0) return catalogLoans;
    return fetched;
  }, [catalogLoans, fetchedLoans]);
  const loanProducts = useMemo(
    () => (loanTabs ? mergeLoanPageTabs(apiLoans) : []),
    [apiLoans, loanTabs],
  );

  useEffect(() => {
    if (!formError) return;
    const t = window.setTimeout(() => setFormError(""), 3000);
    return () => window.clearTimeout(t);
  }, [formError]);

  const service = loanTabs ? loanSlug : pageServiceSlug;
  const selectedCategory = mapServiceToCategory(service);
  const showLoanAmount = loanTabs || selectedCategory === "personal_loan";
  const cards = useServiceCards();
  const selectedLoanTitle =
    loanTabs
      ? loanProducts.find((item) => item.slug === loanSlug)?.title || "Loan"
      : title;
  const loanBounds = useMemo(() => {
    if (loanTabs) {
      const tab = loanProducts.find((item) => item.slug === loanSlug);
      const min = tab?.limitStart;
      const max = tab?.limitEnd;
      if (min == null || max == null || max < min) return undefined;
      return { min, max };
    }
    const card = cards.find((item) => productHrefToSlug(item.href) === "personal-loan");
    const min = card?.limitStart;
    const max = card?.limitEnd;
    if (min == null || max == null || max < min) return undefined;
    return { min, max };
  }, [cards, loanProducts, loanSlug, loanTabs]);
  const showInsuranceType = selectedCategory === "insurance";
  const insuranceTypeOptions = useInsuranceTypeOptions();

  useEffect(() => {
    if (!loanTabs) return;
    const hasRange = catalogLoans.some((item) => item.limitStart != null && item.limitEnd != null);
    if (catalogLoans.length > 0 && hasRange) return;
    let cancelled = false;
    void fetchActiveServiceCards().then((res) => {
      if (!cancelled && res.status === "ok") setFetchedLoans(res.loanProducts);
    });
    return () => {
      cancelled = true;
    };
  }, [catalogLoans, loanTabs]);

  useEffect(() => {
    if (!loanTabs || loanProducts.length === 0) return;
    if (loanProducts.some((item) => item.slug === loanSlug)) return;
    const preferred = loanProducts.find((item) => item.slug === "personal-loan") ?? loanProducts[0];
    if (preferred) setLoanSlug(preferred.slug);
  }, [loanProducts, loanSlug, loanTabs, setLoanSlug]);

  useEffect(() => {
    setInsType(selectedCategory === "insurance" ? "health_insurance" : "");
    setNetMonthlyIncome("");
    setLoanAmount(0);
  }, [pageServiceSlug, selectedCategory, setInsType]);

  const loanAmountError = useMemo(() => {
    if (!showLoanAmount || !loanBounds || loanAmount <= 0) return "";
    if (loanAmount >= loanBounds.min && loanAmount <= loanBounds.max) return "";
    return `Loan amount must be between ₹${loanBounds.min.toLocaleString("en-IN")} and ₹${loanBounds.max.toLocaleString("en-IN")}`;
  }, [loanAmount, loanBounds, showLoanAmount]);

  const handleSubmit = async (form: HTMLFormElement) => {
    if (isSubmittingForm) return;
    if (!reportFormValidity(form)) {
      setFormError("");
      return;
    }
    if (!termsAccepted) {
      setFormError("Please tick the checkbox to continue.");
      return;
    }

    const errors: LeadFieldErrors = validateLeadPanNameMobile({
      pan,
      mobileDigits: mobile.replace(/\D/g, ""),
      fullName,
    });
    if (!service.trim()) errors.service = "Product could not be detected for this page";
    const pinErr = validateLeadPincode(pincode);
    if (pinErr) errors.pincode = pinErr;
    if (showLoanAmount && loanTabs && loanProducts.length > 0 && !loanBounds) {
      errors.loanAmt = "Amount range is not available for this loan.";
    } else if (showLoanAmount) {
      Object.assign(
        errors,
        validatePersonalLoanApplyForm({
          pan,
          mobile,
          fullName,
          pincode,
          loanAmount,
          netMonthlyIncome,
        }, loanBounds),
      );
      if (loanAmountError) delete errors.loanAmt;
    }
    if (showInsuranceType && !insType.trim()) errors.insType = "Please select insurance type";

    const firstError = firstLeadFieldError(errors);
    if (loanAmountError || firstError) {
      setFormError(firstError ?? "");
      return;
    }

    setFormError("");
    setIsSubmittingForm(true);
    primeOtpRecaptcha();

    try {
      const category = mapServiceToCategory(service);
      const pin = pincode.replace(/\D/g, "");
      const digits = mobile.replace(/\D/g, "");
      const pl =
        showLoanAmount
          ? personalLoanApplyPayload({
              pan,
              mobile,
              fullName,
              pincode,
              loanAmount,
              netMonthlyIncome,
            })
          : null;
      const payload = {
        pan: pan.trim().toUpperCase(),
        mobileNumber: digits,
        fullName: fullName.trim(),
        pincode: pin,
        category,
        ...(pl
          ? {
              requiredAmount: pl.requiredAmount,
              netMonthlyIncome: pl.netMonthlyIncome,
            }
          : {}),
        ...(category === "insurance" ? { insType } : {}),
        consentAccepted: termsAccepted,
      };
      applyPromiseRef.current = applyLead(payload);
      const res = await applyPromiseRef.current;
      if (!res.success) {
        if (isExistingApplicationError(res)) {
          setExistingAppMessage(
            res.message || "Your application is already KYC pending.",
          );
        } else {
          setFormError(res.message || "Could not submit application.");
        }
        return;
      }
      setOtpSendPromise(sendFirebasePhoneOtp(digits));
      setPendingLeadId(leadIdFromResponse(res.data) || "saved");
      setShowApplyModal(true);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <section
      id="apply"
      className={`scroll-mt-24 pb-0 ${loanTabs || navBorder ? "bg-white pt-16 md:pt-20 dark:bg-darkmode" : "bg-gradient-to-b from-light to-white pt-8 dark:from-darkmode dark:to-semidark"}`}
    >
      {(navBorder || loanTabs) && <div className="theme-gradient-bg h-1" aria-hidden />}
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md max-w-full ${loanTabs || navBorder ? "pt-5 sm:pt-0" : ""}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          <div className="min-w-0 flex flex-col w-full order-1 lg:order-1 lg:col-span-7 lg:justify-center" data-aos="fade-right">
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

            {aboveForm ? <div className="mb-4 w-full min-w-0 sm:mb-5">{aboveForm}</div> : null}

            <div id="apply-form" className="theme-gradient-bg scroll-mt-24 p-[1px] rounded-2xl sm:rounded-3xl shadow-xl w-full min-w-0 flex flex-col">
              <div className="bg-white dark:bg-darklight rounded-2xl sm:rounded-3xl py-4 sm:py-6 lg:py-7 px-4 sm:px-6 md:px-7 flex flex-1 flex-col min-h-0 min-w-0">
                <div className="mb-3">
                  <h2 className={`${loanTabs ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"} font-semibold text-midnight_text dark:text-white`}>
                    {loanTabs ? (
                      <>
                        Check{" "}
                        <span className="theme-gradient-text font-extrabold">{selectedLoanTitle}</span>
                        {" "}Eligibility
                      </>
                    ) : (
                      `Apply for ${selectedLoanTitle}`
                    )}
                  </h2>
                </div>

                {existingAppMessage && (
                  <SuccessPopup
                    message={existingAppMessage}
                    variant="warning"
                    onClose={() => setExistingAppMessage("")}
                    footer={<CheckApplicationStatusLink />}
                  />
                )}

                <LeadApplyModal
                  open={showApplyModal && Boolean(pendingLeadId)}
                  mobile={mobile.replace(/\D/g, "")}
                  otpSendPromise={otpSendPromise}
                  onClose={() => {
                    setShowApplyModal(false);
                    setPendingLeadId("");
                    setOtpSendPromise(null);
                  }}
                  onEditMobile={() => {
                    setShowApplyModal(false);
                    setPendingLeadId("");
                    setOtpSendPromise(null);
                  }}
                  syncServerVerify={false}
                  onSuccess={async (result) => {
                    const applyRes = await applyPromiseRef.current;
                    if (!applyRes?.success) {
                      throw new Error(applyRes?.message || "Could not submit application.");
                    }
                    const login = await customerLogin(result.mobile, result.idToken);
                    if (!login.ok) {
                      throw new Error(login.message || "Login failed");
                    }
                    stashApplyThanks({
                      name: fullName.trim(),
                      product: selectedLoanTitle.trim() || "application",
                    });
                    router.replace("/customer/dashboard");
                  }}
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit(e.currentTarget);
                  }}
                  className="mt-3 flex flex-1 flex-col gap-3 min-h-0 sm:gap-4"
                >
                  {formError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 break-words">
                      {formError}
                    </div>
                  )}

                  {showInsuranceType && (
                    <div className="relative">
                      <label htmlFor="service-ins-type" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                        Insurance type <span className="text-red-500">*</span>
                      </label>
                      <InsuranceTypeSelect
                        id="service-ins-type"
                        value={insType}
                        onChange={setInsType}
                        options={insuranceTypeOptions}
                      />
                      <input
                        value={insType}
                        required
                        onChange={() => undefined}
                        tabIndex={-1}
                        aria-label="Insurance type"
                        ref={(node) => {
                          node?.setCustomValidity(
                            insType.trim() ? "" : "Please select insurance type",
                          );
                        }}
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-0"
                      />
                    </div>
                  )}

                  {loanTabs && (
                    <div>
                      <label htmlFor="service-loan-type" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                        Select your loan type <span className="text-red-500">*</span>
                      </label>
                      <InsuranceTypeSelect
                        id="service-loan-type"
                        value={loanSlug}
                        onChange={setLoanSlug}
                        options={loanProducts.map((item) => ({
                          value: item.slug,
                          label: item.title,
                          image: loanTypeGif(item.slug),
                        }))}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label htmlFor="service-fullname" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="service-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(sanitizeLeadNameInput(e.target.value))}
                        placeholder="Full Name (As per PAN)"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="service-pan" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                        PAN Card number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="service-pan"
                        type="text"
                        value={pan}
                        onChange={(e) => setPan(sanitizeLeadPanInput(e.target.value))}
                        maxLength={10}
                        placeholder="e.g. ABCDE1234F"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className={mobileShellClass}>
                        <span className="flex shrink-0 items-center pl-3" aria-hidden>
                          <IndiaFlag />
                        </span>
                        <span className="px-2 text-base font-semibold text-midnight_text dark:text-white">
                          +91
                        </span>
                        <span className="h-6 w-px shrink-0 bg-gray-300 dark:bg-dark_border" aria-hidden />
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                          placeholder="10-digit mobile"
                          value={mobile}
                          onChange={(e) => setMobile(sanitizeMobileInput(e.target.value))}
                          pattern="[0-9]*"
                          className={mobileInputClass}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="service-pincode"
                        className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                      >
                        Current Residence Pincode <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2" aria-hidden>
                          <svg viewBox="0 0 24 24" className="h-5 w-5">
                            <defs>
                              <linearGradient id="pincode-pin-gradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#4236FB" />
                                <stop offset="100%" stopColor="#FF7E29" />
                              </linearGradient>
                            </defs>
                            <path
                              fill="url(#pincode-pin-gradient)"
                              d="M12 2.2c-4.1 0-7.4 3.2-7.4 7.3 0 5.1 7.4 12.3 7.4 12.3s7.4-7.2 7.4-12.3c0-4.1-3.3-7.3-7.4-7.3z"
                            />
                            <circle cx="12" cy="9.4" r="2.5" fill="#fff" />
                          </svg>
                        </span>
                        <input
                          id="service-pincode"
                          type="text"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          maxLength={6}
                          placeholder="e.g. 302002"
                          value={pincode}
                          onChange={(e) => setPincode(sanitizeLeadPincodeInput(e.target.value))}
                          pattern="[0-9]*"
                          className={`${inputClass} !pl-10`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {showLoanAmount && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <LoanAmountSlider
                        id="service-loan-amount"
                        value={loanAmount}
                        onChange={setLoanAmount}
                        min={loanBounds?.min}
                        max={loanBounds?.max}
                        placeholder={
                          loanBounds
                            ? `₹${loanBounds.min.toLocaleString("en-IN")} – ₹${loanBounds.max.toLocaleString("en-IN")}`
                            : ""
                        }
                        error={loanAmountError}
                        required
                      />
                      <EmploymentIncomeFields
                        idPrefix="service"
                        netMonthlyIncome={netMonthlyIncome}
                        onIncomeChange={setNetMonthlyIncome}
                        inputClassName={inputClass}
                        labelClassName="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                        incomeWithRupee
                      />
                    </div>
                  )}

                  <TermsAgreementCheckbox
                    id="service-terms"
                    variant="lead"
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    textClassName="text-xs leading-snug text-gray-600 dark:text-gray-400 sm:text-sm"
                  />

                  <div className={showLoanAmount ? "w-full" : "mt-auto w-full pt-2 sm:pt-3"}>
                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className={`inline-flex w-full items-center justify-center gap-2 btn-gradient px-4 text-sm font-semibold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-70 sm:text-base ${loanTabs ? "min-h-12 rounded-full py-3" : "min-h-[44px] rounded-xl py-2.5 sm:rounded-2xl sm:py-3"}`}
                    >
                      {isSubmittingForm ? "Submitting…" : loanTabs ? "Check Eligibility" : "Apply Now"}
                      {!isSubmittingForm && loanTabs ? (
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                          <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </button>
                    <LeadCreditDisclaimer className="mt-2 text-xs" />
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 order-2 lg:order-2 w-full items-center justify-center lg:col-span-5" data-aos="fade-left">
            <Image
              src={`${imageSrc}${imageSrc.includes("?") ? "&" : "?"}v=2`}
              alt={title}
              width={640}
              height={480}
              className="block h-auto w-full max-w-[560px] object-contain lg:max-w-none"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
