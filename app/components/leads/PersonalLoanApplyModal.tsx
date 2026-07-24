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
};

export default function PersonalLoanApplyModal({ open, onClose }: PersonalLoanApplyModalProps) {
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

  const resetForm = useCallback(() => {
    setFullName("");
    setMobile("");
    setLoanAmount(DEFAULT_LOAN_AMOUNT);
    setPan("");
    setTermsAccepted(false);
    setFormError("");
    setPendingLeadId("");
  }, []);

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
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.position = "";
      document.body.style.top = "";
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
          className="fixed inset-0 z-[99990] flex items-center justify-center px-3 sm:px-6 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="personal-loan-apply-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="bg-white dark:bg-darklight w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] min-h-[min(640px,90vh)] overflow-y-auto">
            <div className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-7 pb-4 border-b border-gray-100 dark:border-dark_border">
              <h2
                id="personal-loan-apply-title"
                className="text-xl sm:text-2xl font-bold text-midnight_text dark:text-white"
              >
                Apply for Personal Loan
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 -m-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
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
              className="px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6"
            >
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 break-words">
                  {formError}
                </div>
              )}

              <LoanAmountSlider value={loanAmount} onChange={setLoanAmount} />

              <div>
                <label htmlFor="hero-pl-fullname" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
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

              <div>
                <label htmlFor="hero-pl-pan" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
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

              <TermsAgreementCheckbox
                id="hero-pl-terms"
                checked={termsAccepted}
                onChange={setTermsAccepted}
              />

              <button
                type="submit"
                disabled={isSubmittingForm}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl btn-gradient text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 transition-opacity shadow-md min-h-[44px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmittingForm ? "Submitting…" : "Apply Now"}
              </button>
            </form>
          </div>
        </div>
      )}

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
