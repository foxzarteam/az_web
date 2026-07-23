"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AdminPartnerRow, PartnerServiceOption } from "@/app/lib/admin/fetchPartners";
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

const PAYOUT_TYPES = [
  { value: "PERCENTAGE", label: "Percentage (%)" },
  { value: "FLAT", label: "Flat (Rs)" },
] as const;

const VIEW_FIELDS = ["name", "service_names", "payout_type", "commission_value", "created_at"] as const;

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  service_names: "Products",
  payout_type: "Payout type",
  commission_value: "Commission value",
  created_at: "Created",
};

function formatValue(key: string, value: unknown): string {
  if (value == null || value === "") return "—";
  const s = String(value);
  if (key === "payout_type") return s === "PERCENTAGE" ? "Percentage" : s === "FLAT" ? "Flat" : s;
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    }
  }
  return s;
}

function cellText(row: AdminPartnerRow, key: "name"): string {
  const v = row[key];
  if (v == null || v === "") return "—";
  return String(v);
}

function servicesText(row: AdminPartnerRow): string {
  const names = row.service_names;
  if (names != null && String(names).trim()) return String(names);
  const ids = row.service_id;
  if (ids == null || ids === "") return "—";
  return String(ids);
}

function payoutText(row: AdminPartnerRow): string {
  const type = String(row.payout_type ?? "");
  const val = row.commission_value;
  if (val == null) return "—";
  return type === "PERCENTAGE" ? `${val}%` : `₹${val}`;
}

function createdDateText(row: AdminPartnerRow): string {
  return formatValue("created_at", row.created_at);
}

type PartnerForm = {
  name: string;
  selectedSortOrders: number[];
  payoutType: string;
  commissionValue: string;
};

function parseSortOrdersCsv(csv: string): number[] {
  return csv
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
}

const emptyForm = (): PartnerForm => ({
  name: "",
  selectedSortOrders: [],
  payoutType: "PERCENTAGE",
  commissionValue: "",
});

function rowToForm(row: AdminPartnerRow): PartnerForm {
  return {
    name: String(row.name ?? ""),
    selectedSortOrders: parseSortOrdersCsv(String(row.service_id ?? "")),
    payoutType: String(row.payout_type ?? "PERCENTAGE"),
    commissionValue: row.commission_value != null ? String(row.commission_value) : "",
  };
}

function ServiceMultiSelect({
  options,
  selected,
  onChange,
}: {
  options: PartnerServiceOption[];
  selected: number[];
  onChange: (orders: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function toggle(sortOrder: number) {
    if (selected.includes(sortOrder)) {
      onChange(selected.filter((s) => s !== sortOrder));
    } else {
      onChange([...selected, sortOrder].sort((a, b) => a - b));
    }
  }

  if (options.length === 0) {
    return <p className="text-sm text-gray dark:text-gray-400">No active products found.</p>;
  }

  const selectedTitles = options.filter((o) => selected.includes(o.sortOrder)).map((o) => o.title);
  const triggerLabel = selectedTitles.length > 0 ? selectedTitles.join(", ") : "Select products";

  const triggerClass =
    "flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-midnight_text focus:outline-none focus:ring-2 focus:ring-primary/80 dark:border-dark_border dark:bg-darkmode dark:text-white";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={triggerClass}
      >
        <span className={`min-w-0 flex-1 truncate text-left ${selectedTitles.length === 0 ? "text-gray dark:text-gray-400" : ""}`}>
          {triggerLabel}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-gray transition dark:text-gray-400 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-dark_border dark:bg-darkmode">
          <ul className="divide-y divide-gray-100 dark:divide-dark_border" role="listbox" aria-multiselectable>
            {options.map((opt) => (
              <li key={opt.sortOrder} role="option" aria-selected={selected.includes(opt.sortOrder)}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.sortOrder)}
                    onChange={() => toggle(opt.sortOrder)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-midnight_text dark:text-white">{opt.title}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PartnerFormFields({
  form,
  setForm,
  inputClass,
  serviceOptions,
}: {
  form: PartnerForm;
  setForm: (f: PartnerForm) => void;
  inputClass: string;
  serviceOptions: PartnerServiceOption[];
}) {
  return (
    <div className="grid gap-5">
      <label className="block">
        <span className={ADMIN_LABEL}>Name</span>
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </label>
      <div className="block">
        <span className={ADMIN_LABEL}>Products</span>
        <ServiceMultiSelect
          options={serviceOptions}
          selected={form.selectedSortOrders}
          onChange={(selectedSortOrders) => setForm({ ...form, selectedSortOrders })}
        />
        <p className="mt-1 text-xs text-gray dark:text-gray-400">Open dropdown and select one or more products</p>
      </div>
      <label className="block">
        <span className={ADMIN_LABEL}>Payout type</span>
        <select className={inputClass} value={form.payoutType} onChange={(e) => setForm({ ...form, payoutType: e.target.value })}>
          {PAYOUT_TYPES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={ADMIN_LABEL}>Commission value</span>
        <input
          type="number"
          min={0}
          step="any"
          className={inputClass}
          value={form.commissionValue}
          onChange={(e) => setForm({ ...form, commissionValue: e.target.value })}
          placeholder={form.payoutType === "PERCENTAGE" ? "e.g. 2.5" : "e.g. 1500"}
          required
        />
      </label>
    </div>
  );
}

export default function PartnersTable({
  initialPartners,
  serviceOptions,
}: {
  initialPartners: AdminPartnerRow[];
  serviceOptions: PartnerServiceOption[];
}) {
  const router = useRouter();
  const [partners, setPartners] = useState(initialPartners);
  const [viewRow, setViewRow] = useState<AdminPartnerRow | null>(null);
  const [editRow, setEditRow] = useState<AdminPartnerRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<AdminPartnerRow | null>(null);
  const [form, setForm] = useState<PartnerForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPartners(initialPartners);
  }, [initialPartners]);

  const closeModals = useCallback(() => {
    setViewRow(null);
    setEditRow(null);
    setCreateOpen(false);
    setDeleteRow(null);
    setForm(emptyForm());
    setError(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    if (viewRow || editRow || createOpen || deleteRow) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [viewRow, editRow, createOpen, deleteRow, closeModals]);

  function openCreate() {
    setCreateOpen(true);
    setForm(emptyForm());
    setError(null);
  }

  function openEdit(row: AdminPartnerRow) {
    setEditRow(row);
    setForm(rowToForm(row));
    setError(null);
  }

  function buildPayload(f: PartnerForm) {
    return {
      name: f.name.trim(),
      serviceId: f.selectedSortOrders.join(","),
      payoutType: f.payoutType,
      commissionValue: Number(f.commissionValue),
    };
  }

  function validateForm(f: PartnerForm): string | null {
    if (f.selectedSortOrders.length === 0) return "Select at least one product.";
    return null;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const data = (await res.json()) as { success?: boolean; data?: AdminPartnerRow; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Create failed");
        return;
      }
      if (data.data) setPartners((prev) => [data.data!, ...prev]);
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
    if (!editRow?.id) return;
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/partners/${encodeURIComponent(String(editRow.id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const data = (await res.json()) as { success?: boolean; data?: AdminPartnerRow; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Update failed");
        return;
      }
      if (data.data) setPartners((prev) => prev.map((p) => (p.id === data.data!.id ? data.data! : p)));
      closeModals();
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteRow?.id) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/partners/${encodeURIComponent(String(deleteRow.id))}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Delete failed");
        return;
      }
      setPartners((prev) => prev.filter((p) => p.id !== deleteRow.id));
      closeModals();
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  const inputClass = ADMIN_INPUT;

  const deleteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  const columns = useMemo<CrmColumn<AdminPartnerRow>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        sortable: true,
        sortValue: (row) => String(row.name ?? ""),
        searchValue: (row) => cellText(row, "name"),
        cell: (row) => cellText(row, "name"),
      },
      {
        id: "products",
        header: "Products",
        sortable: true,
        sortValue: (row) => servicesText(row),
        searchValue: (row) => servicesText(row),
        className: "max-w-[280px] truncate whitespace-nowrap",
        cell: (row) => <span title={servicesText(row)}>{servicesText(row)}</span>,
      },
      {
        id: "commission",
        header: "Commission",
        sortable: true,
        sortValue: (row) => payoutText(row),
        searchValue: (row) => payoutText(row),
        cell: (row) => payoutText(row),
      },
      {
        id: "created_at",
        header: "Created date",
        sortable: true,
        sortValue: (row) => String(row.created_at ?? ""),
        searchValue: (row) => createdDateText(row),
        cell: (row) => createdDateText(row),
      },
      {
        id: "actions",
        header: "Action",
        searchable: false,
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            <CrmActionButton label="View" onClick={() => setViewRow(row)}>
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
                setDeleteRow(row);
                setError(null);
              }}
            >
              {deleteIcon}
            </CrmActionButton>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- action handlers use stable setters
    [],
  );

  return (
    <>
      <CrmDataTable
        rows={partners}
        columns={columns}
        getRowId={(row, i) => String(row.id ?? i)}
        searchPlaceholder="Search partners, products…"
        emptyMessage="No partners to display."
        toolbarRight={
          <button
            type="button"
            onClick={openCreate}
            className={ADMIN_BTN_PRIMARY}
          >
            Add partner
          </button>
        }
      />

      {viewRow && (
        <AdminModal title="Partner details" wide onClose={() => setViewRow(null)}>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2 sm:p-8">
            {VIEW_FIELDS.map((key) => (
              <li key={key} className="flex flex-wrap items-baseline gap-1 text-sm">
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">{FIELD_LABELS[key] ?? key}:</span>
                <span className="text-midnight_text dark:text-gray-200">{formatValue(key, viewRow[key])}</span>
              </li>
            ))}
          </ul>
        </AdminModal>
      )}

      {createOpen && (
        <AdminModal title="Add partner" wide onClose={closeModals}>
          <form onSubmit={handleCreate} className="space-y-6 p-6 sm:p-8">
            {error && <p className={ADMIN_ERROR}>{error}</p>}
            <PartnerFormFields form={form} setForm={setForm} inputClass={inputClass} serviceOptions={serviceOptions} />
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

      {editRow && (
        <AdminModal title="Edit partner" wide onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-6 p-6 sm:p-8">
            {error && <p className={ADMIN_ERROR}>{error}</p>}
            <PartnerFormFields form={form} setForm={setForm} inputClass={inputClass} serviceOptions={serviceOptions} />
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

      {deleteRow && (
        <AdminModal title="Delete partner" onClose={closeModals}>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete partner <strong>{cellText(deleteRow, "name")}</strong>? This cannot be undone.
            </p>
            {error && <p className={`mt-3 ${ADMIN_ERROR}`}>{error}</p>}
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={closeModals} className={ADMIN_BTN_SECONDARY}>
                Cancel
              </button>
              <button type="button" onClick={handleConfirmDelete} disabled={deleting} className={ADMIN_BTN_DANGER}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}
