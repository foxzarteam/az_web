"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import { MOBILE_VALIDATION, PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";
import { reportFormValidity } from "@/app/utils/formValidation";
import { applyLead, leadIdFromResponse } from "@/app/utils/leadApi";
import { updateChatSession } from "@/app/utils/chatApi";
import {
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  validateLeadPanNameMobile,
  type LeadFieldErrors,
} from "@/app/utils/leadForm";
import { sanitizeMobileInput } from "@/app/utils/validation";

const DEFAULT_LOAN_AMOUNT = 5_00_000;
const SUCCESS_MESSAGE =
  "Your Personal Loan application has been received. We'll contact you shortly.";

const inputClass =
  "w-full px-3.5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode/80 text-sm sm:text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70";

type PersonalLoanApplyModalProps = {
  open: boolean;
  onClose: () => void;
  /** Prefill mobile (e.g. from chatbox after OTP). */
  initialMobile?: string;
  /** When true, mobile field is read-only. */
  lockMobile?: boolean;
  /** OTP already verified — submit lead only, skip OTP modal. */
  skipOtp?: boolean;
  /** Chat session to mark lead_submitted after apply. */
  chatId?: string;
  /** Prefill loan slider (from chat answers). */
  initialLoanAmount?: number;
};

export default function PersonalLoanApplyModal({
  open,
  onClose,
  initialMobile = "",
  lockMobile = false,
  skipOtp = false,
  chatId,
  initialLoanAmount,
}: PersonalLoanApplyModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingLeadId, setPendingLeadId] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loanAmount, setLoanAmount] = useState(DEFAULT_LOAN_AMOUNT);
  const [pan, setPan] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;
    const digits = initialMobile.replace(/\D/g, "").slice(0, 10);
    if (digits) setMobile(digits);
    if (
      typeof initialLoanAmount === "number" &&
      Number.isFinite(initialLoanAmount) &&
      initialLoanAmount >= PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT
    ) {
      setLoanAmount(
        Math.min(PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT, Math.round(initialLoanAmount)),
      );
    }
  }, [open, initialMobile, initialLoanAmount]);

  const resetForm = useCallback(() => {
    setFullName("");
    setMobile(lockMobile ? initialMobile.replace(/\D/g, "").slice(0, 10) : "");
    setLoanAmount(
      typeof initialLoanAmount === "number" && Number.isFinite(initialLoanAmount)
        ? Math.min(
            PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT,
            Math.max(PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT, Math.round(initialLoanAmount)),
          )
        : DEFAULT_LOAN_AMOUNT,
    );
    setPan("");
    setTermsAccepted(false);
    setFormError("");
    setPendingLeadId("");
  }, [initialLoanAmount, initialMobile, lockMobile]);

  const handleClose = useCallback(() => {
    if (showOtpModal || isSubmittingForm) return;
    resetForm();
    onClose();
  }, [onClose, resetForm, showOtpModal, isSubmittingForm]);

  useEffect(() => {
    if (!open || showOtpModal) return;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "0";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open, showOtpModal]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showOtpModal && !isSubmittingForm) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, showOtpModal, isSubmittingForm, handleClose]);

  const handleSubmit = async (form: HTMLFormElement) => {
    if (!reportFormValidity(form) || isSubmittingForm) return;

    const errors: LeadFieldErrors = validateLeadPanNameMobile({
      pan,
      mobileDigits: mobile.replace(/\D/g, ""),
      fullName,
    });
    if (
      loanAmount < PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT ||
      loanAmount > PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT
    ) {
      errors.loanAmt = `Loan amount must be between ₹${PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT.toLocaleString("en-IN")} and ₹${PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT.toLocaleString("en-IN")}`;
    }

    const firstError = Object.values(errors)[0];
    if (firstError) {
      setFormError(firstError);
      return;
    }

    setFormError("");
    setIsSubmittingForm(true);

    try {
      const applyRes = await applyLead({
        pan: pan.trim().toUpperCase(),
        mobileNumber: mobile.replace(/\D/g, ""),
        fullName: fullName.trim(),
        category: "personal_loan",
        requiredAmount: loanAmount,
      });

      if (!applyRes.success) {
        setFormError(applyRes.message || "Could not submit application.");
        return;
      }

      const leadId = leadIdFromResponse(applyRes.data);
      if (!leadId) {
        setFormError("Could not submit application. Please try again.");
        return;
      }

      if (chatId) {
        void updateChatSession(chatId, { status: "lead_submitted", leadId });
      }

      if (skipOtp) {
        resetForm();
        onClose();
        setShowSuccess(true);
        return;
      }

      setPendingLeadId(leadId);
      setShowOtpModal(true);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if ((!open && !showSuccess && !showOtpModal) || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      {open && !showOtpModal && (
        <div
          className="fixed inset-0 z-[99990] flex items-center justify-center overflow-hidden p-3 sm:p-5 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="personal-loan-apply-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-darklight"
            style={{
              width: "min(100%, 36rem)",
              maxHeight: "min(100dvh - 1.5rem, 100%)",
              height: "auto",
            }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5 dark:border-dark_border">
              <h2
                id="personal-loan-apply-title"
                className="text-lg font-bold text-midnight_text dark:text-white sm:text-xl"
              >
                Apply for Personal Loan
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-2 -m-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit(e.currentTarget);
              }}
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 sm:px-6 sm:py-5"
            >
              {formError && (
                <div className="shrink-0 rounded-lg border border-red-200 bg-red-50 p-2.5 text-sm text-red-600 break-words">
                  {formError}
                </div>
              )}

              <div className="min-h-0 shrink">
                <LoanAmountSlider value={loanAmount} onChange={setLoanAmount} />
              </div>

              <div className="shrink-0">
                <label htmlFor="hero-pl-fullname" className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  id="hero-pl-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(sanitizeLeadNameInput(e.target.value))}
                  placeholder="Full Name (As per PAN)"
                  className={inputClass}
                />
              </div>

              <div className="shrink-0">
                <label className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Mobile Number *
                </label>
                <div
                  className={`flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-dark_border dark:bg-darkmode/80 sm:rounded-xl ${
                    lockMobile ? "opacity-90" : ""
                  }`}
                >
                  <span className="flex shrink-0 items-center pl-2.5 sm:pl-3" aria-hidden>
                    <IndiaFlag />
                  </span>
                  <span className="pl-1.5 pr-2 text-sm font-medium text-midnight_text dark:text-white sm:pl-2 sm:pr-3">+91</span>
                  <span className="h-5 w-px bg-gray-300 dark:bg-dark_border sm:h-6" aria-hidden />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                    placeholder="Mobile Number"
                    value={mobile}
                    readOnly={lockMobile}
                    disabled={lockMobile}
                    onChange={(e) => {
                      if (lockMobile) return;
                      setMobile(sanitizeMobileInput(e.target.value));
                    }}
                    pattern="[0-9]*"
                    className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 text-sm text-midnight_text placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 dark:text-white dark:disabled:bg-darkmode/60 sm:px-3 sm:py-3 sm:text-base"
                  />
                </div>
                {lockMobile ? (
                  <p className="mt-1 text-xs text-gray">Verified mobile number</p>
                ) : null}
              </div>

              <div className="shrink-0">
                <label htmlFor="hero-pl-pan" className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  PAN Card number *
                </label>
                <input
                  id="hero-pl-pan"
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(sanitizeLeadPanInput(e.target.value))}
                  maxLength={10}
                  placeholder="e.g. ABCDE1234F"
                  className={inputClass}
                />
              </div>

              <div className="shrink-0">
                <TermsAgreementCheckbox
                  id="hero-pl-terms"
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingForm}
                className="btn-gradient mt-auto inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-2xl sm:py-3 sm:text-base"
              >
                {isSubmittingForm ? "Submitting…" : "Apply Now"}
              </button>
            </form>
          </div>
        </div>
      )}

      {!skipOtp && (
        <LeadApplyModal
          open={showOtpModal && Boolean(pendingLeadId)}
          leadId={pendingLeadId}
          mobile={mobile.replace(/\D/g, "")}
          onClose={() => setShowOtpModal(false)}
          onEditMobile={() => setShowOtpModal(false)}
          onSuccess={() => {
            resetForm();
            setShowOtpModal(false);
            onClose();
            setShowSuccess(true);
          }}
        />
      )}

      {showSuccess && (
        <SuccessPopup
          message={SUCCESS_MESSAGE}
          onClose={() => setShowSuccess(false)}
          autoCloseMs={3000}
        />
      )}
    </>,
    document.body,
  );
}
