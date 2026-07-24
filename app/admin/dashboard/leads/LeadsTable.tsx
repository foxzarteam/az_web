"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { insuranceTypeLabel, loanAmountLabel } from "@/app/utils/leadForm";
import CrmDataTable, { CrmActionButton, type CrmColumn } from "../CrmDataTable";
import AdminModal from "../AdminModal";
import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../adminUi";

const CATEGORIES = [
  { value: "personal_loan", label: "Personal Loan" },
  { value: "insurance", label: "Insurance" },
] as const;

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

const VIEW_FIELDS = [
  "full_name",
  "email",
  "mobile_number",
  "pan",
  "category",
  "status",
  "otp_verified",
  "pincode",
  "required_amount",
  "loan_amt",
  "ins_type",
  "notes",
  "user_id",
  "is_active",
  "created_at",
  "updated_at",
] as const;

const FIELD_LABELS: Record<string, string> = {
  id: "ID",
  user_id: "User ID",
  pan: "PAN",
  mobile_number: "Phone",
  full_name: "Name",
  email: "Email",
  pincode: "Pincode",
  required_amount: "Required amount",
  loan_amt: "Loan amount range",
  ins_type: "Insurance type",
  category: "Product",
  status: "Status",
  otp_verified: "Verified",
  notes: "Notes",
  is_active: "Active",
  created_at: "Created",
  updated_at: "Updated",
};

function categoryLabel(value: unknown): string {
  const v = String(value ?? "");
  const found = CATEGORIES.find((c) => c.value === v)?.label;
  if (found) return found;
  return v ? v.replace(/_/g, " ") : "—";
}

function formatValue(key: string, value: unknown): string {
  if (key === "otp_verified") {
    return value === true || value === 1 || value === "true" ? "Yes" : "No";
  }
  if (value == null || value === "") return "—";
  if (key === "category") return categoryLabel(value);
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

function isOtpVerified(row: AdminLeadRow): boolean {
  return row.otp_verified === true || row.otp_verified === 1 || row.otp_verified === "true";
}

function cellText(row: AdminLeadRow, key: "full_name" | "mobile_number" | "category"): string {
  if (key === "category") return categoryLabel(row[key]);
  const v = row[key];
  if (v == null || v === "") return "—";
  return String(v);
}

function amountOrInsuranceText(row: AdminLeadRow): string {
  const category = String(row.category ?? "");
  if (category === "personal_loan" && row.loan_amt) {
    return loanAmountLabel(String(row.loan_amt));
  }
  if (category === "insurance" && row.ins_type) {
    return insuranceTypeLabel(String(row.ins_type));
  }
  if (row.loan_amt) return loanAmountLabel(String(row.loan_amt));
  if (row.ins_type) return insuranceTypeLabel(String(row.ins_type));
  return "—";
}

type EditForm = {
  fullName: string;
  email: string;
  mobileNumber: string;
  pan: string;
  category: string;
  status: string;
  pincode: string;
  requiredAmount: string;
  notes: string;
};

function leadToEditForm(lead: AdminLeadRow): EditForm {
  return {
    fullName: String(lead.full_name ?? ""),
    email: String(lead.email ?? ""),
    mobileNumber: String(lead.mobile_number ?? ""),
    pan: String(lead.pan ?? ""),
    category: String(lead.category ?? "personal_loan"),
    status: String(lead.status ?? "pending"),
    pincode: String(lead.pincode ?? ""),
    requiredAmount: lead.required_amount != null ? String(lead.required_amount) : "",
    notes: String(lead.notes ?? ""),
  };
}

export default function LeadsTable({ initialLeads }: { initialLeads: AdminLeadRow[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [viewLead, setViewLead] = useState<AdminLeadRow | null>(null);
  const [editLead, setEditLead] = useState<AdminLeadRow | null>(null);
  const [deleteLead, setDeleteLead] = useState<AdminLeadRow | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const closeModals = useCallback(() => {
    setViewLead(null);
    setEditLead(null);
    setDeleteLead(null);
    setEditForm(null);
    setError(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    if (viewLead || editLead || deleteLead) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [viewLead, editLead, deleteLead, closeModals]);

  function openEdit(lead: AdminLeadRow) {
    setEditLead(lead);
    setEditForm(leadToEditForm(lead));
    setError(null);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editLead?.id || !editForm) return;

    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      fullName: editForm.fullName.trim(),
      email: editForm.email.trim(),
      mobileNumber: editForm.mobileNumber.trim(),
      pan: editForm.pan.trim(),
      category: editForm.category,
      status: editForm.status,
      pincode: editForm.pincode.trim(),
      notes: editForm.notes.trim(),
    };
    if (editForm.requiredAmount.trim()) {
      payload.requiredAmount = Number(editForm.requiredAmount);
    } else {
      payload.requiredAmount = null;
    }

    try {
      const res = await fetch(`/api/admin/leads/${encodeURIComponent(String(editLead.id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; data?: AdminLeadRow; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Update failed");
        return;
      }
      if (data.data) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === data.data!.id
              ? { ...l, ...data.data!, otp_verified: data.data!.otp_verified ?? l.otp_verified }
              : l,
          ),
        );
      }
      closeModals();
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteLead?.id) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/leads/${encodeURIComponent(String(deleteLead.id))}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Delete failed");
        return;
      }
      setLeads((prev) => prev.filter((l) => l.id !== deleteLead.id));
      closeModals();
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  const inputClass = ADMIN_INPUT;

  const columns = useMemo<CrmColumn<AdminLeadRow>[]>(
    () => [
      {
        id: "full_name",
        header: "Name",
        sortable: true,
        sortValue: (row) => String(row.full_name ?? ""),
        searchValue: (row) => cellText(row, "full_name"),
        cell: (row) => cellText(row, "full_name"),
      },
      {
        id: "mobile_number",
        header: "Phone",
        sortable: true,
        sortValue: (row) => String(row.mobile_number ?? ""),
        searchValue: (row) => cellText(row, "mobile_number"),
        cell: (row) => cellText(row, "mobile_number"),
      },
      {
        id: "category",
        header: "Product",
        sortable: true,
        sortValue: (row) => categoryLabel(row.category),
        searchValue: (row) => cellText(row, "category"),
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
        sortValue: (row) => amountOrInsuranceText(row),
        searchValue: (row) => amountOrInsuranceText(row),
        className: "max-w-[220px] truncate whitespace-nowrap",
        cell: (row) => amountOrInsuranceText(row),
      },
      {
        id: "otp_verified",
        header: "Verified",
        sortable: true,
        sortValue: (row) => (isOtpVerified(row) ? 1 : 0),
        searchValue: (row) => (isOtpVerified(row) ? "yes verified" : "no unverified"),
        cell: (row) => {
          const verified = isOtpVerified(row);
          return (
            <span
              className={
                verified
                  ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300"
              }
            >
              {verified ? "Yes" : "No"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        searchable: false,
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            <CrmActionButton label="View" onClick={() => setViewLead(row)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </CrmActionButton>
            <CrmActionButton label="Edit" onClick={() => openEdit(row)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </CrmActionButton>
            <CrmActionButton
              label="Delete"
              variant="danger"
              onClick={() => {
                setDeleteLead(row);
                setError(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </CrmActionButton>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <CrmDataTable
        rows={leads}
        columns={columns}
        getRowId={(row, i) => String(row.id ?? i)}
        searchPlaceholder="Search name, phone, product…"
        emptyMessage="No leads to display."
      />

      {viewLead && (
        <AdminModal title="Lead details" wide onClose={() => setViewLead(null)}>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2 sm:p-8">
            {VIEW_FIELDS.map((key) => (
              <li
                key={key}
                className={`flex flex-wrap items-baseline gap-1 text-sm ${key === "notes" ? "sm:col-span-2" : ""}`}
              >
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">
                  {FIELD_LABELS[key] ?? key}:
                </span>
                {key === "otp_verified" ? (
                  <span
                    className={
                      isOtpVerified(viewLead)
                        ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                        : "inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600"
                    }
                  >
                    {formatValue(key, viewLead[key])}
                  </span>
                ) : (
                  <span className="text-midnight_text dark:text-gray-200">{formatValue(key, viewLead[key])}</span>
                )}
              </li>
            ))}
          </ul>
        </AdminModal>
      )}

      {editLead && editForm && (
        <AdminModal title="Edit lead" wide onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-6 p-6 sm:p-8">
            {error && <p className={ADMIN_ERROR}>{error}</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className={ADMIN_LABEL}>Name</span>
                <input className={inputClass} value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Email</span>
                <input type="email" className={inputClass} value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Phone</span>
                <input className={inputClass} value={editForm.mobileNumber} onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })} required maxLength={10} />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>PAN</span>
                <input className={inputClass} value={editForm.pan} onChange={(e) => setEditForm({ ...editForm, pan: e.target.value.toUpperCase() })} required maxLength={10} />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Product</span>
                <select className={inputClass} value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Status</span>
                <select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Pincode</span>
                <input className={inputClass} value={editForm.pincode} onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })} maxLength={6} />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Required amount</span>
                <input type="number" min={0} className={inputClass} value={editForm.requiredAmount} onChange={(e) => setEditForm({ ...editForm, requiredAmount: e.target.value })} />
              </label>
              <label className="block sm:col-span-2">
                <span className={ADMIN_LABEL}>Notes</span>
                <textarea className={inputClass} rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-dark_border">
              <button type="button" onClick={closeModals} className={ADMIN_BTN_SECONDARY}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {deleteLead && (
        <AdminModal title="Delete lead" onClose={closeModals}>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete lead for <strong>{cellText(deleteLead, "full_name")}</strong> ({cellText(deleteLead, "mobile_number")})? This cannot be undone.
            </p>
            {error && <p className={`mt-3 ${ADMIN_ERROR}`}>{error}</p>}
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={closeModals} className={ADMIN_BTN_SECONDARY}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className={ADMIN_BTN_DANGER}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}
