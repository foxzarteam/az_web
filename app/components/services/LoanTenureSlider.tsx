"use client";

import { PERSONAL_LOAN_TENURE } from "@/app/config/constants";

type LoanTenureSliderProps = {
  id?: string;
  label?: string;
  value: number;
  onChange: (months: number) => void;
};

function clampMonths(value: number): number {
  const n = Math.round(value);
  return Math.max(PERSONAL_LOAN_TENURE.MIN_MONTHS, Math.min(PERSONAL_LOAN_TENURE.MAX_MONTHS, n));
}

export default function LoanTenureSlider({
  id = "loan-tenure",
  label = "Loan Tenure",
  value,
  onChange,
}: LoanTenureSliderProps) {
  const months = clampMonths(Number.isFinite(value) ? value : PERSONAL_LOAN_TENURE.DEFAULT_MONTHS);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-midnight_text dark:text-gray-300">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="mb-1 grid grid-cols-3 items-end text-xs text-gray dark:text-gray-400 sm:text-sm">
        <span>{PERSONAL_LOAN_TENURE.MIN_MONTHS} Months</span>
        <span className="text-center text-base font-bold text-midnight_text dark:text-white sm:text-lg">
          {months} Months
        </span>
        <span className="text-right">{PERSONAL_LOAN_TENURE.MAX_MONTHS} Months</span>
      </div>
      <input
        id={id}
        type="range"
        min={PERSONAL_LOAN_TENURE.MIN_MONTHS}
        max={PERSONAL_LOAN_TENURE.MAX_MONTHS}
        step={1}
        value={months}
        onChange={(e) => onChange(clampMonths(Number(e.target.value)))}
        className="loan-tenure-slider w-full cursor-pointer"
        aria-valuemin={PERSONAL_LOAN_TENURE.MIN_MONTHS}
        aria-valuemax={PERSONAL_LOAN_TENURE.MAX_MONTHS}
        aria-valuenow={months}
        aria-valuetext={`${months} Months`}
        aria-label={label}
      />
    </div>
  );
}
