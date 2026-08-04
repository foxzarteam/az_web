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
}: EmploymentIncomeFieldsProps) {
  const employmentId = `${idPrefix}-employment`;
  const incomeId = `${idPrefix}-income`;

  const employmentLabel = labelAsSpan ? (
    <span className={labelClassName}>Employment type *</span>
  ) : (
    <label htmlFor={employmentId} className={labelClassName} style={labelStyle}>
      Employment Type *
    </label>
  );

  const incomeLabel = labelAsSpan ? (
    <span className={labelClassName}>Net monthly income *</span>
  ) : (
    <label htmlFor={incomeId} className={labelClassName} style={labelStyle}>
      Net Monthly Income *
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

  const incomeControl = (
    <input
      id={incomeId}
      type="text"
      inputMode="numeric"
      value={netMonthlyIncome}
      onChange={(e) => onIncomeChange(e.target.value.replace(/[^\d]/g, ""))}
      placeholder="e.g. 50000"
      className={inputClassName}
      required
    />
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
