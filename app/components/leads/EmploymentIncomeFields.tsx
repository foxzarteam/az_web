"use client";

import type { CSSProperties, ReactNode } from "react";

type EmploymentIncomeFieldsProps = {
  idPrefix: string;
  netMonthlyIncome: string;
  onIncomeChange: (value: string) => void;
  inputClassName: string;
  labelClassName?: string;
  labelStyle?: CSSProperties;
  incomeError?: ReactNode;
  /** Admin labels use `<span>` wrappers instead of floating margin labels */
  labelAsSpan?: boolean;
  /** Gradient ₹ badge, same as the public loan amount field. */
  incomeWithRupee?: boolean;
};

/** Net monthly income for personal loan apply flows. */
export default function EmploymentIncomeFields({
  idPrefix,
  netMonthlyIncome,
  onIncomeChange,
  inputClassName,
  labelClassName = "block text-sm font-medium text-midnight_text dark:text-gray-300",
  labelStyle,
  incomeError,
  labelAsSpan = false,
  incomeWithRupee = false,
}: EmploymentIncomeFieldsProps) {
  const incomeId = `${idPrefix}-income`;

  const incomeLabel = labelAsSpan ? (
    <span className={labelClassName}>Net monthly income <span className="text-red-500">*</span></span>
  ) : (
    <label htmlFor={incomeId} className={labelClassName} style={labelStyle}>
      Net Monthly Income <span className="text-red-500">*</span>
    </label>
  );

  const incomeInput = (
    <input
      id={incomeId}
      type="text"
      inputMode="numeric"
      value={netMonthlyIncome}
      onChange={(e) => onIncomeChange(e.target.value.replace(/[^\d]/g, ""))}
      placeholder="e.g. 50000"
      className={
        incomeWithRupee
          ? labelAsSpan
            ? "min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-white"
            : "min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none dark:text-white"
          : inputClassName
      }
      required
    />
  );

  const incomeControl = incomeWithRupee ? (
    <div
      className={
        labelAsSpan
          ? "flex min-h-[46px] items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-[#4236FB] focus-within:ring-2 focus-within:ring-[#4236FB]/20 dark:border-dark_border dark:bg-darkmode"
          : "flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80"
      }
    >
      <span className="flex shrink-0 items-center pl-3" aria-hidden>
        <span className="theme-gradient-bg flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold leading-none text-white shadow-[0_2px_8px_rgba(66,54,251,0.35)]">
          ₹
        </span>
      </span>
      <span className="ml-2.5 h-6 w-px shrink-0 bg-gray-300 dark:bg-dark_border" aria-hidden />
      {incomeInput}
    </div>
  ) : (
    incomeInput
  );

  if (labelAsSpan) {
    return (
      <label className="block">
        {incomeLabel}
        {incomeControl}
        {incomeError}
      </label>
    );
  }

  return (
    <div>
      {incomeLabel}
      {incomeControl}
      {incomeError}
    </div>
  );
}
