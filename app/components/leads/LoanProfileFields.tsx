"use client";

import type { ReactNode } from "react";
import CibilBandSelect, { VEHICLE_CIBIL_OPTIONS } from "@/app/components/leads/CibilBandSelect";

type Props = {
  idPrefix: string;
  cibilBand: string;
  onCibilBand: (value: string) => void;
  cibilError?: ReactNode;
  hasExistingEmi: "" | "yes" | "no";
  onExistingEmi: (value: "" | "yes" | "no") => void;
  emiChoiceError?: ReactNode;
  totalMonthlyEmi: string;
  onTotalMonthlyEmi: (value: string) => void;
  emiAmountError?: ReactNode;
  inputClassName: string;
  labelClassName: string;
  nativeRequired?: boolean;
  /** Vehicle loan uses the 650 CIBIL bands and does not ask for EMI. */
  vehicle?: boolean;
};

/** CIBIL score and existing EMI. Used by the staff add-lead form. */
export default function LoanProfileFields({
  idPrefix,
  cibilBand,
  onCibilBand,
  cibilError,
  hasExistingEmi,
  onExistingEmi,
  emiChoiceError,
  totalMonthlyEmi,
  onTotalMonthlyEmi,
  emiAmountError,
  inputClassName,
  labelClassName,
  nativeRequired = false,
  vehicle = false,
}: Props) {
  const emiValue = hasExistingEmi === "no" ? "0" : totalMonthlyEmi;
  return (
    <>
      <div className={vehicle ? "order-7 min-w-0" : undefined}>
        <label htmlFor={`${idPrefix}-cibil`} className={labelClassName}>
          CIBIL score <span className="text-red-500">*</span>
        </label>
        <CibilBandSelect
          id={`${idPrefix}-cibil`}
          value={cibilBand}
          onChange={onCibilBand}
          className={inputClassName}
          options={vehicle ? VEHICLE_CIBIL_OPTIONS : undefined}
        />
        {cibilError}
      </div>
      {vehicle ? null : (
      <>
      <div>
        <label htmlFor={`${idPrefix}-existing-emi`} className={labelClassName}>
          Do you pay an existing loan EMI? <span className="text-red-500">*</span>
        </label>
        <select
          id={`${idPrefix}-existing-emi`}
          value={hasExistingEmi}
          onChange={(e) => {
            const next = e.target.value === "yes" || e.target.value === "no" ? e.target.value : "";
            onExistingEmi(next);
          }}
          className={inputClassName}
          required={nativeRequired}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {emiChoiceError}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-total-emi`} className={labelClassName}>
          Total monthly EMI you pay <span className="text-red-500">*</span>
        </label>
        <div className="relative flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80">
          <span
            className="theme-gradient-text pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold leading-none"
            aria-hidden
          >
            ₹
          </span>
          <input
            id={`${idPrefix}-total-emi`}
            type="text"
            inputMode="numeric"
            value={emiValue}
            onChange={(e) => onTotalMonthlyEmi(e.target.value.replace(/\D/g, ""))}
            placeholder={hasExistingEmi === "yes" ? "e.g. 8000" : "0"}
            readOnly={hasExistingEmi !== "yes"}
            className="min-h-10 min-w-0 flex-1 bg-transparent py-2 pl-9 pr-3 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none read-only:text-gray-500 dark:text-white"
            required={nativeRequired}
          />
        </div>
        {emiAmountError}
      </div>
      </>
      )}
    </>
  );
}
