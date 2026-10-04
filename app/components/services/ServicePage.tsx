"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ConfirmationResult } from "firebase/auth";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox, {
  LeadCreditDisclaimer,
} from "@/app/components/shared/TermsAgreementCheckbox";
import { reportFormValidity } from "@/app/utils/formValidation";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import CheckApplicationStatusLink from "@/app/components/leads/CheckApplicationStatusLink";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import LoanTenureSlider from "@/app/components/services/LoanTenureSlider";
import EmploymentIncomeFields from "@/app/components/leads/EmploymentIncomeFields";
import { MOBILE_VALIDATION, PERSONAL_LOAN_TENURE } from "@/app/config/constants";
import { customerLogin } from "@/app/utils/customerAuthApi";
import { applyLead, isExistingApplicationError, leadIdFromResponse, mapServiceToCategory, type CreateLeadResponse } from "@/app/utils/leadApi";
import {
  firstLeadFieldError,
  personalLoanApplyPayload,
  validatePersonalLoanApplyForm,
} from "@/app/lib/leads/personalLoanApply";
import { useInsuranceTypeOptions } from "@/app/lib/services/useInsuranceTypeOptions";
import InsuranceTypeSelect from "@/app/components/leads/InsuranceTypeSelect";
import {
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  sanitizeLeadPincodeInput,
  validateLeadPanNameMobile,
  validateLeadPincode,
  type LeadFieldErrors,
} from "@/app/utils/leadForm";
import { sanitizeMobileInput } from "@/app/utils/validation";
import { sendFirebasePhoneOtp, warmFirebaseAuth } from "@/app/lib/firebase/phoneAuth";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
  serviceSlug?: string;
};

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

const DEFAULT_LOAN_AMOUNT = 5_00_000;

const inputClass =
  "w-full min-h-10 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode/80 text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70";

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
}: ServicePageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageServiceSlug = useMemo(
    () => (serviceSlugProp?.trim() || slugFromPathname(pathname) || "").trim(),
    [serviceSlugProp, pathname],
  );

  const [showSuccess, setShowSuccess] = useState(false);
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
  const [loanAmount, setLoanAmount] = useState(DEFAULT_LOAN_AMOUNT);
  const [loanTenure, setLoanTenure] = useState<number>(PERSONAL_LOAN_TENURE.DEFAULT_MONTHS);
  const [insType, setInsType] = useState("");
  const [netMonthlyIncome, setNetMonthlyIncome] = useState("");
  const [pan, setPan] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!formError) return;
    const t = window.setTimeout(() => setFormError(""), 3000);
    return () => window.clearTimeout(t);
  }, [formError]);

  const service = pageServiceSlug;
  const selectedCategory = mapServiceToCategory(service);
  const showLoanAmount = selectedCategory === "personal_loan";
  const showInsuranceType = selectedCategory === "insurance";
  const insuranceTypeOptions = useInsuranceTypeOptions();

  useEffect(() => {
    setInsType("");
    setNetMonthlyIncome("");
    setLoanAmount(DEFAULT_LOAN_AMOUNT);
  }, [pageServiceSlug]);

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
    if (showLoanAmount) {
      Object.assign(
        errors,
        validatePersonalLoanApplyForm({
          pan,
          mobile,
          fullName,
          pincode,
          loanAmount,
          loanTenureMonths: loanTenure,
          netMonthlyIncome,
        }),
      );
    }
    if (showInsuranceType && !insType.trim()) errors.insType = "Please select insurance type";

    const firstError = firstLeadFieldError(errors);
    if (firstError) {
      setFormError(firstError);
      return;
    }

    setFormError("");
    setIsSubmittingForm(true);

    try {
      const category = mapServiceToCategory(service);
      const pin = pincode.replace(/\D/g, "");
      const digits = mobile.replace(/\D/g, "");
      const pl =
        category === "personal_loan"
          ? personalLoanApplyPayload({
              pan,
              mobile,
              fullName,
              pincode,
              loanAmount,
              loanTenureMonths: loanTenure,
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
              loanTenureMonths: pl.loanTenureMonths,
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
            res.message || "Your application is already Under Review.",
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
      className="scroll-mt-24 bg-gradient-to-b from-light to-white pb-0 pt-8 dark:from-darkmode dark:to-semidark"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md max-w-full">
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

            <div className="theme-gradient-bg p-[1px] rounded-2xl sm:rounded-3xl shadow-xl w-full min-w-0 flex flex-col">
              <div className="bg-white dark:bg-darklight rounded-2xl sm:rounded-3xl py-4 sm:py-6 lg:py-7 px-4 sm:px-6 md:px-7 flex flex-1 flex-col min-h-0 min-w-0">
                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-midnight_text dark:text-white">
                    Apply for {title}
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

                {showSuccess && (
                  <SuccessPopup
                    message={getSuccessMessage(title)}
                    onClose={() => setShowSuccess(false)}
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
                  syncServerVerify
                  onSuccess={async (result) => {
                    const applyRes = await applyPromiseRef.current;
                    if (!applyRes?.success) {
                      throw new Error(applyRes?.message || "Could not submit application.");
                    }
                    const login = await customerLogin(result.mobile, result.idToken);
                    if (!login.ok) {
                      throw new Error(login.message || "Login failed");
                    }
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
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  {showLoanAmount && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <LoanAmountSlider
                        id="service-loan-amount"
                        value={loanAmount}
                        onChange={setLoanAmount}
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

                  {showLoanAmount && (
                    <LoanTenureSlider
                      value={loanTenure}
                      onChange={setLoanTenure}
                      label="Select Loan Tenure"
                    />
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
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl btn-gradient text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 transition-opacity shadow-md min-h-[44px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmittingForm ? "Submitting…" : "Apply Now"}
                    </button>
                    <LeadCreditDisclaimer className="mt-2" />
                    <CheckApplicationStatusLink className="mt-3" />
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
