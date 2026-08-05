import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { formatIpLocationDisplay } from "@/app/lib/admin/formatIpLocation";
import {
  employmentTypeLabel,
  insuranceTypeLabel,
  loanAmountLabel,
} from "@/app/utils/leadForm";

export const DEFAULT_LOAN_AMOUNT = 5_00_000;

export const CATEGORIES = [
  { value: "personal_loan", label: "Personal Loan" },
  { value: "insurance", label: "Insurance" },
] as const;

export const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_process", label: "In process" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "action_required", label: "Action required" },
] as const;

export const VIEW_FIELDS = [
  "full_name",
  "mobile_number",
  "pan",
  "category",
  "status",
  "otp_verified",
  "required_amount",
  "employment_type",
  "net_monthly_income",
  "pincode",
  "ip",
  "is_active",
  "created_at",
  "updated_at",
] as const;

export const FIELD_LABELS: Record<string, string> = {
  id: "ID",
  user_id: "User ID",
  pan: "PAN",
  mobile_number: "Phone",
  full_name: "Name",
  email: "Email",
  pincode: "Pincode",
  required_amount: "Loan amount",
  employment_type: "Employment type",
  net_monthly_income: "Net monthly income",
  ip: "Location",
  ip_location: "Location",
  loan_amt: "Loan amount range (legacy)",
  ins_type: "Insurance type",
  category: "Product",
  status: "Status",
  otp_verified: "Verified",
  notes: "Notes",
  is_active: "Active",
  created_at: "Created",
  updated_at: "Updated",
};

export function categoryLabel(value: unknown): string {
  const v = String(value ?? "");
  const found = CATEGORIES.find((c) => c.value === v)?.label;
  if (found) return found;
  return v ? v.replace(/_/g, " ") : "—";
}

export function formatCurrencyInr(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** Admin: City, Region, Country (x.x.x.x) — location first, IP in brackets. */
export function formatIpLocationCell(row: Pick<AdminLeadRow, "ip" | "ip_location"> | AdminLeadRow): string {
  return formatIpLocationDisplay(
    row.ip as string | null | undefined,
    row.ip_location as string | null | undefined,
  );
}

export function formatValue(key: string, value: unknown, row?: AdminLeadRow): string {
  if (key === "ip" || key === "ip_location") {
    if (row) return formatIpLocationCell(row);
    if (value == null || value === "") return "—";
    return String(value);
  }
  if (key === "otp_verified") {
    return value === true || value === 1 || value === "true" ? "Yes" : "No";
  }
  if (key === "required_amount" || key === "net_monthly_income") {
    if (value == null || value === "") return "—";
    return formatCurrencyInr(value);
  }
  if (value == null || value === "") return "—";
  if (key === "category") return categoryLabel(value);
  if (key === "employment_type") return employmentTypeLabel(String(value));
  if (key === "loan_amt") return loanAmountLabel(String(value));
  if (key === "ins_type") return insuranceTypeLabel(String(value));
  if (key === "status") return String(value).replace(/_/g, " ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    }
  }
  return s;
}

export function isOtpVerified(row: AdminLeadRow): boolean {
  return row.otp_verified === true || row.otp_verified === 1 || row.otp_verified === "true";
}

export function cellText(row: AdminLeadRow, key: "full_name" | "mobile_number" | "category"): string {
  if (key === "category") return categoryLabel(row[key]);
  const v = row[key];
  if (v == null || v === "") return "—";
  return String(v);
}

export function amountOrInsuranceText(row: AdminLeadRow): string {
  const category = String(row.category ?? "");
  if (category === "insurance") {
    return row.ins_type ? insuranceTypeLabel(String(row.ins_type)) : "—";
  }
  if (category === "personal_loan") {
    if (row.required_amount != null && row.required_amount !== "") {
      return formatCurrencyInr(row.required_amount);
    }
    if (row.loan_amt) return loanAmountLabel(String(row.loan_amt));
  }
  if (row.required_amount != null && row.required_amount !== "") {
    return formatCurrencyInr(row.required_amount);
  }
  if (row.loan_amt) return loanAmountLabel(String(row.loan_amt));
  if (row.ins_type) return insuranceTypeLabel(String(row.ins_type));
  return "—";
}
