"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminPartnerRow, PartnerServiceOption } from "@/app/lib/admin/fetchPartners";

const PAYOUT_TYPES = [
  { value: "PERCENTAGE", label: "Percentage (%)" },
  { value: "FLAT", label: "Flat (Rs)" },
] as const;

const VIEW_FIELDS = ["name", "service_names", "payout_type", "commission_value", "created_at"] as const;

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  service_names: "Services",
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
    return <p className="text-sm text-gray dark:text-gray-400">No active services found.</p>;
  }

  const selectedTitles = options.filter((o) => selected.includes(o.sortOrder)).map((o) => o.title);
  const triggerLabel = selectedTitles.length > 0 ? selectedTitles.join(", ") : "Select services";

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

function IconButton({
  label,
  onClick,
  children,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        variant === "danger"
          ? "border border-black text-red-600 hover:bg-red-50 dark:border-black dark:text-red-400 dark:hover:bg-red-950/40"
          : "border-gray-200 text-midnight_text hover:bg-gray-100 dark:border-dark_border dark:text-gray-200 dark:hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function ModalShell({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close overlay" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-dark_border dark:bg-darklight ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-dark_border">
          <h2 className="text-lg font-bold text-midnight_text dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
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
    <div className="grid gap-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Name</span>
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </label>
      <div className="block">
        <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Services</span>
        <ServiceMultiSelect
          options={serviceOptions}
          selected={form.selectedSortOrders}
          onChange={(selectedSortOrders) => setForm({ ...form, selectedSortOrders })}
        />
        <p className="mt-1 text-xs text-gray dark:text-gray-400">Open dropdown and select one or more services</p>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Payout type</span>
        <select className={inputClass} value={form.payoutType} onChange={(e) => setForm({ ...form, payoutType: e.target.value })}>
          {PAYOUT_TYPES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Commission value</span>
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
    if (f.selectedSortOrders.length === 0) return "Select at least one service.";
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

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-midnight_text focus:outline-none focus:ring-2 focus:ring-primary/80 dark:border-dark_border dark:bg-darkmode dark:text-white";

  const deleteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  return (
    <>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add partner
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-dark_border dark:bg-darklight">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-dark_border">
            <thead className="bg-slate-50 dark:bg-semidark">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Services</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Commission</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Created date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark_border">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray dark:text-gray-400">
                    No data to display.
                  </td>
                </tr>
              ) : (
                partners.map((row, i) => (
                  <tr key={String(row.id ?? i)} className="hover:bg-slate-50/80 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">{cellText(row, "name")}</td>
                    <td className="max-w-[280px] truncate whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200" title={servicesText(row)}>
                      {servicesText(row)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">{payoutText(row)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">{createdDateText(row)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <IconButton label="View" onClick={() => setViewRow(row)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </IconButton>
                        <IconButton label="Edit" onClick={() => openEdit(row)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </IconButton>
                        <IconButton label="Delete" variant="danger" onClick={() => { setDeleteRow(row); setError(null); }}>
                          {deleteIcon}
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewRow && (
        <ModalShell title="Partner details" wide onClose={() => setViewRow(null)}>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 p-5 sm:grid-cols-2">
            {VIEW_FIELDS.map((key) => (
              <li key={key} className="flex flex-wrap items-baseline gap-1 text-sm">
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">{FIELD_LABELS[key] ?? key}:</span>
                <span className="text-midnight_text dark:text-gray-200">{formatValue(key, viewRow[key])}</span>
              </li>
            ))}
          </ul>
        </ModalShell>
      )}

      {createOpen && (
        <ModalShell title="Add partner" onClose={closeModals}>
          <form onSubmit={handleCreate} className="space-y-4 p-5">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
            <PartnerFormFields form={form} setForm={setForm} inputClass={inputClass} serviceOptions={serviceOptions} />
            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-dark_border">
              <button type="button" onClick={closeModals} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-dark_border dark:text-white">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {saving ? "Saving…" : "Create"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {editRow && (
        <ModalShell title="Edit partner" onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-4 p-5">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
            <PartnerFormFields form={form} setForm={setForm} inputClass={inputClass} serviceOptions={serviceOptions} />
            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-dark_border">
              <button type="button" onClick={closeModals} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-dark_border dark:text-white">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {deleteRow && (
        <ModalShell title="Delete partner" onClose={closeModals}>
          <div className="p-5">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete partner <strong>{cellText(deleteRow, "name")}</strong>? This cannot be undone.
            </p>
            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeModals} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-dark_border dark:text-white">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmDelete} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </>
  );
}
