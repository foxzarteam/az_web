"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ConfirmationResult } from "firebase/auth";
import {
  completeLead,
  leadIdFromResponse,
  mapServiceToCategory,
  startLead,
  type CreateLeadRequest,
} from "@/app/utils/leadApi";
import {
  INSURANCE_TYPE_OPTIONS,
  LOAN_AMOUNT_OPTIONS,
  sanitizeLeadAadhaarInput,
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  validateLeadApplicantDetails,
} from "@/app/utils/leadForm";
import {
  getFirebaseOtpSendErrorMessage,
  RECAPTCHA_CONTAINER_ID,
  resetRecaptcha,
  sendFirebasePhoneOtp,
  verifyPhoneOtp,
} from "@/app/lib/firebase/phoneAuth";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

type LeadApplyModalProps = {
  open: boolean;
  mobile: string;
  category: CreateLeadRequest["category"];
  serviceOptions: { value: string; label: string }[];
  defaultService?: string;
  onClose: () => void;
  onSuccess: () => void;
  onEditMobile?: () => void;
};

type Step = "otp" | "details";

function Stepper({ step }: { step: Step }) {
  const steps = [
    { key: "otp" as const, label: "Mobile Verify" },
    { key: "details" as const, label: "Applicant Details" },
  ];
  const activeIdx = step === "otp" ? 0 : 1;

  return (
    <div className="flex items-center justify-center gap-0 mb-6 px-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className="flex flex-col items-center min-w-[68px] xs:min-w-[76px] sm:min-w-[88px]">
            <div
              className={`h-3 w-3 rounded-full border-2 ${
                i <= activeIdx
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            />
            <span
              className={`mt-1.5 text-[11px] sm:text-xs text-center leading-tight ${
                i <= activeIdx ? "text-primary font-medium" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-8 xs:w-10 sm:w-16 mb-5 ${
                i < activeIdx ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function LeadApplyModal({
  open,
  mobile,
  category,
  serviceOptions,
  defaultService = "",
  onClose,
  onSuccess,
  onEditMobile,
}: LeadApplyModalProps) {
  const [step, setStep] = useState<Step>("otp");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [fullName, setFullName] = useState("");
  const [service, setService] = useState(defaultService);
  const [loanAmt, setLoanAmt] = useState("");
  const [insType, setInsType] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [firebaseConfirmation, setFirebaseConfirmation] =
    useState<ConfirmationResult | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const mobileDigits = mobile.replace(/\D/g, "");
  const selectedCategory = mapServiceToCategory(service);
  const showLoanAmount = selectedCategory === "personal_loan";
  const showInsuranceType = selectedCategory === "insurance";

  const resetState = useCallback(() => {
    setStep("otp");
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setFullName("");
    setService(defaultService);
    setLoanAmt("");
    setInsType("");
    setPan("");
    setAadhaar("");
    setError("");
    setResendCooldown(0);
    setFirebaseConfirmation(null);
    resetRecaptcha(RECAPTCHA_CONTAINER_ID);
  }, [defaultService]);

  const sendOtp = useCallback(async () => {
    if (mobileDigits.length !== 10) return;
    setIsSendingOtp(true);
    setError("");

    try {
      const confirmation = await sendFirebasePhoneOtp(mobileDigits);
      setFirebaseConfirmation(confirmation);
      setResendCooldown(RESEND_COOLDOWN_SEC);
    } catch (err) {
      setError(getFirebaseOtpSendErrorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  }, [mobileDigits]);

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }
    setService(defaultService);
    void sendOtp();
  }, [open, defaultService, resetState, sendOtp]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "0";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every((d) => d.length === 1)) {
      void verifyOtp(next.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otp: string) => {
    if (otp.length !== OTP_LENGTH || isVerifyingOtp || !firebaseConfirmation) return;
    setIsVerifyingOtp(true);
    setError("");

    const res = await verifyPhoneOtp(firebaseConfirmation, otp, mobileDigits);
    if (!res.success) {
      setError(res.message || "Invalid OTP. Please try again.");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } else {
      setStep("details");
    }
    setIsVerifyingOtp(false);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadApplicantDetails({
      pan,
      mobileDigits,
      fullName,
      aadhaar,
      service,
      loanAmt,
      insType,
    });
    const keys = Object.keys(validation);
    if (keys.length > 0) {
      setError(Object.values(validation)[0] || "Please check your details.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const startRes = await startLead(mobileDigits, category);
      if (!startRes.success) {
        setError(startRes.message || "Could not save mobile number.");
        return;
      }
      const leadId = leadIdFromResponse(startRes.data);
      if (!leadId) {
        setError("Could not save your application. Please try again.");
        return;
      }

      const completeRes = await completeLead(leadId, {
        pan: pan.trim().toUpperCase(),
        fullName: fullName.trim(),
        category: selectedCategory,
        aadhaar: aadhaar.trim(),
        ...(showLoanAmount && loanAmt ? { loanAmt } : {}),
        ...(showInsuranceType && insType ? { insType } : {}),
      });

      if (!completeRes.success) {
        setError(completeRes.message || "Failed to submit details.");
        return;
      }

      onSuccess();
      onClose();
      resetState();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id={RECAPTCHA_CONTAINER_ID}
        className="fixed left-0 top-0 h-px w-px overflow-hidden opacity-0 pointer-events-none"
        aria-hidden
      />
      <div className="bg-white dark:bg-darklight w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden min-h-[min(560px,88vh)] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-3 border-b border-gray-100 dark:border-dark_border">
          <h2 className="text-lg sm:text-xl font-bold text-midnight_text dark:text-white">
            {step === "otp" ? "Verify OTP" : "Applicant Details"}
          </h2>
          <button
            type="button"
            onClick={() => {
              onClose();
              resetState();
            }}
            className="p-2 -m-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8">
          <Stepper step={step} />

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 break-words">
              {error}
            </div>
          )}
          {step === "otp" ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                We have sent a {OTP_LENGTH} digit verification code to{" "}
                <span className="font-semibold text-midnight_text dark:text-white">
                  {mobileDigits}
                </span>
                {onEditMobile && (
                  <button
                    type="button"
                    onClick={onEditMobile}
                    className="ml-1 inline-flex text-primary hover:underline"
                    aria-label="Edit mobile number"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                )}
              </p>

              <div className="flex justify-center gap-2 sm:gap-3 my-6">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={isVerifyingOtp || isSendingOtp}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-10 h-11 sm:w-12 sm:h-12 text-center text-lg font-semibold rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-midnight_text"
                  />
                ))}
              </div>

              {(isSendingOtp || isVerifyingOtp) && (
                <p className="text-center text-sm text-gray-500 mb-3">Please wait…</p>
              )}

              <div className="text-center">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isSendingOtp}
                  onClick={() => void sendOtp()}
                  className="text-sm font-semibold text-primary disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
                >
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
              <div>
                <label htmlFor="lead-fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  id="lead-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(sanitizeLeadNameInput(e.target.value))}
                  placeholder="Full Name (As per PAN)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80"
                />
              </div>
              <div>
                <label htmlFor="lead-service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select product *
                </label>
                <select
                  id="lead-service"
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    setLoanAmt("");
                    setInsType("");
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80"
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
                  <label htmlFor="lead-loan-amt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Loan amount range *
                  </label>
                  <select
                    id="lead-loan-amt"
                    value={loanAmt}
                    onChange={(e) => setLoanAmt(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80"
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
                  <label htmlFor="lead-ins-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Insurance type *
                  </label>
                  <select
                    id="lead-ins-type"
                    value={insType}
                    onChange={(e) => setInsType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80"
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
              <div>
                <label htmlFor="lead-pan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  PAN Card number *
                </label>
                <input
                  id="lead-pan"
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(sanitizeLeadPanInput(e.target.value))}
                  maxLength={10}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80"
                />
              </div>
              <div>
                <label htmlFor="lead-aadhaar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aadhaar number *
                </label>
                <input
                  id="lead-aadhaar"
                  type="text"
                  inputMode="numeric"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(sanitizeLeadAadhaarInput(e.target.value))}
                  maxLength={12}
                  placeholder="12-digit Aadhaar number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl btn-gradient text-white font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Submitting…" : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
