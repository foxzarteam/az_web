/**
 * Shared validation + sanitizers for lead forms (hero modal, service pages).
 * Keeps API payload rules in one place.
 */

import { mapServiceToCategory } from "@/app/utils/leadApi";

export const LOAN_AMOUNT_OPTIONS = [
  { value: "25000_100000", label: "₹25,000 - ₹1,00,000" },
  { value: "100000_200000", label: "₹1,00,000 - ₹2,00,000" },
  { value: "200000_300000", label: "₹2,00,000 - ₹3,00,000" },
  { value: "300000_400000", label: "₹3,00,000 - ₹4,00,000" },
  { value: "400000_500000", label: "₹4,00,000 - ₹5,00,000" },
  { value: "500000_600000", label: "₹5,00,000 - ₹6,00,000" },
  { value: "600000_700000", label: "₹6,00,000 - ₹7,00,000" },
  { value: "700000_800000", label: "₹7,00,000 - ₹8,00,000" },
  { value: "800000_900000", label: "₹8,00,000 - ₹9,00,000" },
  { value: "900000_1000000", label: "₹9,00,000 - ₹10,00,000" },
] as const;

export const INSURANCE_TYPE_OPTIONS = [
  { value: "life_insurance", label: "Life Insurance" },
  { value: "health_insurance", label: "Health Insurance" },
  { value: "motor_insurance", label: "Motor Insurance" },
] as const;

export function loanAmountLabel(value: string): string {
  return LOAN_AMOUNT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function insuranceTypeLabel(value: string): string {
  return INSURANCE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export const LEAD_PAN_PATTERN = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
export const LEAD_NAME_PATTERN = /^[a-zA-Z\s.]+$/;

export function sanitizeLeadPanInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase();
}

export function sanitizeLeadNameInput(raw: string): string {
  return raw.replace(/[^a-zA-Z\s.]/g, "");
}

export function sanitizeLeadAadhaarInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 12);
}

export type LeadFieldErrors = Partial<{
  pan: string;
  mobile: string;
  fullName: string;
  aadhaar: string;
  service: string;
  loanAmt: string;
  insType: string;
}>;

export function validateLeadPanNameMobile(params: {
  pan: string;
  mobileDigits: string;
  fullName: string;
}): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  const panTrim = params.pan.trim().toUpperCase();
  if (!panTrim) errors.pan = "PAN is required";
  else if (!LEAD_PAN_PATTERN.test(panTrim)) {
    errors.pan = "Invalid PAN (e.g. ABCDE1234F – 5 letters, 4 digits, 1 letter)";
  }

  const m = params.mobileDigits.replace(/\D/g, "");
  if (!m) errors.mobile = "Mobile number is required";
  else if (m.length !== 10) errors.mobile = "Enter a valid 10-digit mobile number";
  else if (!/^[6-9]/.test(m)) {
    errors.mobile = "Mobile number must start with 6, 7, 8, or 9";
  }

  const n = params.fullName.trim();
  if (!n) errors.fullName = "Full name is required";
  else if (!LEAD_NAME_PATTERN.test(n)) {
    errors.fullName = "Name should not contain special characters or numbers";
  }

  return errors;
}

export function validateLeadApplicantDetails(params: {
  pan: string;
  mobileDigits: string;
  fullName: string;
  aadhaar: string;
  service: string;
  loanAmt?: string;
  insType?: string;
}): LeadFieldErrors {
  const errors = validateLeadPanNameMobile(params);

  const a = params.aadhaar.replace(/\D/g, "");
  if (!a) errors.aadhaar = "Aadhaar is required";
  else if (a.length !== 12) errors.aadhaar = "Enter valid 12-digit Aadhaar number";

  if (!params.service.trim()) errors.service = "Please select a product";

  const category = mapServiceToCategory(params.service);
  if (category === "personal_loan" && !params.loanAmt?.trim()) {
    errors.loanAmt = "Please select loan amount range";
  }
  if (category === "insurance" && !params.insType?.trim()) {
    errors.insType = "Please select insurance type";
  }

  return errors;
}
