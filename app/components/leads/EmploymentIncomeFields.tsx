"use client";

import type { CSSProperties, ReactNode } from "react";

export const LOAN_APPLY_EMPLOYMENT_OPTIONS = [
  { value: "salaried_bank", label: "Salaried (Bank Account Transfer)" },
  { value: "salaried_cash", label: "Salaried (Cash / Cheque)" },
  { value: "self_employed", label: "Self-Employed / Business" },
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  ...LOAN_APPLY_EMPLOYMENT_OPTIONS,
  { value: "salaried", label: "Salaried" },
] as const;

type EmploymentTypeFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
  labelClassName?: string;
  labelAsSpan?: boolean;
  error?: ReactNode;
  options?: readonly { value: string; label: string }[];
};

/** Salaried or self-employed business. */
export function EmploymentTypeField({
  id,
  value,
  onChange,
  className,
  labelClassName = "mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300",
  labelAsSpan = false,
  error,
  options = EMPLOYMENT_TYPE_OPTIONS,
}: EmploymentTypeFieldProps) {
  const label = labelAsSpan ? (
    <span className={labelClassName}>
      Employment type <span className="text-red-500">*</span>
    </span>
  ) : (
    <label htmlFor={id} className={labelClassName}>
      Employment type <span className="text-red-500">*</span>
    </label>
  );
  const control = (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      required
    >
      <option value="">Select employment type</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
  if (labelAsSpan) {
    return (
      <label className="block">
        {label}
        {control}
        {error}
      </label>
    );
  }
  return (
    <div>
      {label}
      {control}
      {error}
    </div>
  );
}

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
  /** Small gradient ₹ inside the field, same as the public loan amount input. */
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
            ? "min-h-10 min-w-0 flex-1 bg-transparent py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-white"
            : "min-h-10 min-w-0 flex-1 bg-transparent py-2 pl-9 pr-3 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none dark:text-white"
          : inputClassName
      }
      required
    />
  );

  const incomeControl = incomeWithRupee ? (
    <div
      className={
        labelAsSpan
          ? "relative flex min-h-[46px] items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-[#4236FB] focus-within:ring-2 focus-within:ring-[#4236FB]/20 dark:border-dark_border dark:bg-darkmode"
          : "relative flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80"
      }
    >
      <span className="theme-gradient-text pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold leading-none" aria-hidden>
        ₹
      </span>
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
