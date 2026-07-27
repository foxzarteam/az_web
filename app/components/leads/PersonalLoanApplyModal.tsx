"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import CheckApplicationStatusLink from "@/app/components/leads/CheckApplicationStatusLink";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import { MOBILE_VALIDATION, PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";
import { getCurrentFirebaseIdToken, warmFirebaseAuth } from "@/app/lib/firebase/phoneAuth";
import { reportFormValidity } from "@/app/utils/formValidation";
import { customerLogin } from "@/app/utils/customerAuthApi";
import { applyLead, completeLead, leadIdFromResponse } from "@/app/utils/leadApi";
import { updateChatSession } from "@/app/utils/chatApi";
import {
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  validateLeadPanNameMobile,
  type LeadFieldErrors,
} from "@/app/utils/leadForm";
import { sanitizeMobileInput } from "@/app/utils/validation";
import { blurActiveElement, useBodyScrollLock } from "@/app/utils/useBodyScrollLock";

const DEFAULT_LOAN_AMOUNT = 5_00_000;
const SUCCESS_FALLBACK =
  "Your application was submitted. Use “Check your application status” below the form with your mobile number to open your dashboard.";

async function loginAndGoToDashboard(
  mobile: string,
  idToken: string,
  go: (href: string) => void,
): Promise<boolean> {
  const res = await customerLogin(mobile, idToken);
  if (!res.ok) return false;
  go("/customer/dashboard");
  return true;
}

const inputClass =
  "w-full min-h-10 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-midnight_text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70 sm:min-h-11 sm:px-3.5 sm:py-2.5 sm:text-base dark:border-dark_border dark:bg-darkmode/80 dark:text-white";

const mobileShellClass =
  "flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white sm:min-h-11 dark:border-dark_border dark:bg-darkmode/80";

const mobileInputClass =
  "min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-midnight_text placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 sm:min-h-11 sm:py-2.5 sm:text-base dark:text-white dark:disabled:bg-darkmode/60";

type PersonalLoanApplyModalProps = {
  open: boolean;
  onClose: () => void;
  /** Prefill mobile (e.g. from chatbox after OTP). */
  initialMobile?: string;
  /** When true, mobile field is read-only. */
  lockMobile?: boolean;
  /** OTP already verified — submit lead only, skip OTP modal. */
  skipOtp?: boolean;
  /** Existing draft/pending lead id (chat: created after OTP via /leads/start). */
  leadId?: string;
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
  leadId: existingLeadId,
  chatId,
  initialLoanAmount,
}: PersonalLoanApplyModalProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingLeadId, setPendingLeadId] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isOpeningDashboard, setIsOpeningDashboard] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loanAmount, setLoanAmount] = useState(DEFAULT_LOAN_AMOUNT);
  const [pan, setPan] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!formError) return;
    const t = window.setTimeout(() => setFormError(""), 3000);
    return () => window.clearTimeout(t);
  }, [formError]);

  useEffect(() => {
    if (!open) return;
    warmFirebaseAuth();
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
    if (showOtpModal || isSubmittingForm || isOpeningDashboard) return;
    blurActiveElement();
    resetForm();
    onClose();
  }, [onClose, resetForm, showOtpModal, isSubmittingForm, isOpeningDashboard]);

  // Keep page scroll frozen while modal is open (including OTP step).
  // overflow:hidden only — no position:fixed — so close does not jump the page.
  useBodyScrollLock(open || isOpeningDashboard);

  const previousFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    return () => {
      const el = previousFocusRef.current;
      if (el && typeof el.focus === "function") {
        try {
          el.focus({ preventScroll: true });
        } catch {
          /* ignore */
        }
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !showOtpModal &&
        !isSubmittingForm &&
        !isOpeningDashboard
      ) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, showOtpModal, isSubmittingForm, isOpeningDashboard, handleClose]);

  const handleSubmit = async (form: HTMLFormElement) => {
    if (!reportFormValidity(form) || isSubmittingForm || isOpeningDashboard) return;

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
      const mobileDigits = mobile.replace(/\D/g, "");
      let applyRes;
      if (skipOtp && existingLeadId) {
        const idToken = await getCurrentFirebaseIdToken();
        applyRes = await completeLead(
          existingLeadId,
          {
            pan: pan.trim().toUpperCase(),
            fullName: fullName.trim(),
            category: "personal_loan",
            requiredAmount: loanAmount,
          },
          idToken,
        );
      } else {
        applyRes = await applyLead({
          pan: pan.trim().toUpperCase(),
          mobileNumber: mobileDigits,
          fullName: fullName.trim(),
          category: "personal_loan",
          requiredAmount: loanAmount,
        });
      }

      if (!applyRes.success) {
        setFormError(applyRes.message || "Could not submit application.");
        return;
      }

      const leadId = leadIdFromResponse(applyRes.data) || existingLeadId || "";
      if (!leadId) {
        setFormError("Could not submit application. Please try again.");
        return;
      }

      if (chatId) {
        void updateChatSession(chatId, { status: "lead_submitted", leadId });
      }

      if (skipOtp) {
        // Keep form modal open with loader until dashboard opens (no blank gap).
        setIsOpeningDashboard(true);
        const idToken = await getCurrentFirebaseIdToken();
        if (
          idToken &&
          (await loginAndGoToDashboard(mobileDigits, idToken, (href) => {
            router.replace(href);
            router.refresh();
          }))
        ) {
          return;
        }
        setIsOpeningDashboard(false);
        setShowSuccess(true);
        return;
      }

      setPendingLeadId(leadId);
      setShowOtpModal(true);
    } catch {
      setFormError("Network error. Please try again.");
      setIsOpeningDashboard(false);
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
          className="fixed inset-0 z-[99990] flex items-center justify-center overflow-hidden p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="personal-loan-apply-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-darklight"
            style={{
              width: "min(100%, 36rem)",
              maxHeight: "calc(100dvh - 1rem)",
            }}
          >
            {isOpeningDashboard && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 px-6 text-center dark:bg-darklight/95">
                <div className="mb-3 h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm font-semibold text-midnight_text dark:text-white">
                  Opening your dashboard…
                </p>
                <p className="mt-1 text-xs text-gray-500">Please wait</p>
              </div>
            )}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-3.5 py-2 sm:px-6 sm:py-3.5 dark:border-dark_border [@media(max-height:700px)]:py-1.5">
              <h2
                id="personal-loan-apply-title"
                className="text-base font-bold text-midnight_text dark:text-white sm:text-lg"
              >
                Apply for Personal Loan
              </h2>
              <button
                type="button"
                disabled={isSubmittingForm || isOpeningDashboard}
                onClick={handleClose}
                className="rounded-lg p-2 -m-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40"
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
              className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3.5 py-2.5 sm:gap-3 sm:px-6 sm:py-4 [@media(max-height:700px)]:gap-1.5 [@media(max-height:700px)]:py-2"
            >
              {formError && (
                <div className="shrink-0 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600 break-words sm:text-sm">
                  {formError}
                </div>
              )}

              <div className="shrink-0">
                <LoanAmountSlider value={loanAmount} onChange={setLoanAmount} />
              </div>

              <div className="shrink-0">
                <label htmlFor="hero-pl-fullname" className="mb-0.5 block text-xs font-medium text-midnight_text dark:text-gray-300 sm:mb-1 sm:text-sm">
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
                <label className="mb-0.5 block text-xs font-medium text-midnight_text dark:text-gray-300 sm:mb-1 sm:text-sm">
                  Mobile Number *
                </label>
                <div
                  className={`${mobileShellClass} ${lockMobile ? "opacity-90" : ""}`}
                >
                  <span className="flex shrink-0 items-center pl-3" aria-hidden>
                    <IndiaFlag />
                  </span>
                  <span className="px-2 text-sm font-semibold text-midnight_text sm:text-base dark:text-white">
                    +91
                  </span>
                  <span className="h-5 w-px shrink-0 bg-gray-300 sm:h-6 dark:bg-dark_border" aria-hidden />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                    placeholder="10-digit mobile"
                    value={mobile}
                    readOnly={lockMobile}
                    disabled={lockMobile}
                    onChange={(e) => {
                      if (lockMobile) return;
                      setMobile(sanitizeMobileInput(e.target.value));
                    }}
                    pattern="[0-9]*"
                    className={mobileInputClass}
                  />
                </div>
                {lockMobile ? (
                  <p className="mt-0.5 text-[11px] text-gray">Verified mobile number</p>
                ) : null}
              </div>

              <div className="shrink-0">
                <label htmlFor="hero-pl-pan" className="mb-0.5 block text-xs font-medium text-midnight_text dark:text-gray-300 sm:mb-1 sm:text-sm">
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
                  textClassName="text-[11px] leading-snug text-gray-600 dark:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingForm}
                className="btn-gradient mt-0.5 inline-flex min-h-[40px] w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[44px] sm:rounded-2xl sm:py-2.5 sm:text-base"
              >
                {isSubmittingForm ? "Submitting…" : "Apply Now"}
              </button>

              <CheckApplicationStatusLink className="mt-1 shrink-0" onNavigate={handleClose} />
            </form>
          </div>
        </div>
      )}

      {!skipOtp && (
        <LeadApplyModal
          open={showOtpModal && Boolean(pendingLeadId)}
          leadId={pendingLeadId}
          mobile={mobile.replace(/\D/g, "")}
          onClose={() => {
            if (isOpeningDashboard) return;
            setShowOtpModal(false);
          }}
          onEditMobile={() => setShowOtpModal(false)}
          syncServerVerify={false}
          onSuccess={async (result) => {
            const ok = await loginAndGoToDashboard(result.mobile, result.idToken, (href) => {
              router.replace(href);
              router.refresh();
            });
            if (!ok) {
              throw new Error("Login failed");
            }
          }}
        />
      )}

      {showSuccess && (
        <SuccessPopup
          message={SUCCESS_FALLBACK}
          onClose={() => setShowSuccess(false)}
          footer={<CheckApplicationStatusLink />}
        />
      )}
    </>,
    document.body,
  );
}
