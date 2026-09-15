"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import CheckApplicationStatusLink from "@/app/components/leads/CheckApplicationStatusLink";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import { MOBILE_VALIDATION } from "@/app/config/constants";
import { warmFirebaseAuth } from "@/app/lib/firebase/phoneAuth";
import { reportFormValidity } from "@/app/utils/formValidation";
import { customerLogin } from "@/app/utils/customerAuthApi";
import { applyLead, checkLeadApplication } from "@/app/utils/leadApi";
import {
  INSURANCE_TYPE_OPTIONS,
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  sanitizeLeadPincodeInput,
  validateLeadPanNameMobile,
  validateLeadPincode,
  type LeadFieldErrors,
} from "@/app/utils/leadForm";
import { firstLeadFieldError } from "@/app/lib/leads/personalLoanApply";
import { sanitizeMobileInput } from "@/app/utils/validation";
import { blurActiveElement, useBodyScrollLock } from "@/app/utils/useBodyScrollLock";

const SUCCESS_FALLBACK =
  "Your insurance application was submitted. Use “Check your application status” below the form with your mobile number to open your dashboard.";

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

const modalFitVars = {
  ["--ins-gap"]: "clamp(0.625rem, 1.5dvh, 1rem)",
  ["--ins-pad-y"]: "clamp(0.75rem, 1.8dvh, 1.25rem)",
  ["--ins-pad-x"]: "clamp(1rem, 3vw, 1.75rem)",
  ["--ins-label-mb"]: "clamp(0.375rem, 0.8dvh, 0.5rem)",
  ["--ins-header-py"]: "clamp(0.625rem, 1.5dvh, 1.15rem)",
  width: "min(100%, 42rem)",
  maxHeight:
    "calc(100dvh - 1rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
} as CSSProperties;

type InsuranceApplyModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function InsuranceApplyModal({ open, onClose }: InsuranceApplyModalProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingAppMessage, setExistingAppMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingLeadId, setPendingLeadId] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isOpeningDashboard, setIsOpeningDashboard] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [insType, setInsType] = useState("");
  const [pan, setPan] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!formError) return;
    const t = window.setTimeout(() => setFormError(""), 3000);
    return () => window.clearTimeout(t);
  }, [formError]);

  useEffect(() => {
    if (open) warmFirebaseAuth();
  }, [open]);

  const resetForm = useCallback(() => {
    setFullName("");
    setMobile("");
    setPincode("");
    setInsType("");
    setPan("");
    setTermsAccepted(false);
    setFormError("");
    setPendingLeadId("");
  }, []);

  const handleClose = useCallback(() => {
    if (showOtpModal || isSubmittingForm || isOpeningDashboard) return;
    blurActiveElement();
    resetForm();
    onClose();
  }, [onClose, resetForm, showOtpModal, isSubmittingForm, isOpeningDashboard]);

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
    const pinErr = validateLeadPincode(pincode);
    if (pinErr) errors.pincode = pinErr;
    if (!insType.trim()) errors.insType = "Please select insurance type";

    const firstError = firstLeadFieldError(errors);
    if (firstError) {
      setFormError(firstError);
      return;
    }

    setFormError("");
    setIsSubmittingForm(true);

    try {
      const check = await checkLeadApplication({
        mobileNumber: mobile.replace(/\D/g, ""),
        pan: pan.trim().toUpperCase(),
        category: "insurance",
        insType,
      });
      if (!check.success) {
        setFormError(check.message || "Could not verify existing application. Please try again.");
        return;
      }
      if (!check.allowed) {
        setExistingAppMessage(
          check.message ||
            `Your ${check.categoryLabel || "Insurance"} application is already ${check.statusLabel || "Under Review"}.`,
        );
        return;
      }

      setPendingLeadId("pending");
      setShowOtpModal(true);
    } catch {
      setFormError("Network error. Please try again.");
      setIsOpeningDashboard(false);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (
    (!open && !showSuccess && !showOtpModal && !existingAppMessage) ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <>
      {existingAppMessage && (
        <SuccessPopup
          message={existingAppMessage}
          variant="warning"
          onClose={() => setExistingAppMessage("")}
          footer={<CheckApplicationStatusLink />}
        />
      )}

      {open && !showOtpModal && !existingAppMessage && (
        <div
          className="fixed inset-0 z-[99990] flex items-center justify-center overflow-hidden p-2 sm:p-4 bg-black/50 backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="insurance-apply-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-darklight"
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
                paddingInline: "var(--ins-pad-x)",
                paddingBlock: "var(--ins-header-py)",
              }}
            >
              <h2
                id="insurance-apply-title"
                className="min-w-0 pr-2 text-base font-bold text-midnight_text dark:text-white sm:text-xl"
              >
                Apply for Insurance
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
                gap: "var(--ins-gap)",
                paddingInline: "var(--ins-pad-x)",
                paddingBlock: "var(--ins-pad-y)",
              }}
            >
              {formError && (
                <div className="shrink-0 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600 break-words">
                  {formError}
                </div>
              )}

              <div className="shrink-0">
                <label
                  htmlFor="hub-ins-type"
                  className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                  style={{ marginBottom: "var(--ins-label-mb)" }}
                >
                  Insurance type *
                </label>
                <select
                  id="hub-ins-type"
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

              <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="hub-ins-fullname"
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--ins-label-mb)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    id="hub-ins-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(sanitizeLeadNameInput(e.target.value))}
                    placeholder="Full Name (As per PAN)"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="hub-ins-pan"
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--ins-label-mb)" }}
                  >
                    PAN Card number *
                  </label>
                  <input
                    id="hub-ins-pan"
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(sanitizeLeadPanInput(e.target.value))}
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--ins-label-mb)" }}
                  >
                    Mobile Number *
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
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="hub-ins-pincode"
                    className="block text-sm font-medium text-midnight_text dark:text-gray-300"
                    style={{ marginBottom: "var(--ins-label-mb)" }}
                  >
                    Pincode *
                  </label>
                  <input
                    id="hub-ins-pincode"
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

              <div className="shrink-0">
                <TermsAgreementCheckbox
                  id="hub-ins-terms"
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

      <LeadApplyModal
        open={showOtpModal && Boolean(pendingLeadId)}
        mobile={mobile.replace(/\D/g, "")}
        onClose={() => {
          if (isOpeningDashboard) return;
          setShowOtpModal(false);
          setPendingLeadId("");
        }}
        onEditMobile={() => {
          setShowOtpModal(false);
          setPendingLeadId("");
        }}
        syncServerVerify={false}
        onSuccess={async (result) => {
          const pin = pincode.replace(/\D/g, "");
          const applyRes = await applyLead(
            {
              pan: pan.trim().toUpperCase(),
              mobileNumber: mobile.replace(/\D/g, ""),
              fullName: fullName.trim(),
              pincode: pin,
              category: "insurance",
              insType,
            },
            result.idToken,
          );
          if (!applyRes.success) {
            throw new Error(applyRes.message || "Could not submit application.");
          }
          setIsOpeningDashboard(true);
          const ok = await loginAndGoToDashboard(result.mobile, result.idToken, (href) => {
            router.replace(href);
          });
          if (!ok) {
            setIsOpeningDashboard(false);
            throw new Error("Login failed");
          }
        }}
      />

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
