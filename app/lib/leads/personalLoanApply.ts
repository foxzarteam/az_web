import type { CreateLeadRequest } from "@/app/lib/leads/types";
import {
  validateLeadPanNameMobile,
  validateLeadPincode,
  validateLoanFinishStep,
  type LeadFieldErrors,
} from "@/app/lib/leads/leadForm";
import { PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";

export type PersonalLoanFormValues = {
  pan: string;
  mobile: string;
  fullName: string;
  pincode: string;
  loanAmount: number;
  netMonthlyIncome: string;
  cibilBand: string;
  employmentType?: string;
  hasExistingEmi: string;
  totalMonthlyEmi: string;
};

/** Client validation for personal loan apply forms (hero + product page). */
export function validatePersonalLoanApplyForm(
  values: PersonalLoanFormValues,
  bounds?: { min: number; max: number },
  vehicle = false,
): LeadFieldErrors {
  const errors: LeadFieldErrors = validateLeadPanNameMobile({
    pan: values.pan,
    mobileDigits: values.mobile.replace(/\D/g, ""),
    fullName: values.fullName,
  });

  const pinErr = validateLeadPincode(values.pincode);
  if (pinErr) errors.pincode = pinErr;

  const minAmount = bounds?.min ?? PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT;
  const maxAmount = bounds?.max ?? PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT;
  if (values.loanAmount < minAmount) {
    errors.loanAmt = `Enter at least ₹${minAmount.toLocaleString("en-IN")}`;
  } else if (values.loanAmount > maxAmount) {
    errors.loanAmt = `Enter up to ₹${maxAmount.toLocaleString("en-IN")}`;
  }

  Object.assign(errors, validateLoanFinishStep({ ...values, vehicle }));

  return errors;
}

export function personalLoanApplyPayload(
  values: PersonalLoanFormValues,
): CreateLeadRequest {
  const incomeNum = Number(String(values.netMonthlyIncome).replace(/,/g, ""));
  const noEmi = values.hasExistingEmi === "no";
  const emiNum = noEmi ? 0 : Number(String(values.totalMonthlyEmi).replace(/,/g, ""));
  return {
    pan: values.pan.trim().toUpperCase(),
    mobileNumber: values.mobile.replace(/\D/g, ""),
    fullName: values.fullName.trim(),
    pincode: values.pincode.replace(/\D/g, ""),
    category: "personal_loan",
    requiredAmount: values.loanAmount,
    netMonthlyIncome: incomeNum,
    cibilBand: values.cibilBand,
    ...(values.employmentType ? { employmentType: values.employmentType } : {}),
    hasExistingEmi: values.hasExistingEmi === "yes",
    totalMonthlyEmi: emiNum,
    consentAccepted: true,
  };
}

export function firstLeadFieldError(errors: LeadFieldErrors): string | undefined {
  return Object.values(errors).find((v) => typeof v === "string" && v.trim());
}
