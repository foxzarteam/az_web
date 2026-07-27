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

function snapToStep(value: number, min: number, max: number, step: number): number {
  const clamped = clamp(value, min, max);
  if (step <= 0) return clamped;
  const steps = Math.round((clamped - min) / step);
  return clamp(min + steps * step, min, max);
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

  const numericValue = Number.isFinite(value) ? value : min;
  const clampedValue = clamp(numericValue, min, max);
  // Slider thumb needs a step-aligned position; typed amount stays exact in the input.
  const sliderValue = snapToStep(clampedValue, min, max, step);
  const pct = useMemo(
    () => ((sliderValue - min) / (max - min)) * 100,
    [sliderValue, min, max],
  );
  const display = draft ?? formatRupee(clampedValue);
  const maxDigits = String(max).length;

  const commitFromDigits = (rawDigits: string) => {
    if (!rawDigits) {
      onChange(min);
      setDraft(null);
      return;
    }
    const parsed = Number(rawDigits);
    // Keep exact typed value if in range — no step snap on manual entry.
    const next = clamp(Number.isFinite(parsed) ? parsed : min, min, max);
    onChange(next);
    setDraft(null);
  };

  return (
    <div>
      <label
        htmlFor={`${id}-input`}
        className="mb-1 block text-xs font-medium text-midnight_text dark:text-gray-300 sm:mb-2 sm:text-sm"
      >
        Select Loan Amount *
      </label>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="min-w-0 flex-1 py-1 sm:py-1.5">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={sliderValue}
            onChange={(e) => {
              // Step snap only when user moves the slider.
              const next = snapToStep(Number(e.target.value), min, max, step);
              setDraft(null);
              onChange(next);
            }}
            className="loan-amount-slider w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4236FB 0%, #4236FB ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
            }}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={sliderValue}
            aria-valuetext={formatRupee(clampedValue)}
            aria-label="Loan amount slider"
          />
          <div className="mt-0.5 flex justify-between gap-1 text-[10px] text-gray sm:text-[11px]">
            <span className="shrink-0">{formatRupee(min)}</span>
            <span className="shrink-0 text-right">{formatRupee(max)}</span>
          </div>
        </div>

        <div className="w-[100px] shrink-0 xs:w-[110px] sm:w-[156px]">
          <div className="rounded-xl border border-black bg-white px-1.5 py-1 shadow-[0_2px_12px_rgba(16,45,71,0.06)] dark:border-white dark:bg-darkmode xs:px-2 sm:rounded-2xl sm:px-3 sm:py-1.5">
            <input
              id={`${id}-input`}
              type="text"
              inputMode="numeric"
              value={display}
              onFocus={(e) => {
                setDraft(formatRupee(clampedValue));
                requestAnimationFrame(() => e.target.select());
              }}
              onChange={(e) => {
                let nextDigits = digitsOnly(e.target.value).slice(0, maxDigits);
                if (!nextDigits) {
                  setDraft("₹");
                  return;
                }
                let parsed = Number(nextDigits);
                if (!Number.isFinite(parsed)) return;
                if (parsed > max) {
                  parsed = max;
                  nextDigits = String(max);
                }
                setDraft(formatRupee(parsed));
                if (parsed >= min) {
                  onChange(clamp(parsed, min, max));
                }
              }}
              onBlur={() => {
                commitFromDigits(digitsOnly(draft ?? String(clampedValue)));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-full min-w-0 border-0 bg-transparent text-center text-sm font-bold tracking-wide text-midnight_text outline-none dark:text-white sm:text-base"
              aria-label={`Enter loan amount between ${formatRupee(min)} and ${formatRupee(max)}`}
            />
            <div
              className="mx-auto mt-0.5 h-[2px] w-[70%] rounded-full bg-primary sm:h-[2.5px]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
