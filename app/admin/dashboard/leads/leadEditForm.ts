import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { PERSONAL_LOAN_TENURE } from "@/app/config/constants";
import { DEFAULT_LOAN_AMOUNT } from "./leadDisplay";
import {
  type CommissionChoice,
  commissionFromStoredLead,
  commissionValueError,
} from "./leadCommission";
import { validateLeadPincode } from "@/app/lib/leads/leadForm";

export type EditForm = {
  fullName: string;
  mobileNumber: string;
  pan: string;
  category: string;
  status: string;
  requiredAmount: number;
  loanTenureMonths: number;
  insType: string;
  netMonthlyIncome: string;
  pincode: string;
  consentAccepted: boolean;
  commissionType: CommissionChoice;
  commissionValue: string;
  /** False when the lead has no partner. Direct leads do not earn commission. */
  partnerLead: boolean;
};

export function clampLoanAmount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LOAN_AMOUNT;
  return Math.round(n);
}

export function leadToEditForm(lead: AdminLeadRow): EditForm {
  const fromRange = amountFromRange(lead.loan_amt);
  const statusRaw = String(lead.status ?? "pending").trim().toLowerCase() || "pending";
  return {
    fullName: String(lead.full_name ?? ""),
    mobileNumber: String(lead.mobile_number ?? ""),
    pan: String(lead.pan ?? ""),
    category: String(lead.category ?? "personal_loan"),
    status: statusRaw === "action_required" ? "pending" : statusRaw,
    requiredAmount: clampLoanAmount(
      lead.required_amount ?? (fromRange > 0 ? fromRange : DEFAULT_LOAN_AMOUNT),
    ),
    loanTenureMonths: clampTenure(lead.loan_tenure_months),
    insType: String(lead.ins_type ?? "life_insurance"),
    netMonthlyIncome:
      lead.net_monthly_income != null && lead.net_monthly_income !== ""
        ? String(lead.net_monthly_income)
        : "",
    pincode: String(lead.pincode ?? "").replace(/\D/g, "").slice(0, 6),
    ...commissionFromStoredLead(lead),
    partnerLead: Boolean(String(lead.agent_id ?? "").trim()),
    consentAccepted:
      lead.consent_accepted === true ||
      lead.consent_accepted === 1 ||
      lead.consent_accepted === "true",
  };
}

function clampTenure(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n)) return PERSONAL_LOAN_TENURE.DEFAULT_MONTHS;
  return Math.min(
    PERSONAL_LOAN_TENURE.MAX_MONTHS,
    Math.max(PERSONAL_LOAN_TENURE.MIN_MONTHS, n),
  );
}

function amountFromRange(loanAmt: unknown): number {
  const m = String(loanAmt ?? "").trim().match(/^(\d+)_(\d+)$/);
  if (!m) return 0;
  const mid = (Number(m[1]) + Number(m[2])) / 2;
  return Number.isFinite(mid) && mid > 0 ? Math.round(mid) : 0;
}

export function emptyCreateForm(): EditForm {
  return {
    fullName: "",
    mobileNumber: "",
    pan: "",
    category: "personal_loan",
    status: "pending",
    requiredAmount: DEFAULT_LOAN_AMOUNT,
    loanTenureMonths: PERSONAL_LOAN_TENURE.DEFAULT_MONTHS,
    insType: "life_insurance",
    netMonthlyIncome: "",
    pincode: "",
    consentAccepted: false,
    commissionType: "",
    commissionValue: "",
    partnerLead: false,
  };
}

export type FieldErrors = {
  fullName?: string;
  mobileNumber?: string;
  pan?: string;
  netMonthlyIncome?: string;
  pincode?: string;
  insType?: string;
  commissionValue?: string;
  consent?: string;
};

const PHONE_PATTERN = /^[6-9]\d{9}$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PAN_MASK_PATTERN = /^[A-Z]{5}\*{4}[A-Z]$/;
const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export function isMaskedPanValue(value: string): boolean {
  return PAN_MASK_PATTERN.test(value.trim().toUpperCase());
}

export function validateLeadForm(
  form: EditForm,
  opts?: { allowMaskedPan?: boolean; requireConsent?: boolean; requirePincode?: boolean },
): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.fullName.trim();
  if (!/^[A-Za-z][A-Za-z\s.]{1,253}$/.test(name)) {
    errors.fullName = name
      ? "Name should not contain special characters or numbers"
      : "Full name is required";
  }
  if (!PHONE_PATTERN.test(form.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number";
  }
  const pan = form.pan.trim().toUpperCase();
  if (opts?.allowMaskedPan && isMaskedPanValue(pan)) {
    // keep existing encrypted PAN
  } else if (!PAN_PATTERN.test(pan)) {
    errors.pan = "Enter a valid PAN (e.g. ABCDE1234F)";
  }
  if (opts?.requirePincode) {
    const pinErr = validateLeadPincode(form.pincode);
    if (pinErr) errors.pincode = pinErr;
  } else {
    const pin = form.pincode.trim();
    if (pin && !PINCODE_PATTERN.test(pin)) {
      errors.pincode = "Enter a valid 6-digit Indian pincode";
    }
  }
  if (form.category === "personal_loan") {
    const income = Number(form.netMonthlyIncome);
    if (!form.netMonthlyIncome.trim() || !Number.isFinite(income) || income <= 0) {
      errors.netMonthlyIncome = "Enter a valid net monthly income";
    }
  }
  if (form.category === "insurance" && !form.insType.trim()) {
    errors.insType = "Select insurance type";
  }
  if (form.partnerLead && form.status === "approved") {
    const commissionValue = commissionValueError(form.category, form.requiredAmount, form.commissionValue);
    if (commissionValue) errors.commissionValue = commissionValue;
  }
  if (opts?.requireConsent && !form.consentAccepted) {
    errors.consent = "Please tick the checkbox to continue.";
  }
  return errors;
}

export function buildLeadPayload(
  form: EditForm,
  opts?: { omitMaskedPan?: boolean; includeConsent?: boolean; canApprove?: boolean },
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    fullName: form.fullName.trim(),
    mobileNumber: form.mobileNumber.trim(),
    category: form.category,
    pincode: form.pincode.trim() || null,
  };
  if (form.category === "personal_loan") {
    payload.requiredAmount = form.requiredAmount;
    payload.loanTenureMonths = form.loanTenureMonths;
    payload.insType = null;
    payload.loanAmt = null;
    const income = Number(form.netMonthlyIncome);
    payload.netMonthlyIncome = Number.isFinite(income) && income > 0 ? income : null;
  } else if (form.category === "insurance") {
    payload.insType = form.insType;
    payload.requiredAmount = null;
    payload.loanTenureMonths = null;
    payload.loanAmt = null;
    payload.netMonthlyIncome = null;
  }
  const pan = form.pan.trim().toUpperCase();
  if (!(opts?.omitMaskedPan && isMaskedPanValue(pan))) {
    payload.pan = pan;
  }
  if (opts?.includeConsent) {
    payload.consentAccepted = true;
    payload.status = "pending";
  } else if (opts?.canApprove) {
    payload.status = form.status;
    if (form.partnerLead && form.status === "approved") {
      payload.commissionType = form.category === "insurance" ? "fixed" : "percentage";
      const commission = Number(String(form.commissionValue).replace(/,/g, "").trim());
      payload.commissionValue = Number.isFinite(commission) ? commission : null;
    } else {
      payload.commissionType = null;
      payload.commissionValue = null;
    }
  }
  return payload;
}

