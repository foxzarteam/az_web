"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CustomerLead } from "@/app/lib/customer/leadsByMobile";
import { insuranceTypeLabel } from "@/app/utils/leadForm";
import CrmDataTable, {
  CrmActionButton,
  type CrmColumn,
} from "@/app/components/shared/crm/DataTable";
import AppModal from "@/app/components/shared/crm/AppModal";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

function formatInr(amount: number | null): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    personal_loan: "Personal Loan",
    home_loan: "Home Loan",
    business_loan: "Business Loan",
    credit_card: "Credit Card",
    insurance: "Insurance",
    vehicle_loan: "Vehicle Loan",
  };
  return map[category] || category.replace(/_/g, " ");
}

function statusMeta(status: string): {
  label: string;
  badge: string;
  step: number;
} {
  const s = status.toLowerCase();
  if (s === "approved") {
    return { label: "Approved", badge: "bg-emerald-100 text-emerald-800", step: 3 };
  }
  if (s === "rejected") {
    return { label: "Not Approved", badge: "bg-red-100 text-red-800", step: 3 };
  }
  return { label: "Under Review", badge: "bg-amber-100 text-amber-900", step: 2 };
}

function Timeline({ lead }: { lead: CustomerLead }) {
  const meta = statusMeta(lead.status);
  const steps = [
    { key: "submitted", label: "Submitted", done: true },
    { key: "review", label: "Under Review", done: meta.step >= 2 },
    {
      key: "decision",
      label:
        lead.status === "rejected"
          ? "Not Approved"
          : lead.status === "approved"
            ? "Approved"
            : "Decision",
      done: meta.step >= 3,
    },
  ];

  return (
    <ol className="mt-4 space-y-0">
      {steps.map((step, i) => {
        const active = step.done && (i === steps.length - 1 ? meta.step >= 3 : true);
        const current = (meta.step === 2 && i === 1) || (meta.step === 3 && i === 2);
        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step.done
                    ? lead.status === "rejected" && i === 2
                      ? "bg-red-500 text-white"
                      : lead.status === "approved" && i === 2
                        ? "bg-emerald-500 text-white"
                        : "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={`my-1 min-h-[1.25rem] w-0.5 flex-1 ${
                    steps[i + 1]?.done ? "bg-primary/40" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <div className={`pb-4 ${current ? "font-semibold" : ""}`}>
              <p
                className={`text-sm ${
                  active || current ? "text-midnight_text" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {i === 0 && (
                <p className="mt-0.5 text-xs text-gray-500">{formatDate(lead.created_at)}</p>
              )}
              {i === 2 && meta.step >= 3 && (
                <p className="mt-0.5 text-xs text-gray-500">
                  Updated {formatDate(lead.updated_at || lead.created_at)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function CustomerApplicationsTable({
  initialApplications,
}: {
  initialApplications: CustomerLead[];
}) {
  const [rows, setRows] = useState(initialApplications);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewLead, setViewLead] = useState<CustomerLead | null>(null);

  useEffect(() => {
    setRows(initialApplications);
  }, [initialApplications]);

  const closeModals = useCallback(() => {
    setViewLead(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    if (viewLead) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [viewLead, closeModals]);

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    if (statusFilter === "pending") {
      return rows.filter((r) => r.status === "pending" || !r.status);
    }
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  const total = rows.length;
  const pending = rows.filter((a) => a.status === "pending" || !a.status).length;
  const approved = rows.filter((a) => a.status === "approved").length;

  const columns = useMemo<CrmColumn<CustomerLead>[]>(
    () => [
      {
        id: "applicationNumber",
        header: "Application",
        sortable: true,
        sortValue: (row) => row.applicationNumber,
        searchValue: (row) => row.applicationNumber,
        cell: (row) => (
          <span className="font-mono text-sm font-semibold text-midnight_text">
            {row.applicationNumber}
          </span>
        ),
      },
      {
        id: "category",
        header: "Product",
        sortable: true,
        sortValue: (row) => categoryLabel(row.category),
        searchValue: (row) => categoryLabel(row.category),
        cell: (row) => categoryLabel(row.category),
      },
      {
        id: "amount",
        header: "Amount / Type",
        sortable: true,
        sortValue: (row) => {
          if (row.category === "insurance") {
            return row.ins_type ? insuranceTypeLabel(row.ins_type) : "";
          }
          return row.required_amount ?? 0;
        },
        searchValue: (row) =>
          row.category === "insurance"
            ? row.ins_type
              ? insuranceTypeLabel(row.ins_type)
              : ""
            : formatInr(row.required_amount),
        cell: (row) =>
          row.category === "insurance"
            ? row.ins_type
              ? insuranceTypeLabel(row.ins_type)
              : "—"
            : formatInr(row.required_amount),
      },
      {
        id: "created_at",
        header: "Submitted",
        sortable: true,
        sortValue: (row) => row.created_at ?? "",
        searchValue: (row) => formatDate(row.created_at),
        cell: (row) => formatDate(row.created_at),
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortValue: (row) => statusMeta(row.status).label,
        searchValue: (row) => statusMeta(row.status).label,
        cell: (row) => {
          const meta = statusMeta(row.status);
          return (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
              {meta.label}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        searchable: false,
        cell: (row) => (
          <CrmActionButton label="View" onClick={() => setViewLead(row)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </CrmActionButton>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {[
          { label: "Applications", value: total },
          { label: "Under review", value: pending },
          { label: "Approved", value: approved },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-black/5 bg-white px-3 py-3.5 shadow-sm transition-shadow hover:shadow-md sm:px-5 sm:py-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-bold text-midnight_text sm:text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white/80 px-5 py-10 text-center">
          <p className="text-base font-semibold text-midnight_text">No applications yet</p>
          <p className="mt-1 text-sm text-gray-600">
            Submit a Personal Loan application to track it here.
          </p>
          <Link
            href="/products/personal-loan"
            className="btn-gradient mt-5 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          >
            Apply now
          </Link>
        </div>
      ) : (
        <CrmDataTable
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          searchPlaceholder="Search application, product…"
          emptyMessage="No applications match this filter."
          toolbarLeft={
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="hidden sm:inline">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none focus:border-[#4236FB] focus:ring-2 focus:ring-[#4236FB]/20"
              >
                <option value="all">All statuses</option>
                <option value="pending">Under review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Not approved</option>
              </select>
            </label>
          }
        />
      )}

      {viewLead && (
        <AppModal title="Application details" wide onClose={closeModals}>
          <div className="overflow-hidden">
            <div className="border-b border-black/5 bg-gradient-to-r from-primary/[0.06] to-[#ff7a1a]/[0.06] px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Application number</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tracking-wide text-midnight_text">
                    {viewLead.applicationNumber}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta(viewLead.status).badge}`}
                >
                  {statusMeta(viewLead.status).label}
                </span>
              </div>
            </div>
            <div className="grid gap-6 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Product</span>
                  <span className="text-right font-medium">{categoryLabel(viewLead.category)}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">
                    {viewLead.category === "insurance" ? "Insurance type" : "Requested amount"}
                  </span>
                  <span className="text-right font-medium">
                    {viewLead.category === "insurance"
                      ? viewLead.ins_type
                        ? insuranceTypeLabel(viewLead.ins_type)
                        : "—"
                      : formatInr(viewLead.required_amount)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Submitted</span>
                  <span className="font-medium">{formatDate(viewLead.created_at)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-medium">+91 {viewLead.mobile_number}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-midnight_text">Status timeline</p>
                <Timeline lead={viewLead} />
              </div>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
}
