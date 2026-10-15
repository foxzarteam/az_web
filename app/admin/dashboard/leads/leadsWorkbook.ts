import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { formatIpLocationDisplay } from "@/app/lib/admin/formatIpLocation";
import {
  buildSheetXlsx,
  datedExportName,
  downloadXlsx,
  type SheetCell,
} from "@/app/lib/admin/xlsxSheet";
import { employmentTypeLabel, insuranceTypeLabel } from "@/app/lib/leads/leadForm";
import { categoryLabel, statusLabel } from "./leadDisplay";

const HEADERS = [
  "Name",
  "Phone",
  "PAN",
  "Email",
  "Product",
  "Insurance type",
  "Loan amount",
  "Net monthly income",
  "Employment",
  "Pincode",
  "Status",
  "Verified",
  "Consent",
  "Source",
  "Partner",
  "Commission type",
  "Commission value",
  "Location",
  "IP",
  "Notes",
  "Created",
  "Updated",
  "Lead ID",
] as const;

function text(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function yesNo(value: unknown): string {
  return value === true || value === 1 || value === "true" ? "Yes" : "No";
}

function numberOrNull(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function dateText(value: unknown): string {
  const raw = text(value);
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function employmentLabel(value: unknown, category: unknown): string {
  const label = employmentTypeLabel(value, category);
  return label === "—" ? "" : label;
}

function commissionTypeLabel(value: unknown): string {
  const v = text(value);
  if (v === "fixed") return "Fixed";
  if (v === "percentage") return "Percentage";
  return v;
}

function locationText(row: AdminLeadRow): string {
  const shown = formatIpLocationDisplay(
    row.ip as string | null | undefined,
    row.ip_location as string | null | undefined,
  );
  if (!shown || shown === "—") return "";
  const ip = text(row.ip);
  if (ip && shown.endsWith(`(${ip})`)) return shown.slice(0, -(ip.length + 2)).trim();
  return shown;
}

function leadRow(row: AdminLeadRow): SheetCell[] {
  const amount = numberOrNull(row.required_amount);
  const income = numberOrNull(row.net_monthly_income);
  const commission = numberOrNull(row.commission_value);
  return [
    { kind: "s", value: text(row.full_name) },
    { kind: "s", value: text(row.mobile_number) },
    { kind: "s", value: text(row.pan).toUpperCase() },
    { kind: "s", value: text(row.email) },
    { kind: "s", value: text(row.category) ? categoryLabel(row.category) : "" },
    { kind: "s", value: text(row.ins_type) ? insuranceTypeLabel(String(row.ins_type)) : "" },
    amount == null ? { kind: "s", value: "" } : { kind: "n", value: amount },
    income == null ? { kind: "s", value: "" } : { kind: "n", value: income },
    { kind: "s", value: employmentLabel(row.employment_type, row.category) },
    { kind: "s", value: text(row.pincode) },
    { kind: "s", value: text(row.status) ? statusLabel(row.status) : "" },
    { kind: "s", value: yesNo(row.otp_verified) },
    { kind: "s", value: yesNo(row.consent_accepted) },
    { kind: "s", value: text(row.lead_source) },
    { kind: "s", value: text(row.partner_name) },
    { kind: "s", value: commissionTypeLabel(row.commission_type) },
    commission == null ? { kind: "s", value: "" } : { kind: "n", value: commission },
    { kind: "s", value: locationText(row) },
    { kind: "s", value: text(row.ip) },
    { kind: "s", value: text(row.notes) },
    { kind: "s", value: dateText(row.created_at) },
    { kind: "s", value: dateText(row.updated_at) },
    { kind: "s", value: text(row.id) },
  ];
}

const WIDTHS = [22, 14, 16, 28, 18, 18, 16, 20, 16, 12, 16, 12, 12, 22, 18, 18, 18, 28, 18, 28, 22, 22, 38];

export function buildLeadsXlsx(rows: AdminLeadRow[]): Uint8Array {
  return buildSheetXlsx({
    sheetName: "Leads",
    headers: [...HEADERS],
    rows: rows.map(leadRow),
    widths: WIDTHS,
  });
}

export function downloadLeadsWorkbook(rows: AdminLeadRow[], filePrefix = "leads") {
  downloadXlsx(buildLeadsXlsx(rows), datedExportName(filePrefix));
}
