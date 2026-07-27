"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { insuranceTypeLabel, loanAmountLabel, INSURANCE_TYPE_OPTIONS } from "@/app/utils/leadForm";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import { PERSONAL_LOAN_EMI_LIMITS } from "@/app/config/constants";
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

const DEFAULT_LOAN_AMOUNT = 5_00_000;

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
  "mobile_number",
  "pan",
  "category",
  "status",
  "otp_verified",
  "required_amount",
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
  required_amount: "Loan amount",
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

function categoryLabel(value: unknown): string {
  const v = String(value ?? "");
  const found = CATEGORIES.find((c) => c.value === v)?.label;
  if (found) return found;
  return v ? v.replace(/_/g, " ") : "—";
}

function formatCurrencyInr(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function formatValue(key: string, value: unknown): string {
  if (key === "otp_verified") {
    return value === true || value === 1 || value === "true" ? "Yes" : "No";
  }
  if (key === "required_amount") {
    if (value == null || value === "") return "—";
    return formatCurrencyInr(value);
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
  if (category === "personal_loan") {
    if (row.required_amount != null && row.required_amount !== "") {
      return formatCurrencyInr(row.required_amount);
    }
    if (row.loan_amt) return loanAmountLabel(String(row.loan_amt));
  }
  if (category === "insurance" && row.ins_type) {
    return insuranceTypeLabel(String(row.ins_type));
  }
  if (row.required_amount != null && row.required_amount !== "") {
    return formatCurrencyInr(row.required_amount);
  }
  if (row.loan_amt) return loanAmountLabel(String(row.loan_amt));
  if (row.ins_type) return insuranceTypeLabel(String(row.ins_type));
  return "—";
}

type EditForm = {
  fullName: string;
  mobileNumber: string;
  pan: string;
  category: string;
  status: string;
  requiredAmount: number;
  insType: string;
};

function clampLoanAmount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_LOAN_AMOUNT;
  return Math.min(
    PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT,
    Math.max(PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT, Math.round(n)),
  );
}

function leadToEditForm(lead: AdminLeadRow): EditForm {
  return {
    fullName: String(lead.full_name ?? ""),
    mobileNumber: String(lead.mobile_number ?? ""),
    pan: String(lead.pan ?? ""),
    category: String(lead.category ?? "personal_loan"),
    status: String(lead.status ?? "pending"),
    requiredAmount: clampLoanAmount(lead.required_amount ?? DEFAULT_LOAN_AMOUNT),
    insType: String(lead.ins_type ?? "life_insurance"),
  };
}

function emptyCreateForm(): EditForm {
  return {
    fullName: "",
    mobileNumber: "",
    pan: "",
    category: "personal_loan",
    status: "pending",
    requiredAmount: DEFAULT_LOAN_AMOUNT,
    insType: "life_insurance",
  };
}

type FieldErrors = {
  mobileNumber?: string;
  pan?: string;
};

const PHONE_PATTERN = /^[6-9]\d{9}$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PAN_MASK_PATTERN = /^[A-Z]{5}\*{4}[A-Z]$/;

function isMaskedPanValue(value: string): boolean {
  return PAN_MASK_PATTERN.test(value.trim().toUpperCase());
}

function validateLeadForm(form: EditForm, opts?: { allowMaskedPan?: boolean }): FieldErrors {
  const errors: FieldErrors = {};
  if (!PHONE_PATTERN.test(form.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number";
  }
  const pan = form.pan.trim().toUpperCase();
  if (opts?.allowMaskedPan && isMaskedPanValue(pan)) {
    // keep existing encrypted PAN
  } else if (!PAN_PATTERN.test(pan)) {
    errors.pan = "Enter a valid PAN (e.g. ABCDE1234F)";
  }
  return errors;
}

function FieldErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{message}</span>;
}

function LeadFormFields({
  form,
  setForm,
  inputClass,
  fieldErrors,
  clearFieldError,
  panMode = "create",
  onRevealPan,
  revealingPan,
}: {
  form: EditForm;
  setForm: (next: EditForm) => void;
  inputClass: string;
  fieldErrors: FieldErrors;
  clearFieldError: (key: keyof FieldErrors) => void;
  panMode?: "create" | "edit";
  onRevealPan?: () => void;
  revealingPan?: boolean;
}) {
  const panLocked = panMode === "edit" && isMaskedPanValue(form.pan);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {form.category === "personal_loan" ? (
        <div className="sm:col-span-2">
          <LoanAmountSlider
            id="admin-lead-loan-amount"
            value={form.requiredAmount}
            onChange={(value) => setForm({ ...form, requiredAmount: value })}
          />
        </div>
      ) : (
        <label className="block sm:col-span-2">
          <span className={ADMIN_LABEL}>Insurance type</span>
          <select
            className={inputClass}
            value={form.insType}
            onChange={(e) => setForm({ ...form, insType: e.target.value })}
          >
            {INSURANCE_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="block sm:col-span-2">
        <span className={ADMIN_LABEL}>Name</span>
        <input
          className={inputClass}
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="enter name"
          required
        />
      </label>
      <label className="block">
        <span className={ADMIN_LABEL}>Phone</span>
        <input
          className={inputClass}
          value={form.mobileNumber}
          onChange={(e) => {
            setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, "") });
            clearFieldError("mobileNumber");
          }}
          placeholder="enter phone number"
          inputMode="numeric"
          required
          maxLength={10}
        />
        <FieldErrorText message={fieldErrors.mobileNumber} />
      </label>
      <div className="block">
        <span className={ADMIN_LABEL}>PAN</span>
        <div className="flex items-center gap-2">
          <input
            className={`${inputClass} min-w-0 flex-1 font-mono tracking-wide`}
            value={form.pan}
            onChange={(e) => {
              setForm({ ...form, pan: e.target.value.toUpperCase() });
              clearFieldError("pan");
            }}
            placeholder="enter PAN number"
            required={panMode === "create"}
            maxLength={10}
            readOnly={panLocked}
          />
          {panMode === "edit" && onRevealPan ? (
            <button
              type="button"
              onClick={onRevealPan}
              disabled={revealingPan || !panLocked}
              className={`${ADMIN_BTN_SECONDARY} shrink-0 whitespace-nowrap`}
              title={panLocked ? "Reveal full PAN (audited)" : "PAN already revealed"}
            >
              {revealingPan ? "…" : panLocked ? "Reveal" : "Shown"}
            </button>
          ) : null}
        </div>
        {panLocked ? (
          <span className="mt-1 block text-xs text-slate-500">
            Masked by default. Reveal is audited with your admin account.
          </span>
        ) : null}
        <FieldErrorText message={fieldErrors.pan} />
      </div>
      <label className="block">
        <span className={ADMIN_LABEL}>Product</span>
        <select
          className={inputClass}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={ADMIN_LABEL}>Status</span>
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

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
    };
    if (form.category === "personal_loan") {
      payload.requiredAmount = form.requiredAmount;
      payload.insType = null;
      payload.loanAmt = null;
    } else if (form.category === "insurance") {
      payload.insType = form.insType;
      payload.requiredAmount = null;
      payload.loanAmt = null;
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
    if (validationErrors.mobileNumber || validationErrors.pan) {
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
    if (validationErrors.mobileNumber || validationErrors.pan) {
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
        searchPlaceholder="Search name, phone, product…"
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
            {VIEW_FIELDS.map((key) => (
              <li
                key={key}
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
                    {formatValue(key, viewLead[key])}
                  </span>
                ) : key === "pan" ? (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="font-mono tracking-wide text-midnight_text dark:text-gray-200">
                      {viewPanFull ?? formatValue(key, viewLead[key])}
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
                ) : (
                  <span className="text-midnight_text dark:text-gray-200">{formatValue(key, viewLead[key])}</span>
                )}
              </li>
            ))}
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
