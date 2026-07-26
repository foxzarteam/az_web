"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ConfirmationResult } from "firebase/auth";
import {
  getFirebaseOtpSendErrorMessage,
  RECAPTCHA_CONTAINER_ID,
  resetRecaptcha,
  sendFirebasePhoneOtp,
  verifyPhoneOtp,
  warmFirebaseAuth,
} from "@/app/lib/firebase/phoneAuth";
import { useBodyScrollLock } from "@/app/utils/useBodyScrollLock";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

export type LeadOtpSuccess = {
  mobile: string;
  idToken: string;
};

type LeadApplyModalProps = {
  open: boolean;
  /** Optional — OTP can run before a lead exists (chatbox flow). */
  leadId?: string;
  mobile: string;
  onClose: () => void;
  /** May be async — modal stays open until it resolves (e.g. login → dashboard). */
  onSuccess: (result: LeadOtpSuccess) => void | Promise<void>;
  onEditMobile?: () => void;
  /**
   * When false, skips Nest /otp/verify-firebase (faster).
   * Use when the next step (e.g. customer login) already verifies the Firebase token.
   * Keep true for chat → /leads/start which needs a recent OTP session row.
   */
  syncServerVerify?: boolean;
};

export default function LeadApplyModal({
  open,
  leadId: _leadId,
  mobile,
  onClose,
  onSuccess,
  onEditMobile,
  syncServerVerify = true,
}: LeadApplyModalProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [firebaseConfirmation, setFirebaseConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const autoSentRef = useRef(false);
  const mobileDigits = mobile.replace(/\D/g, "");

  const resetState = useCallback(() => {
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setResendCooldown(0);
    setFirebaseConfirmation(null);
    setRateLimited(false);
    setIsFinishing(false);
    autoSentRef.current = false;
    resetRecaptcha(RECAPTCHA_CONTAINER_ID);
  }, []);

  const sendOtp = useCallback(async (opts?: { isResend?: boolean }) => {
    if (mobileDigits.length !== 10 || rateLimited || isFinishing) return;
    setIsSendingOtp(true);
    setError("");
    if (opts?.isResend) {
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setFirebaseConfirmation(null);
    }

    try {
      const confirmation = await sendFirebasePhoneOtp(mobileDigits);
      setFirebaseConfirmation(confirmation);
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setRateLimited(false);
      if (opts?.isResend) {
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const message = getFirebaseOtpSendErrorMessage(err);
      setError(message);
      const code =
        err != null && typeof err === "object" ? (err as { code?: string }).code : undefined;
      if (code === "otp/daily-limit") {
        setRateLimited(true);
      }
    } finally {
      setIsSendingOtp(false);
    }
  }, [mobileDigits, rateLimited, isFinishing]);

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }
    warmFirebaseAuth();
    if (mobileDigits.length !== 10 || autoSentRef.current) return;
    autoSentRef.current = true;
    void sendOtp();
  }, [open, mobileDigits, resetState, sendOtp]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useBodyScrollLock(open);

  const verifyOtp = async (otp: string) => {
    if (otp.length !== OTP_LENGTH || isVerifyingOtp || isFinishing || !firebaseConfirmation) {
      return;
    }
    setIsVerifyingOtp(true);
    setError("");

    const res = await verifyPhoneOtp(firebaseConfirmation, otp, mobileDigits, {
      syncServer: syncServerVerify,
    });

    if (!res.success || !res.idToken) {
      setIsVerifyingOtp(false);
      setError(res.message || "Invalid OTP. Please try again.");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      return;
    }

    // Keep modal open with progress until parent finishes login/navigation.
    setIsFinishing(true);
    setIsVerifyingOtp(false);
    try {
      await Promise.resolve(onSuccess({ mobile: mobileDigits, idToken: res.idToken }));
    } catch {
      setIsFinishing(false);
      setError("Could not open your dashboard. Please try again.");
      return;
    }
    // Parent navigates away; if still here, leave finishing state (page will unmount).
  };

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

  if (!open || typeof document === "undefined") return null;

  const busy = isSendingOtp || isVerifyingOtp || isFinishing;

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
      <div className="relative bg-white dark:bg-darklight w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {isFinishing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 px-6 text-center dark:bg-darklight/95">
            <div className="mb-3 h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-semibold text-midnight_text dark:text-white">
              Please wait…
            </p>
            <p className="mt-1 text-xs text-gray-500">Finishing up</p>
          </div>
        )}

        <div className="flex items-center justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-3 border-b border-gray-100 dark:border-dark_border">
          <h2 className="text-lg sm:text-xl font-bold text-midnight_text dark:text-white">
            Verify OTP
          </h2>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (busy) return;
              onClose();
              resetState();
            }}
            className="p-2 -m-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5 sm:py-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 break-words">
              {error}
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            We have sent a {OTP_LENGTH} digit verification code to{" "}
            <span className="font-semibold text-midnight_text dark:text-white">
              {mobileDigits}
            </span>
            {onEditMobile && (
              <button
                type="button"
                disabled={busy}
                onClick={onEditMobile}
                className="ml-1 inline-flex text-primary hover:underline disabled:opacity-40"
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
                disabled={busy}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-10 h-11 sm:w-12 sm:h-12 text-center text-lg font-semibold rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-midnight_text"
              />
            ))}
          </div>

          {(isSendingOtp || isVerifyingOtp) && !isFinishing && (
            <p className="text-center text-sm text-gray-500 mb-3">Please wait…</p>
          )}

          <div className="text-center">
            <button
              type="button"
              disabled={rateLimited || resendCooldown > 0 || busy}
              onClick={() => void sendOtp({ isResend: true })}
              className="text-sm font-semibold text-primary disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
            >
              {rateLimited
                ? "OTP limit reached — try again tomorrow"
                : resendCooldown > 0
                  ? `Resend Code in ${resendCooldown}s`
                  : "Resend Code"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
