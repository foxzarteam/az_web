import { formatAdminDateTime } from "@/app/lib/format";
import { buildSheetXlsx, datedExportName, downloadXlsx, type SheetCell } from "@/app/lib/admin/xlsxSheet";

type PartnerRow = Record<string, unknown>;

const HEADERS = [
  "Name",
  "Phone",
  "Email",
  "Affiliate code",
  "Active",
  "Logged in",
  "MPIN set",
  "Created",
  "Updated",
  "Last login",
  "Partner ID",
];

const WIDTHS = [24, 14, 28, 16, 12, 12, 12, 20, 20, 20, 38];

function text(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function yesNo(value: unknown): string {
  return value === true || value === 1 || value === "true" ? "Yes" : "No";
}

function dateText(value: unknown): string {
  const shown = formatAdminDateTime(value);
  return shown === "—" ? "" : shown;
}

function partnerRow(row: PartnerRow): SheetCell[] {
  return [
    { kind: "s", value: text(row.user_name) },
    { kind: "s", value: text(row.mobile_number) },
    { kind: "s", value: text(row.email) },
    { kind: "s", value: text(row.referral_code) },
    { kind: "s", value: yesNo(row.is_active !== false) },
    { kind: "s", value: yesNo(row.is_logged_in === true) },
    { kind: "s", value: yesNo(row.has_mpin === true) },
    { kind: "s", value: dateText(row.created_at) },
    { kind: "s", value: dateText(row.updated_at) },
    { kind: "s", value: dateText(row.last_login_at) },
    { kind: "s", value: text(row.id) },
  ];
}

export function downloadPartnersWorkbook(rows: PartnerRow[]) {
  const bytes = buildSheetXlsx({
    sheetName: "Partners",
    headers: HEADERS,
    rows: rows.map(partnerRow),
    widths: WIDTHS,
  });
  downloadXlsx(bytes, datedExportName("partners"));
}
