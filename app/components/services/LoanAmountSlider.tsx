"use client";

import { useState } from "react";
import { PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";

type LoanAmountSliderProps = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Public apply form only. Admin keeps its own field errors. */
  required?: boolean;
};

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

export default function LoanAmountSlider({
  id = "loan-amount",
  value,
  onChange,
  max = PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT,
  required = false,
}: LoanAmountSliderProps) {
  const [digits, setDigits] = useState(() => (Number.isFinite(value) && value > 0 ? String(Math.round(value)) : ""));
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (Number(digits) !== value) {
      setDigits(Number.isFinite(value) && value > 0 ? String(Math.round(value)) : "");
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
      >
        Enter Loan Amount <span className="text-red-500">*</span>
      </label>
      <div className="flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80">
        <span className="flex shrink-0 items-center pl-3" aria-hidden>
          <span className="theme-gradient-bg flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold leading-none text-white shadow-[0_2px_8px_rgba(66,54,251,0.35)]">
            ₹
          </span>
        </span>
        <span className="ml-2.5 h-6 w-px shrink-0 bg-gray-300 dark:bg-dark_border" aria-hidden />
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={digits}
          placeholder="Enter loan amount"
          onChange={(e) => {
            const next = digitsOnly(e.target.value).slice(0, String(max).length);
            setDigits(next);
            if (!next) {
              onChange(0);
              return;
            }
            const parsed = Number(next);
            if (Number.isFinite(parsed)) onChange(parsed);
          }}
          className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none dark:text-white"
          aria-label="Enter loan amount"
          required={required}
        />
      </div>
    </div>
  );
}
