"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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
  EMPLOYMENT_TYPE_OPTIONS,
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
  "w-full min-h-11 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80 dark:text-white";

const mobileShellClass =
  "flex min-h-11 items-center overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-dark_border dark:bg-darkmode/80";

const mobileInputClass =
  "min-h-11 min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 dark:text-white dark:disabled:bg-darkmode/60";

/** Gaps/padding scale with viewport; inputs stay fixed. Scroll only if content overflows. */
const modalFitVars = {
  ["--pl-gap"]: "clamp(0.625rem, 1.5dvh, 1rem)",
  ["--pl-pad-y"]: "clamp(0.75rem, 1.8dvh, 1.25rem)",
  ["--pl-pad-x"]: "clamp(0.875rem, 2.5vw, 1.5rem)",
  ["--pl-label-mb"]: "clamp(0.375rem, 0.8dvh, 0.5rem)",
  ["--pl-header-py"]: "clamp(0.625rem, 1.5dvh, 1.15rem)",
  width: "min(100%, 36rem)",
  maxHeight:
    "calc(100dvh - 1rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
} as CSSProperties;

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
  /** Prefill employment type (`salaried` | `self_employed`). */
  initialEmploymentType?: "salaried" | "self_employed";
  /** Prefill net monthly income (rupees). */
  initialNetMonthlyIncome?: number;
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
  initialEmploymentType = "",
  initialNetMonthlyIncome,
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
  const [employmentType, setEmploymentType] = useState("");
  const [netMonthlyIncome, setNetMonthlyIncome] = useState("");
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
    if (initialEmploymentType === "salaried" || initialEmploymentType === "self_employed") {
      setEmploymentType(initialEmploymentType);
    }
    if (
      typeof initialNetMonthlyIncome === "number" &&
      Number.isFinite(initialNetMonthlyIncome) &&
      initialNetMonthlyIncome > 0
    ) {
      setNetMonthlyIncome(String(Math.round(initialNetMonthlyIncome)));
    }
  }, [open, initialMobile, initialLoanAmount, initialEmploymentType, initialNetMonthlyIncome]);

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
    setEmploymentType(
      initialEmploymentType === "salaried" || initialEmploymentType === "self_employed"
        ? initialEmploymentType
        : "",
    );
    setNetMonthlyIncome(
      typeof initialNetMonthlyIncome === "number" &&
        Number.isFinite(initialNetMonthlyIncome) &&
        initialNetMonthlyIncome > 0
        ? String(Math.round(initialNetMonthlyIncome))
        : "",
    );
    setPan("");
    setTermsAccepted(false);
    setFormError("");
    setPendingLeadId("");
  }, [
    initialLoanAmount,
    initialMobile,
    lockMobile,
    initialEmploymentType,
    initialNetMonthlyIncome,
  ]);

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
    if (!employmentType) {
      errors.loanAmt = errors.loanAmt || "Please select employment type";
    }
    const incomeNum = Number(netMonthlyIncome.replace(/,/g, ""));
    if (!netMonthlyIncome.trim() || !Number.isFinite(incomeNum) || incomeNum <= 0) {
      errors.loanAmt = errors.loanAmt || "Enter a valid net monthly income";
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
      const employmentPayload = {
        employmentType: employmentType as "salaried" | "self_employed",
        netMonthlyIncome: incomeNum,
      };
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
            ...employmentPayload,
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
          ...employmentPayload,
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
          className="fixed inset-0 z-[99990] flex items-center justify-center overflow-hidden p-2 sm:p-4 bg-black/50 backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="personal-loan-apply-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-darklight"
            style={modalFitVars}
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
            <div
              className="flex shrink-0 items-center justify-between border-b border-gray-100 dark:border-dark_border"
              style={{
                paddingInline: "var(--pl-pad-x)",
                paddingBlock: "var(--pl-header-py)",
              }}
            >
              <h2
                id="personal-loan-apply-title"
                className="min-w-0 pr-2 text-base font-bold text-midnight_text dark:text-white sm:text-xl"
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
              className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain"
              style={{
                gap: "var(--pl-gap)",
                paddingInline: "var(--pl-pad-x)",
                paddingBlock: "var(--pl-pad-y)",
              }}
            >
              {formError && (
                <div className="shrink-0 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600 break-words">
                  {formError}
                </div>
              )}

              <div className="shrink-0 [&_label]:mb-[var(--pl-label-mb)]">
                <LoanAmountSlider value={loanAmount} onChange={setLoanAmount} />
              </div>

              <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="hero-pl-fullname"
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--pl-label-mb)" }}
                  >
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
                  <label
                    htmlFor="hero-pl-pan"
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--pl-label-mb)" }}
                  >
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
              </div>

              <div className="shrink-0">
                <label
                  className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                  style={{ marginBottom: "var(--pl-label-mb)" }}
                >
                  Mobile Number *
                </label>
                <div
                  className={`${mobileShellClass} ${lockMobile ? "opacity-90" : ""}`}
                >
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
                  <p className="mt-1 text-xs text-gray">Verified mobile number</p>
                ) : null}
              </div>

              <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="hero-pl-employment"
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--pl-label-mb)" }}
                  >
                    Employment Type *
                  </label>
                  <select
                    id="hero-pl-employment"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select employment type</option>
                    {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="hero-pl-income"
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--pl-label-mb)" }}
                  >
                    Net Monthly Income *
                  </label>
                  <input
                    id="hero-pl-income"
                    type="text"
                    inputMode="numeric"
                    value={netMonthlyIncome}
                    onChange={(e) =>
                      setNetMonthlyIncome(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="e.g. 50000"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="shrink-0">
                <TermsAgreementCheckbox
                  id="hero-pl-terms"
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                  textClassName="text-xs leading-snug text-gray-600 dark:text-gray-400 sm:whitespace-nowrap sm:text-sm sm:leading-snug"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingForm}
                className="btn-gradient inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-base font-semibold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmittingForm ? "Submitting…" : "Apply Now"}
              </button>

              <CheckApplicationStatusLink className="shrink-0" onNavigate={handleClose} />
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
          syncServerVerify
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
