import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { CrmActionButton, type CrmColumn } from "@/app/components/shared/crm/DataTable";
import {
  STATUSES,
  amountOrInsuranceText,
  categoryLabel,
  cellText,
  statusCapsuleClass,
  statusLabel,
} from "./leadDisplay";

function leadStatus(row: AdminLeadRow): string {
  return String(row.status ?? "pending").trim().toLowerCase() || "pending";
}

function StatusCell({
  row,
  readOnly,
  canApprove,
  saving,
  onChange,
}: {
  row: AdminLeadRow;
  readOnly: boolean;
  canApprove: boolean;
  saving: boolean;
  onChange: (row: AdminLeadRow, status: string) => void;
}) {
  const status = leadStatus(row);
  const locked = readOnly || saving || (!canApprove && status === "approved");
  const options = STATUSES.filter((item) => item.value !== "approved" || canApprove || status === "approved");
  if (locked) {
    return <span className={statusCapsuleClass(status)}>{statusLabel(status)}</span>;
  }
  return (
    <span className="relative inline-flex items-center">
      <select
        aria-label={`Status for ${cellText(row, "full_name")}`}
        value={options.some((item) => item.value === status) ? status : "pending"}
        disabled={saving}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          const next = event.target.value;
          if (next && next !== status) onChange(row, next);
        }}
        className={`${statusCapsuleClass(status)} cursor-pointer appearance-none border-0 py-1 pr-6 pl-2.5 outline-none focus:ring-2 focus:ring-[#4236FB]/30`}
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-1.5 text-current opacity-70"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

export function buildLeadColumns(opts: {
  readOnly: boolean;
  canDelete: boolean;
  canApprove: boolean;
  statusSavingId: string | null;
  onView: (row: AdminLeadRow) => void;
  onEdit: (row: AdminLeadRow) => void;
  onDelete: (row: AdminLeadRow) => void;
  onStatus: (row: AdminLeadRow, status: string) => void;
}): CrmColumn<AdminLeadRow>[] {
  const { readOnly, canDelete, canApprove, statusSavingId, onView, onEdit, onDelete, onStatus } = opts;
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
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => statusLabel(row.status),
      searchValue: (row) => statusLabel(row.status),
      className: "min-w-[9.5rem] whitespace-nowrap",
      cell: (row) => (
        <StatusCell
          row={row}
          readOnly={readOnly}
          canApprove={canApprove}
          saving={statusSavingId === String(row.id ?? "")}
          onChange={onStatus}
        />
      ),
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
