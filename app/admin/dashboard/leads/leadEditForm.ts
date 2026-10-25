import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { DEFAULT_LOAN_AMOUNT } from "./leadDisplay";
import {
  type CommissionChoice,
  commissionFromStoredLead,
  commissionValueError,
} from "./leadCommission";
import {
  employmentTypeForForm,
  isVehicleLoanCategory,
  loanNotEligibleMessage,
  netMonthlyIncomeError,
  validateLeadPincode,
  validateLoanFinishStep,
} from "@/app/lib/leads/leadForm";

export type EditForm = {
  fullName: string;
  mobileNumber: string;
  pan: string;
  category: string;
  status: string;
  requiredAmount: number;
  insType: string;
  netMonthlyIncome: string;
  employmentType: string;
  cibilBand: string;
  vehicleCategory: string;
  hasExistingEmi: "" | "yes" | "no";
  totalMonthlyEmi: string;
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
    insType: String(lead.ins_type ?? "life_insurance"),
    netMonthlyIncome:
      lead.net_monthly_income != null && lead.net_monthly_income !== ""
        ? String(lead.net_monthly_income)
        : "",
    employmentType: isVehicleLoanCategory(lead.category)
      ? ""
      : employmentTypeForForm(lead.employment_type, lead.category),
    cibilBand: String(lead.cibil_band ?? ""),
    vehicleCategory: String(lead.vehicle_category ?? ""),
    hasExistingEmi:
      lead.has_existing_emi === true || lead.has_existing_emi === "true"
        ? "yes"
        : lead.has_existing_emi === false || lead.has_existing_emi === "false"
          ? "no"
          : "",
    totalMonthlyEmi:
      lead.total_monthly_emi != null && lead.total_monthly_emi !== "" ? String(lead.total_monthly_emi) : "",
    pincode: String(lead.pincode ?? "").replace(/\D/g, "").slice(0, 6),
    ...commissionFromStoredLead(lead),
    partnerLead: Boolean(String(lead.agent_id ?? "").trim()),
    consentAccepted:
      lead.consent_accepted === true ||
      lead.consent_accepted === 1 ||
      lead.consent_accepted === "true",
  };
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
    requiredAmount: 0,
    insType: "life_insurance",
    netMonthlyIncome: "",
    employmentType: "",
    cibilBand: "",
    vehicleCategory: "",
    hasExistingEmi: "",
    totalMonthlyEmi: "",
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
  employmentType?: string;
  cibilBand?: string;
  vehicleCategory?: string;
  hasExistingEmi?: string;
  totalMonthlyEmi?: string;
  pincode?: string;
  requiredAmount?: string;
  insType?: string;
  commissionValue?: string;
  consent?: string;
};

function isLoanFormCategory(category: string): boolean {
  return category.trim().toLowerCase().endsWith("_loan");
}

const PHONE_PATTERN = /^[6-9]\d{9}$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PAN_MASK_PATTERN = /^[A-Z]{5}\*{4}[A-Z]$/;
const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export function isMaskedPanValue(value: string): boolean {
  return PAN_MASK_PATTERN.test(value.trim().toUpperCase());
}

export function validateLeadForm(
  form: EditForm,
  opts?: { allowMaskedPan?: boolean; requireConsent?: boolean; requirePincode?: boolean; requireLoanProfile?: boolean },
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
  if (isLoanFormCategory(form.category)) {
    const vehicle = isVehicleLoanCategory(form.category);
    if (!Number.isFinite(form.requiredAmount) || form.requiredAmount <= 0) {
      errors.requiredAmount = "Enter the loan amount";
    }
    if (vehicle || opts?.requireLoanProfile) {
      Object.assign(
        errors,
        validateLoanFinishStep({
          netMonthlyIncome: form.netMonthlyIncome,
          employmentType: vehicle ? "" : form.employmentType,
          cibilBand: form.cibilBand,
          hasExistingEmi: vehicle ? "no" : form.hasExistingEmi,
          totalMonthlyEmi: vehicle ? "0" : form.totalMonthlyEmi,
          vehicle,
        }),
      );
      if (vehicle && !form.vehicleCategory.trim()) {
        errors.vehicleCategory = "Select vehicle category";
      }
    } else {
      const incomeErr = netMonthlyIncomeError(form.netMonthlyIncome);
      if (incomeErr) errors.netMonthlyIncome = incomeErr;
    }
    if (
      !vehicle &&
      !opts?.requireLoanProfile &&
      form.employmentType !== "salaried" &&
      form.employmentType !== "salaried_bank" &&
      form.employmentType !== "salaried_cash" &&
      form.employmentType !== "self_employed"
    ) {
      errors.employmentType = "Select salaried or self employee / business";
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

/** Popup text when the lead must not be saved. Personal-loan edits skip this. */
export function leadIneligibleMessage(form: EditForm): string | null {
  if (!isLoanFormCategory(form.category)) return null;
  const vehicle = isVehicleLoanCategory(form.category);
  return loanNotEligibleMessage({
    category: form.category,
    netMonthlyIncome: Number(form.netMonthlyIncome),
    cibilBand: form.cibilBand,
    hasExistingEmi: vehicle ? false : form.hasExistingEmi === "yes",
    totalMonthlyEmi: vehicle || form.hasExistingEmi === "no" ? 0 : Number(form.totalMonthlyEmi),
  });
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
  if (isLoanFormCategory(form.category)) {
    payload.requiredAmount = form.requiredAmount > 0 ? form.requiredAmount : null;
    payload.insType = null;
    payload.loanAmt = null;
    const income = Number(form.netMonthlyIncome);
    payload.netMonthlyIncome = Number.isFinite(income) && income > 0 ? income : null;
    if (isVehicleLoanCategory(form.category)) {
      payload.employmentType = null;
      payload.vehicleCategory = form.vehicleCategory.trim();
      payload.cibilBand = form.cibilBand;
      payload.hasExistingEmi = false;
      payload.totalMonthlyEmi = 0;
    } else {
      payload.employmentType = form.employmentType;
      if (opts?.includeConsent) {
        payload.cibilBand = form.cibilBand;
        payload.hasExistingEmi = form.hasExistingEmi === "yes";
        payload.totalMonthlyEmi = form.hasExistingEmi === "no" ? 0 : Number(form.totalMonthlyEmi);
      }
    }
  } else if (form.category === "insurance") {
    payload.insType = form.insType;
    payload.requiredAmount = null;
    payload.loanAmt = null;
    payload.netMonthlyIncome = null;
    payload.employmentType = null;
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

