"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import CrmDataTable, { CrmActionButton, type CrmColumn } from "../CrmDataTable";
import AdminModal from "../AdminModal";
import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_ERROR,
  ADMIN_INPUT,
} from "../adminUi";
import LeadFormFields from "./LeadFormFields";
import {
  VIEW_FIELDS,
  FIELD_LABELS,
  categoryLabel,
  cellText,
  amountOrInsuranceText,
  formatCurrencyInr,
  formatValue,
  isOtpVerified,
} from "./leadDisplay";
import { employmentTypeLabel } from "@/app/utils/leadForm";
import {
  type EditForm,
  type FieldErrors,
  emptyCreateForm,
  leadToEditForm,
  validateLeadForm,
  isMaskedPanValue,
} from "./leadEditForm";

export default function LeadsTable({ initialLeads }: { initialLeads: AdminLeadRow[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [viewLead, setViewLead] = useState<AdminLeadRow | null>(null);
  const [editLead, setEditLead] = useState<AdminLeadRow | null>(null);
  const [deleteLead, setDeleteLead] = useState<AdminLeadRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [revealingPan, setRevealingPan] = useState(false);
  const [viewPanFull, setViewPanFull] = useState<string | null>(null);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const closeModals = useCallback(() => {
    setViewLead(null);
    setEditLead(null);
    setDeleteLead(null);
    setCreateOpen(false);
    setEditForm(null);
    setError(null);
    setFieldErrors({});
    setViewPanFull(null);
    setRevealingPan(false);
  }, []);

  const clearFieldError = useCallback((key: keyof FieldErrors) => {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    if (viewLead || editLead || deleteLead || createOpen) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [viewLead, editLead, deleteLead, createOpen, closeModals]);

  function openCreate() {
    setCreateOpen(true);
    setEditForm(emptyCreateForm());
    setError(null);
    setFieldErrors({});
    setViewPanFull(null);
  }

  function openEdit(lead: AdminLeadRow) {
    setEditLead(lead);
    setEditForm(leadToEditForm(lead));
    setError(null);
    setFieldErrors({});
    setViewPanFull(null);
  }

  function buildLeadPayload(form: EditForm, opts?: { omitMaskedPan?: boolean }): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      fullName: form.fullName.trim(),
      mobileNumber: form.mobileNumber.trim(),
      category: form.category,
      status: form.status,
      pincode: form.pincode.trim() || null,
    };
    if (form.category === "personal_loan") {
      payload.requiredAmount = form.requiredAmount;
      payload.insType = null;
      payload.loanAmt = null;
      payload.employmentType = form.employmentType || null;
      const income = Number(form.netMonthlyIncome);
      payload.netMonthlyIncome = Number.isFinite(income) && income > 0 ? income : null;
    } else if (form.category === "insurance") {
      payload.insType = form.insType;
      payload.requiredAmount = null;
      payload.loanAmt = null;
      payload.employmentType = null;
      payload.netMonthlyIncome = null;
    }
    const pan = form.pan.trim().toUpperCase();
    if (!(opts?.omitMaskedPan && isMaskedPanValue(pan))) {
      payload.pan = pan;
    }
    return payload;
  }

  async function revealPan(leadId: string): Promise<string | null> {
    setRevealingPan(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${encodeURIComponent(leadId)}/pan/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "admin_panel_reveal" }),
      });
      const data = (await res.json()) as { pan?: string; error?: string };
      if (!res.ok || !data.pan) {
        setError(data.error ?? "Could not reveal PAN");
        return null;
      }
      return data.pan;
    } catch {
      setError("Network error. Try again.");
      return null;
    } finally {
      setRevealingPan(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm) return;

    const validationErrors = validateLeadForm(editForm);
    if (
      validationErrors.mobileNumber ||
      validationErrors.pan ||
      validationErrors.employmentType ||
      validationErrors.netMonthlyIncome ||
      validationErrors.pincode
    ) {
      setFieldErrors(validationErrors);
      return;
    }

    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildLeadPayload(editForm)),
      });
      const data = (await res.json()) as {
        success?: boolean;
        data?: AdminLeadRow;
        error?: string;
        message?: string;
        field?: string;
      };
      if (!res.ok) {
        const message = data.error ?? data.message ?? "Create failed";
        if (data.field === "mobileNumber" || data.field === "pan") {
          setFieldErrors({ [data.field]: message });
        } else {
          setError(message);
        }
        return;
      }
      if (data.data) {
        setLeads((prev) => [data.data!, ...prev]);
      }
      closeModals();
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editLead?.id || !editForm) return;

    const validationErrors = validateLeadForm(editForm, { allowMaskedPan: true });
    if (
      validationErrors.mobileNumber ||
      validationErrors.pan ||
      validationErrors.employmentType ||
      validationErrors.netMonthlyIncome ||
      validationErrors.pincode
    ) {
      setFieldErrors(validationErrors);
      return;
    }

    setSaving(true);
    setError(null);
    setFieldErrors({});

    const payload = buildLeadPayload(editForm, { omitMaskedPan: true });

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
        sortValue: (row) => {
          if (row.required_amount != null && row.required_amount !== "") {
            const n = Number(row.required_amount);
            return Number.isFinite(n) ? n : 0;
          }
          return amountOrInsuranceText(row);
        },
        searchValue: (row) => amountOrInsuranceText(row),
        className: "max-w-[160px] truncate whitespace-nowrap",
        cell: (row) => amountOrInsuranceText(row),
      },
      {
        id: "employment_type",
        header: "Employment",
        sortable: true,
        sortValue: (row) =>
          row.employment_type ? employmentTypeLabel(String(row.employment_type)) : "",
        searchValue: (row) =>
          row.employment_type ? employmentTypeLabel(String(row.employment_type)) : "",
        className: "max-w-[130px] truncate whitespace-nowrap",
        cell: (row) =>
          String(row.category ?? "") === "personal_loan" && row.employment_type
            ? employmentTypeLabel(String(row.employment_type))
            : "—",
      },
      {
        id: "net_monthly_income",
        header: "Monthly income",
        sortable: true,
        sortValue: (row) => {
          const n = Number(row.net_monthly_income);
          return Number.isFinite(n) ? n : 0;
        },
        searchValue: (row) => formatCurrencyInr(row.net_monthly_income),
        className: "max-w-[140px] truncate whitespace-nowrap",
        cell: (row) =>
          String(row.category ?? "") === "personal_loan"
            ? formatCurrencyInr(row.net_monthly_income)
            : "—",
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
            <CrmActionButton
              label="View"
              onClick={() => {
                setViewPanFull(null);
                setError(null);
                setViewLead(row);
              }}
            >
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
        searchPlaceholder="Search name, phone, product, income…"
        emptyMessage="No leads to display."
        toolbarRight={
          <button type="button" onClick={openCreate} className={ADMIN_BTN_PRIMARY}>
            Add lead
          </button>
        }
      />

      {viewLead && (
        <AdminModal title="Lead details" wide onClose={closeModals}>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2 sm:p-8">
            {VIEW_FIELDS.map((rawKey) => {
              if (
                (rawKey === "employment_type" || rawKey === "net_monthly_income") &&
                String(viewLead.category ?? "") !== "personal_loan"
              ) {
                return null;
              }
              const key =
                rawKey === "required_amount" && String(viewLead.category ?? "") === "insurance"
                  ? "ins_type"
                  : rawKey;
              return (
              <li
                key={rawKey}
                className="flex flex-wrap items-baseline gap-1 text-sm"
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
                    {formatValue(key, viewLead[key], viewLead)}
                  </span>
                ) : key === "pan" ? (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="font-mono tracking-wide text-midnight_text dark:text-gray-200">
                      {viewPanFull ?? formatValue(key, viewLead[key], viewLead)}
                    </span>
                    {!viewPanFull && viewLead.id ? (
                      <button
                        type="button"
                        disabled={revealingPan}
                        onClick={() => {
                          void (async () => {
                            const full = await revealPan(String(viewLead.id));
                            if (full) setViewPanFull(full);
                          })();
                        }}
                        className="text-xs font-semibold text-[#4236FB] hover:underline disabled:opacity-60"
                      >
                        {revealingPan ? "Revealing…" : "Reveal"}
                      </button>
                    ) : null}
                  </span>
                ) : key === "ip" ? (
                  <span className="text-sm text-midnight_text dark:text-gray-200">
                    {formatValue(key, viewLead[key], viewLead)}
                  </span>
                ) : (
                  <span className="text-midnight_text dark:text-gray-200">
                    {formatValue(key, viewLead[key], viewLead)}
                  </span>
                )}
              </li>
              );
            })}
          </ul>
          {error && <p className={`px-6 pb-4 sm:px-8 ${ADMIN_ERROR}`}>{error}</p>}
        </AdminModal>
      )}

      {createOpen && editForm && (
        <AdminModal title="Add lead" onClose={closeModals}>
          <form onSubmit={handleCreate} className="space-y-6 p-6 sm:p-8" noValidate>
            {error && <p className={ADMIN_ERROR}>{error}</p>}
            <LeadFormFields
              form={editForm}
              setForm={(next) => setEditForm(next)}
              inputClass={inputClass}
              fieldErrors={fieldErrors}
              clearFieldError={clearFieldError}
              panMode="create"
            />
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-dark_border">
              <button type="button" onClick={closeModals} className={ADMIN_BTN_SECONDARY}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>
                {saving ? "Saving…" : "Create"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {editLead && editForm && (
        <AdminModal title="Edit lead" onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-6 p-6 sm:p-8" noValidate>
            {error && <p className={ADMIN_ERROR}>{error}</p>}
            <LeadFormFields
              form={editForm}
              setForm={(next) => setEditForm(next)}
              inputClass={inputClass}
              fieldErrors={fieldErrors}
              clearFieldError={clearFieldError}
              panMode="edit"
              revealingPan={revealingPan}
              onRevealPan={() => {
                if (!editLead.id) return;
                void (async () => {
                  const full = await revealPan(String(editLead.id));
                  if (full && editForm) setEditForm({ ...editForm, pan: full });
                })();
              }}
            />
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

