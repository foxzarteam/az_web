"use client";

import type { CSSProperties, ReactNode } from "react";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/app/utils/leadForm";

type EmploymentIncomeFieldsProps = {
  idPrefix: string;
  employmentType: string;
  netMonthlyIncome: string;
  onEmploymentChange: (value: string) => void;
  onIncomeChange: (value: string) => void;
  inputClassName: string;
  labelClassName?: string;
  labelStyle?: CSSProperties;
  gridClassName?: string;
  employmentError?: ReactNode;
  incomeError?: ReactNode;
  /** Admin labels use `<span>` wrappers instead of floating margin labels */
  labelAsSpan?: boolean;
  /** Gradient ₹ badge, same as the public loan amount field. */
  incomeWithRupee?: boolean;
};

/**
 * Shared employment type + net monthly income inputs for personal loan apply flows.
 */
export default function EmploymentIncomeFields({
  idPrefix,
  employmentType,
  netMonthlyIncome,
  onEmploymentChange,
  onIncomeChange,
  inputClassName,
  labelClassName = "block text-sm font-medium text-midnight_text dark:text-gray-300",
  labelStyle,
  gridClassName = "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4",
  employmentError,
  incomeError,
  labelAsSpan = false,
  incomeWithRupee = false,
}: EmploymentIncomeFieldsProps) {
  const employmentId = `${idPrefix}-employment`;
  const incomeId = `${idPrefix}-income`;

  const employmentLabel = labelAsSpan ? (
    <span className={labelClassName}>Employment type <span className="text-red-500">*</span></span>
  ) : (
    <label htmlFor={employmentId} className={labelClassName} style={labelStyle}>
      Employment Type <span className="text-red-500">*</span>
    </label>
  );

  const incomeLabel = labelAsSpan ? (
    <span className={labelClassName}>Net monthly income <span className="text-red-500">*</span></span>
  ) : (
    <label htmlFor={incomeId} className={labelClassName} style={labelStyle}>
      Net Monthly Income <span className="text-red-500">*</span>
    </label>
  );

  const employmentControl = (
    <select
      id={employmentId}
      value={employmentType}
      onChange={(e) => onEmploymentChange(e.target.value)}
      className={inputClassName}
      required
    >
      <option value="">Select employment type</option>
      {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
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
          ? "min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-white"
          : inputClassName
      }
      required
    />
  );

  const incomeControl = incomeWithRupee ? (
    <div className="flex min-h-[46px] items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-[#4236FB] focus-within:ring-2 focus-within:ring-[#4236FB]/20 dark:border-dark_border dark:bg-darkmode">
      <span className="flex shrink-0 items-center pl-3" aria-hidden>
        <span className="theme-gradient-bg flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold leading-none text-white shadow-[0_2px_8px_rgba(66,54,251,0.35)]">
          ₹
        </span>
      </span>
      <span className="ml-2.5 h-6 w-px shrink-0 bg-slate-200 dark:bg-dark_border" aria-hidden />
      {incomeInput}
    </div>
  ) : (
    incomeInput
  );

  if (labelAsSpan) {
    return (
      <div className={gridClassName}>
        <label className="block">
          {employmentLabel}
          {employmentControl}
          {employmentError}
        </label>
        <label className="block">
          {incomeLabel}
          {incomeControl}
          {incomeError}
        </label>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      <div>
        {employmentLabel}
        {employmentControl}
        {employmentError}
      </div>
      <div>
        {incomeLabel}
        {incomeControl}
        {incomeError}
      </div>
    </div>
  );
}
