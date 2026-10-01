import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { CrmActionButton, type CrmColumn } from "@/app/components/shared/crm/DataTable";
import {
  amountOrInsuranceText,
  categoryLabel,
  cellText,
  isConsentAccepted,
  isOtpVerified,
} from "./leadDisplay";

const yesClass =
  "inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
const noClass =
  "inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300";

function YesNo({ on }: { on: boolean }) {
  return <span className={on ? yesClass : noClass}>{on ? "Yes" : "No"}</span>;
}

export function buildLeadColumns(opts: {
  readOnly: boolean;
  canDelete: boolean;
  onView: (row: AdminLeadRow) => void;
  onEdit: (row: AdminLeadRow) => void;
  onDelete: (row: AdminLeadRow) => void;
}): CrmColumn<AdminLeadRow>[] {
  const { readOnly, canDelete, onView, onEdit, onDelete } = opts;
  return [
    {
      id: "full_name",
      header: "Name",
      sortable: true,
      sortValue: (row) => String(row.full_name ?? ""),
      searchValue: (row) => cellText(row, "full_name"),
      className: "min-w-[8rem] font-medium whitespace-nowrap",
      cell: (row) => cellText(row, "full_name"),
    },
    {
      id: "mobile_number",
      header: "Phone",
      sortable: true,
      sortValue: (row) => String(row.mobile_number ?? ""),
      searchValue: (row) => cellText(row, "mobile_number"),
      className: "min-w-[8rem] whitespace-nowrap",
      cell: (row) => cellText(row, "mobile_number"),
    },
    {
      id: "category",
      header: "Product",
      sortable: true,
      sortValue: (row) => categoryLabel(row.category),
      searchValue: (row) => cellText(row, "category"),
      className: "min-w-[9rem] whitespace-nowrap",
      cell: (row) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#1E3A8A] dark:bg-blue-950/40 dark:text-blue-200">
          {cellText(row, "category")}
        </span>
      ),
    },
    {
      id: "amount",
      header: "Amount / Type",
      sortable: true,
      sortValue: (row) => {
        if (row.required_amount != null && row.required_amount !== "") {
          const n = Number(row.required_amount);
          return Number.isFinite(n) ? n : 0;
        }
        return amountOrInsuranceText(row);
      },
      searchValue: (row) => amountOrInsuranceText(row),
      className: "min-w-[8rem] whitespace-nowrap",
      cell: (row) => amountOrInsuranceText(row),
    },
    {
      id: "otp_verified",
      header: "Verified",
      sortable: true,
      sortValue: (row) => (isOtpVerified(row) ? 1 : 0),
      searchValue: (row) => (isOtpVerified(row) ? "yes verified" : "no unverified"),
      className: "min-w-[6rem] whitespace-nowrap",
      cell: (row) => <YesNo on={isOtpVerified(row)} />,
    },
    {
      id: "consent_accepted",
      header: "Consent",
      sortable: true,
      sortValue: (row) => (isConsentAccepted(row) ? 1 : 0),
      searchValue: (row) => (isConsentAccepted(row) ? "yes consent" : "no consent"),
      className: "min-w-[6rem] whitespace-nowrap",
      cell: (row) => <YesNo on={isConsentAccepted(row)} />,
    },
    {
      id: "actions",
      header: "Action",
      searchable: false,
      className: "min-w-[8.5rem] whitespace-nowrap",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <CrmActionButton label="View" variant="view" onClick={() => onView(row)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </CrmActionButton>
          {!readOnly ? (
            <>
              <CrmActionButton label="Edit" onClick={() => onEdit(row)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </CrmActionButton>
              {canDelete ? (
                <CrmActionButton label="Delete" variant="danger" onClick={() => onDelete(row)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </CrmActionButton>
              ) : null}
            </>
          ) : null}
        </div>
      ),
    },
  ];
}
