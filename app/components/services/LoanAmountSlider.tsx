"use client";

import { useMemo, useState } from "react";
import { PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";
import { formatRupee } from "@/app/utils/format";

type LoanAmountSliderProps = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

export default function LoanAmountSlider({
  id = "loan-amount",
  value,
  onChange,
  min = PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT,
  max = PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT,
  step = PERSONAL_LOAN_EMI_LIMITS.STEP_AMOUNT,
}: LoanAmountSliderProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const pct = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max]);
  const display = draft ?? formatRupee(value);
  const maxDigits = String(max).length;

  const applyAmount = (rawDigits: string) => {
    if (!rawDigits) {
      onChange(min);
      setDraft(null);
      return;
    }
    const parsed = Number(rawDigits);
    const next = clamp(Number.isFinite(parsed) ? parsed : min, min, max);
    onChange(next);
    setDraft(null);
  };

  return (
    <div>
      <label htmlFor={`${id}-input`} className="mb-1.5 block text-xs font-medium text-midnight_text dark:text-gray-300 sm:mb-3 sm:text-sm">
        Select Loan Amount *
      </label>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Slider / progress — py keeps thumb from overlapping next fields */}
        <div className="min-w-0 flex-1 py-1.5 sm:py-2">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              setDraft(null);
              onChange(Number(e.target.value));
            }}
            className="loan-amount-slider w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4236FB 0%, #4236FB ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
            }}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label="Loan amount slider"
          />
          <div className="mt-0.5 flex justify-between text-[10px] text-gray sm:mt-1 sm:text-[11px]">
            <span>{formatRupee(min)}</span>
            <span>{formatRupee(max)}</span>
          </div>
        </div>

        {/* Amount input */}
        <div className="w-[118px] shrink-0 sm:w-[156px]">
          <div className="rounded-xl border border-black bg-white px-2 py-1.5 shadow-[0_2px_12px_rgba(16,45,71,0.06)] dark:border-white dark:bg-darkmode sm:rounded-2xl sm:px-3 sm:py-2">
            <input
              id={`${id}-input`}
              type="text"
              inputMode="numeric"
              value={display}
              onFocus={(e) => {
                setDraft(formatRupee(value));
                requestAnimationFrame(() => e.target.select());
              }}
              onChange={(e) => {
                let next = digitsOnly(e.target.value).slice(0, maxDigits);
                if (!next) {
                  setDraft("₹");
                  return;
                }
                if (Number(next) > max) next = String(max);
                setDraft(formatRupee(Number(next)));
              }}
              onBlur={() => applyAmount(digitsOnly(draft ?? String(value)))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-full border-0 bg-transparent text-center text-sm font-bold tracking-wide text-midnight_text outline-none dark:text-white sm:text-base"
              aria-label={`Enter loan amount between ${formatRupee(min)} and ${formatRupee(max)}`}
            />
            <div className="mx-auto mt-0.5 h-[2px] w-[70%] rounded-full bg-primary sm:mt-1 sm:h-[2.5px]" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
