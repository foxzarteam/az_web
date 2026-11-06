"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import { checkCustomerMobile, customerLogin } from "@/app/lib/customer/authApi";
import { sanitizeMobileInput } from "@/app/lib/validation";
import { MOBILE_VALIDATION } from "@/app/config/constants";

export default function CustomerLoginForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  const mobileDigits = mobile.replace(/\D/g, "");

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
    try {
      const check = await checkCustomerMobile(mobileDigits);
      if (check.message && !check.exists) {
        setError(check.message);
        return;
      }
      if (!check.exists) {
        setNotFound(true);
        return;
      }

      const login = await customerLogin(mobileDigits);
      if (!login.ok) {
        setError(login.message || "Login failed. Please try again.");
        return;
      }
      router.replace("/customer/dashboard");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-black/5 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Application status
        </p>
        <h1 className="mt-2 text-2xl font-bold text-midnight_text sm:text-3xl">
          Check Status
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the mobile number you used on your loan application.
        </p>

        {(error || notFound) && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {notFound ? (
              <>
                No application found for this number.{" "}
                <Link href="/products/loans" className="font-semibold underline">
                  Apply now
                </Link>
              </>
            ) : (
              error
            )}
          </div>
        )}

        <form onSubmit={(e) => void handlePhoneSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-midnight_text">
              Mobile number
            </label>
            <div className="flex min-h-12 items-center overflow-hidden rounded-xl border border-gray-300 bg-white">
              <span className="flex shrink-0 items-center pl-3" aria-hidden>
                <IndiaFlag />
              </span>
              <span className="px-2 text-base font-semibold text-midnight_text">+91</span>
              <span className="h-6 w-px shrink-0 bg-gray-300" aria-hidden />
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
                className="min-h-12 min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none"
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
