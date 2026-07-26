"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ConfirmationResult } from "firebase/auth";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import {
  getFirebaseOtpSendErrorMessage,
  RECAPTCHA_CONTAINER_ID,
  resetRecaptcha,
  sendFirebasePhoneOtp,
  verifyPhoneOtp,
} from "@/app/lib/firebase/phoneAuth";
import { checkCustomerMobile, customerLogin } from "@/app/utils/customerAuthApi";
import { sanitizeMobileInput } from "@/app/utils/validation";
import { MOBILE_VALIDATION } from "@/app/config/constants";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

type Step = "phone" | "otp";

export default function CustomerLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const [firebaseConfirmation, setFirebaseConfirmation] =
    useState<ConfirmationResult | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const mobileDigits = mobile.replace(/\D/g, "");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const sendOtp = useCallback(async () => {
    if (mobileDigits.length !== 10 || rateLimited) return;
    setBusy(true);
    setError("");
    try {
      const confirmation = await sendFirebasePhoneOtp(mobileDigits, "customer-track-recaptcha");
      setFirebaseConfirmation(confirmation);
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setStep("otp");
    } catch (err) {
      const message = getFirebaseOtpSendErrorMessage(err);
      setError(message);
      const code =
        err != null && typeof err === "object" ? (err as { code?: string }).code : undefined;
      if (code === "otp/daily-limit") setRateLimited(true);
    } finally {
      setBusy(false);
    }
  }, [mobileDigits, rateLimited]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setNotFound(false);

    if (mobileDigits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setBusy(true);
    const check = await checkCustomerMobile(mobileDigits);
    setBusy(false);

    if (check.message && !check.exists) {
      setError(check.message);
      return;
    }

    if (!check.exists) {
      setNotFound(true);
      return;
    }

    await sendOtp();
  };

  const verifyOtp = async (otp: string) => {
    if (otp.length !== OTP_LENGTH || busy || !firebaseConfirmation) return;
    setBusy(true);
    setError("");

    const res = await verifyPhoneOtp(firebaseConfirmation, otp, mobileDigits);
    if (!res.success || !res.idToken) {
      setBusy(false);
      setError(res.message || "Invalid OTP. Please try again.");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      return;
    }

    const login = await customerLogin(mobileDigits, res.idToken);
    setBusy(false);

    if (!login.ok) {
      setError(login.message || "Login failed. Please try again.");
      return;
    }

    router.replace("/customer/dashboard");
    router.refresh();
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

  return (
    <div className="w-full max-w-md">
      <div
        id="customer-track-recaptcha"
        className="fixed left-0 top-0 h-px w-px overflow-hidden opacity-0 pointer-events-none"
        aria-hidden
      />

      <div className="rounded-2xl border border-black/5 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Application status
        </p>
        <h1 className="mt-2 text-2xl font-bold text-midnight_text sm:text-3xl">
          Check Status
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {step === "phone"
            ? "Enter the mobile number you used on your loan application."
            : `Enter the ${OTP_LENGTH}-digit OTP sent to ${mobileDigits}.`}
        </p>

        {(error || notFound) && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {notFound ? (
              <>
                No application found for this number.{" "}
                <Link href="/products/personal-loan" className="font-semibold underline">
                  Apply now
                </Link>
              </>
            ) : (
              error
            )}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={(e) => void handlePhoneSubmit(e)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-midnight_text">
                Mobile number
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white">
                <span className="flex shrink-0 items-center pl-3" aria-hidden>
                  <IndiaFlag />
                </span>
                <span className="px-2 text-sm font-medium text-midnight_text">+91</span>
                <span className="h-5 w-px bg-gray-300" aria-hidden />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                  placeholder="10-digit mobile"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(sanitizeMobileInput(e.target.value));
                    setNotFound(false);
                    setError("");
                  }}
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-gradient inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
            >
              {busy ? "Checking…" : "Continue"}
            </button>
          </form>
        ) : (
          <div className="mt-6">
            <div className="flex justify-center gap-2 sm:gap-3">
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
                  className="h-11 w-10 rounded-lg border-2 border-gray-200 text-center text-lg font-semibold text-midnight_text focus:border-primary focus:outline-none sm:h-12 sm:w-12"
                />
              ))}
            </div>

            {busy && (
              <p className="mt-3 text-center text-sm text-gray-500">Please wait…</p>
            )}

            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                type="button"
                disabled={rateLimited || resendCooldown > 0 || busy}
                onClick={() => void sendOtp()}
                className="text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-400 hover:underline"
              >
                {rateLimited
                  ? "OTP limit reached — try again tomorrow"
                  : resendCooldown > 0
                    ? `Resend Code in ${resendCooldown}s`
                    : "Resend Code"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setStep("phone");
                  setOtpDigits(Array(OTP_LENGTH).fill(""));
                  setFirebaseConfirmation(null);
                  setError("");
                  resetRecaptcha("customer-track-recaptcha");
                  resetRecaptcha(RECAPTCHA_CONTAINER_ID);
                }}
                className="text-sm text-gray-500 hover:text-midnight_text hover:underline"
              >
                Change mobile number
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M12.5 4.5 7 10l5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
