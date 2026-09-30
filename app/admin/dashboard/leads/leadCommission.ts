/** Partner commission chosen by an admin when a lead is approved. */

export const COMMISSION_LIMITS = {
  percentMin: 0.1,
  percentMax: 10,
  fixedMin: 100,
  fixedMax: 30_000,
} as const;

export type CommissionChoice = "" | "percentage" | "fixed";

export function isInsuranceCategory(category: unknown): boolean {
  return String(category ?? "").trim().toLowerCase().replace(/-/g, "_") === "insurance";
}

export function lockedCommissionType(category: unknown): Exclude<CommissionChoice, ""> {
  return isInsuranceCategory(category) ? "fixed" : "percentage";
}

export function formLoanAmount(category: unknown, requiredAmount: unknown): number {
  if (isInsuranceCategory(category)) return 0;
  const n = Number(requiredAmount);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function parseAmount(raw: unknown): number {
  return Number(String(raw ?? "").replace(/,/g, "").trim());
}

function loanBase(requiredAmount: unknown, loanAmt?: unknown): number {
  const exact = Number(requiredAmount);
  if (Number.isFinite(exact) && exact > 0) return exact;
  const match = String(loanAmt ?? "").trim().match(/^(\d+)_(\d+)$/);
  if (!match) return 0;
  const mid = (Number(match[1]) + Number(match[2])) / 2;
  return Number.isFinite(mid) && mid > 0 ? mid : 0;
}

/** Rupees credited for one lead. Older rows without a saved choice keep 2% / ₹1,000. */
export function partnerCommissionRupees(lead: {
  category?: unknown;
  required_amount?: unknown;
  loan_amt?: unknown;
  commission_type?: unknown;
  commission_value?: unknown;
}): number {
  const insurance = isInsuranceCategory(lead.category);
  const base = insurance ? 0 : loanBase(lead.required_amount, lead.loan_amt);
  const type = String(lead.commission_type ?? "").trim().toLowerCase();
  const value = Number(lead.commission_value);
  const { percentMin, percentMax, fixedMin, fixedMax } = COMMISSION_LIMITS;
  if (!insurance && type === "percentage" && value >= percentMin && value <= percentMax && base > 0) {
    return Math.round(base * (value / 100) * 100) / 100;
  }
  if (insurance && type === "fixed" && value >= fixedMin && value <= fixedMax) {
    return Math.round(value * 100) / 100;
  }
  if (insurance) return 1000;
  if (base <= 0) return 0;
  return Math.round(base * 0.02 * 100) / 100;
}

export function commissionValueError(
  category: unknown,
  requiredAmount: unknown,
  raw: unknown,
): string | undefined {
  const value = parseAmount(raw);
  const { percentMin, percentMax, fixedMin, fixedMax } = COMMISSION_LIMITS;
  if (isInsuranceCategory(category)) {
    if (!Number.isFinite(value) || value < fixedMin || value > fixedMax) {
      return `Enter a fixed amount from ₹${fixedMin.toLocaleString("en-IN")} to ₹${fixedMax.toLocaleString("en-IN")}`;
    }
    return undefined;
  }
  if (!Number.isFinite(value) || value < percentMin || value > percentMax) {
    return `Enter a percentage from ${percentMin} to ${percentMax}`;
  }
  if (formLoanAmount(category, requiredAmount) <= 0) {
    return "Enter the loan amount before setting a percentage";
  }
  return undefined;
}

export function commissionPreviewRupees(
  category: unknown,
  requiredAmount: unknown,
  raw: unknown,
): number | null {
  if (commissionValueError(category, requiredAmount, raw)) return null;
  const value = parseAmount(raw);
  if (isInsuranceCategory(category)) return value;
  const loan = formLoanAmount(category, requiredAmount);
  return Math.round(loan * (value / 100) * 100) / 100;
}

export function commissionFromStoredLead(lead: {
  category?: unknown;
  status?: unknown;
  commission_type?: unknown;
  commission_value?: unknown;
}): { commissionType: CommissionChoice; commissionValue: string } {
  const type = lockedCommissionType(lead.category);
  const raw = lead.commission_value;
  const stored = String(lead.commission_type ?? "").trim().toLowerCase();
  if (
    stored === type &&
    raw != null &&
    String(raw).trim() !== "" &&
    !commissionValueError(lead.category, 1, raw)
  ) {
    return { commissionType: type, commissionValue: String(raw) };
  }
  if (String(lead.status ?? "").trim().toLowerCase() !== "approved") {
    return { commissionType: "", commissionValue: "" };
  }
  return type === "fixed"
    ? { commissionType: "fixed", commissionValue: "1000" }
    : { commissionType: "percentage", commissionValue: "2" };
}
