/**
 * Shared validation + sanitizers for lead forms (hero modal, service pages).
 * Keeps API payload rules in one place.
 */

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
  { value: "cyber_insurance", label: "Cyber Insurance" },
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self-Employed" },
] as const;

export function loanAmountLabel(value: string): string {
  return LOAN_AMOUNT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function insuranceTypeLabel(value: string): string {
  const found = INSURANCE_TYPE_OPTIONS.find((o) => o.value === value)?.label;
  if (found) return found;
  const v = value.trim();
  if (!v) return value;
  return v.replace(/[_-]/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function employmentTypeLabel(value: string): string {
  return EMPLOYMENT_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export const LEAD_PAN_PATTERN = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
export const LEAD_NAME_PATTERN = /^[a-zA-Z\s.]+$/;
/** India PIN: 6 digits, first digit 1–9 (not 000000 / starting with 0). */
export const LEAD_PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export function sanitizeLeadPanInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase();
}

export function sanitizeLeadNameInput(raw: string): string {
  return raw.replace(/[^a-zA-Z\s.]/g, "");
}

export function sanitizeLeadPincodeInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 6);
}

export type LeadFieldErrors = Partial<{
  pan: string;
  mobile: string;
  fullName: string;
  service: string;
  loanAmt: string;
  insType: string;
  employmentType: string;
  netMonthlyIncome: string;
  pincode: string;
}>;

export function validateLeadPincode(pincode: string): string | undefined {
  const pin = pincode.replace(/\D/g, "");
  if (!pin) return "Pincode is required";
  if (pin.length !== 6) return "Pincode must be 6 digits";
  if (!LEAD_PINCODE_PATTERN.test(pin)) {
    return "Enter a valid Indian pincode (e.g. 302002)";
  }
  return undefined;
}

/** Personal-loan employment + net monthly income (shared apply forms). */
export function validatePersonalLoanEmployment(
  employmentType: string,
  netMonthlyIncome: string,
): Pick<LeadFieldErrors, "employmentType" | "netMonthlyIncome"> {
  const errors: Pick<LeadFieldErrors, "employmentType" | "netMonthlyIncome"> = {};
  if (!employmentType.trim()) {
    errors.employmentType = "Please select employment type";
  } else if (
    employmentType !== "salaried" &&
    employmentType !== "self_employed"
  ) {
    errors.employmentType = "Invalid employment type";
  }

  const incomeNum = Number(String(netMonthlyIncome).replace(/,/g, "").trim());
  if (
    !String(netMonthlyIncome).trim() ||
    !Number.isFinite(incomeNum) ||
    incomeNum <= 0
  ) {
    errors.netMonthlyIncome = "Enter a valid net monthly income";
  }

  return errors;
}

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
