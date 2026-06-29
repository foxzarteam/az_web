"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AdminServiceRow } from "@/app/lib/admin/fetchServices";

const VIEW_FIELDS = [
  "title",
  "slug",
  "description",
  "sort_order",
  "is_active",
  "created_at",
  "updated_at",
] as const;

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  slug: "Slug",
  description: "Description",
  sort_order: "Sort order",
  is_active: "Active",
  created_at: "Created",
  updated_at: "Updated",
};

function formatValue(key: string, value: unknown): string {
  if (value == null || value === "") return "—";
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

function cellText(row: AdminServiceRow, key: "title"): string {
  const v = row[key];
  if (v == null || v === "") return "—";
  return String(v);
}

function activeText(row: AdminServiceRow): string {
  return row.is_active === false ? "No" : "Yes";
}

function createdDateText(row: AdminServiceRow): string {
  return formatValue("created_at", row.created_at);
}

type EditForm = {
  title: string;
  slug: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
};

function serviceToEditForm(row: AdminServiceRow): EditForm {
  return {
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    sortOrder: row.sort_order != null ? String(row.sort_order) : "0",
    isActive: row.is_active !== false,
  };
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

export default function ServicesTable({ initialServices }: { initialServices: AdminServiceRow[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [viewRow, setViewRow] = useState<AdminServiceRow | null>(null);
  const [editRow, setEditRow] = useState<AdminServiceRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<AdminServiceRow | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const closeModals = useCallback(() => {
    setViewRow(null);
    setEditRow(null);
    setDeleteRow(null);
    setEditForm(null);
    setError(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    if (viewRow || editRow || deleteRow) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [viewRow, editRow, deleteRow, closeModals]);

  function openEdit(row: AdminServiceRow) {
    setEditRow(row);
    setEditForm(serviceToEditForm(row));
    setError(null);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editRow?.id || !editForm) return;

    setSaving(true);
    setError(null);

    const payload = {
      title: editForm.title.trim(),
      slug: editForm.slug.trim(),
      description: editForm.description.trim(),
      sortOrder: Number(editForm.sortOrder) || 0,
      isActive: editForm.isActive,
    };

    try {
      const res = await fetch(`/api/admin/services/${encodeURIComponent(String(editRow.id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; data?: AdminServiceRow; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Update failed");
        return;
      }
      if (data.data) {
        setServices((prev) => prev.map((s) => (s.id === data.data!.id ? data.data! : s)));
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
    if (!deleteRow?.id) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/services/${encodeURIComponent(String(deleteRow.id))}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Delete failed");
        return;
      }
      setServices((prev) => prev.filter((s) => s.id !== deleteRow.id));
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-dark_border dark:bg-darklight">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-dark_border">
            <thead className="bg-slate-50 dark:bg-semidark">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Title</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Active</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Created date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark_border">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray dark:text-gray-400">
                    No data to display.
                  </td>
                </tr>
              ) : (
                services.map((row, i) => (
                  <tr key={String(row.id ?? i)} className="hover:bg-slate-50/80 dark:hover:bg-white/5">
                    <td className="max-w-[240px] truncate whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">
                      {cellText(row, "title")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">{activeText(row)}</td>
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
        <ModalShell title="Product details" wide onClose={() => setViewRow(null)}>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 p-5 sm:grid-cols-2">
            {VIEW_FIELDS.map((key) => (
              <li key={key} className={`flex flex-wrap items-baseline gap-1 text-sm ${key === "description" ? "sm:col-span-2" : ""}`}>
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">
                  {FIELD_LABELS[key] ?? key}:
                </span>
                <span className="text-midnight_text dark:text-gray-200 break-all">{formatValue(key, viewRow[key])}</span>
              </li>
            ))}
          </ul>
        </ModalShell>
      )}

      {editRow && editForm && (
        <ModalShell title="Edit product" wide onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-4 p-5">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Title</span>
                <input className={inputClass} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Slug</span>
                <input className={inputClass} value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Sort order</span>
                <input type="number" min={0} className={inputClass} value={editForm.sortOrder} onChange={(e) => setEditForm({ ...editForm, sortOrder: e.target.value })} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Description</span>
                <textarea className={inputClass} rows={4} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-midnight_text dark:text-white">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-dark_border">
              <button type="button" onClick={closeModals} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-dark_border dark:text-white">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-gradient rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {deleteRow && (
        <ModalShell title="Delete product" onClose={closeModals}>
          <div className="p-5">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete product <strong>{cellText(deleteRow, "title")}</strong>? This cannot be undone.
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
