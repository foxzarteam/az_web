import type { CreateLeadRequest } from "@/app/lib/leads/types";
import {
  validateLeadPanNameMobile,
  validatePersonalLoanEmployment,
  type LeadFieldErrors,
} from "@/app/utils/leadForm";
import { PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";

export type PersonalLoanFormValues = {
  pan: string;
  mobile: string;
  fullName: string;
  loanAmount: number;
  employmentType: string;
  netMonthlyIncome: string;
};

/** Client validation for personal loan apply forms (hero + product page). */
export function validatePersonalLoanApplyForm(
  values: PersonalLoanFormValues,
): LeadFieldErrors {
  const errors: LeadFieldErrors = validateLeadPanNameMobile({
    pan: values.pan,
    mobileDigits: values.mobile.replace(/\D/g, ""),
    fullName: values.fullName,
  });

  if (
    values.loanAmount < PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT ||
    values.loanAmount > PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT
  ) {
    errors.loanAmt = `Loan amount must be between ₹${PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT.toLocaleString("en-IN")} and ₹${PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT.toLocaleString("en-IN")}`;
  }

  Object.assign(
    errors,
    validatePersonalLoanEmployment(values.employmentType, values.netMonthlyIncome),
  );

  return errors;
}

export function personalLoanApplyPayload(
  values: PersonalLoanFormValues,
): CreateLeadRequest {
  const incomeNum = Number(String(values.netMonthlyIncome).replace(/,/g, ""));
  return {
    pan: values.pan.trim().toUpperCase(),
    mobileNumber: values.mobile.replace(/\D/g, ""),
    fullName: values.fullName.trim(),
    category: "personal_loan",
    requiredAmount: values.loanAmount,
    employmentType: values.employmentType as "salaried" | "self_employed",
    netMonthlyIncome: incomeNum,
  };
}

export function firstLeadFieldError(errors: LeadFieldErrors): string | undefined {
  return Object.values(errors).find((v) => typeof v === "string" && v.trim());
}
