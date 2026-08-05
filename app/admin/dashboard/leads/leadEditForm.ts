import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";
import { DEFAULT_LOAN_AMOUNT } from "./leadDisplay";

export type EditForm = {
  fullName: string;
  mobileNumber: string;
  pan: string;
  category: string;
  status: string;
  requiredAmount: number;
  insType: string;
  employmentType: string;
  netMonthlyIncome: string;
  pincode: string;
};

export function clampLoanAmount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_LOAN_AMOUNT;
  return Math.min(
    PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT,
    Math.max(PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT, Math.round(n)),
  );
}

export function leadToEditForm(lead: AdminLeadRow): EditForm {
  return {
    fullName: String(lead.full_name ?? ""),
    mobileNumber: String(lead.mobile_number ?? ""),
    pan: String(lead.pan ?? ""),
    category: String(lead.category ?? "personal_loan"),
    status: String(lead.status ?? "pending"),
    requiredAmount: clampLoanAmount(lead.required_amount ?? DEFAULT_LOAN_AMOUNT),
    insType: String(lead.ins_type ?? "life_insurance"),
    employmentType: String(lead.employment_type ?? ""),
    netMonthlyIncome:
      lead.net_monthly_income != null && lead.net_monthly_income !== ""
        ? String(lead.net_monthly_income)
        : "",
    pincode: String(lead.pincode ?? "").replace(/\D/g, "").slice(0, 6),
  };
}

export function emptyCreateForm(): EditForm {
  return {
    fullName: "",
    mobileNumber: "",
    pan: "",
    category: "personal_loan",
    status: "pending",
    requiredAmount: DEFAULT_LOAN_AMOUNT,
    insType: "life_insurance",
    employmentType: "",
    netMonthlyIncome: "",
    pincode: "",
  };
}

export type FieldErrors = {
  mobileNumber?: string;
  pan?: string;
  employmentType?: string;
  netMonthlyIncome?: string;
  pincode?: string;
};

const PHONE_PATTERN = /^[6-9]\d{9}$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PAN_MASK_PATTERN = /^[A-Z]{5}\*{4}[A-Z]$/;
const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export function isMaskedPanValue(value: string): boolean {
  return PAN_MASK_PATTERN.test(value.trim().toUpperCase());
}

export function validateLeadForm(form: EditForm, opts?: { allowMaskedPan?: boolean }): FieldErrors {
  const errors: FieldErrors = {};
  if (!PHONE_PATTERN.test(form.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number";
  }
  const pan = form.pan.trim().toUpperCase();
  if (opts?.allowMaskedPan && isMaskedPanValue(pan)) {
    // keep existing encrypted PAN
  } else if (!PAN_PATTERN.test(pan)) {
    errors.pan = "Enter a valid PAN (e.g. ABCDE1234F)";
  }
  const pin = form.pincode.trim();
  if (pin && !PINCODE_PATTERN.test(pin)) {
    errors.pincode = "Enter a valid 6-digit Indian pincode";
  }
  if (form.category === "personal_loan") {
    if (!form.employmentType) {
      errors.employmentType = "Select employment type";
    }
    const income = Number(form.netMonthlyIncome);
    if (!form.netMonthlyIncome.trim() || !Number.isFinite(income) || income <= 0) {
      errors.netMonthlyIncome = "Enter a valid net monthly income";
    }
  }
  return errors;
}

