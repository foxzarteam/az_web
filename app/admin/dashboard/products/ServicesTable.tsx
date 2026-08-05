"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminServiceRow } from "@/app/lib/admin/fetchServices";
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

  const inputClass = ADMIN_INPUT;

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

  const columns = useMemo<CrmColumn<AdminServiceRow>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        sortable: true,
        sortValue: (row) => String(row.title ?? ""),
        searchValue: (row) => cellText(row, "title"),
        className: "max-w-[240px] truncate whitespace-nowrap",
        cell: (row) => cellText(row, "title"),
      },
      {
        id: "is_active",
        header: "Active",
        sortable: true,
        sortValue: (row) => (row.is_active === false ? 0 : 1),
        searchValue: (row) => activeText(row),
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              row.is_active === false
                ? "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-gray-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            }`}
          >
            {activeText(row)}
          </span>
        ),
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
            <CrmActionButton label="View" variant="view" onClick={() => setViewRow(row)}>
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
        rows={services}
        columns={columns}
        getRowId={(row, i) => String(row.id ?? i)}
        searchPlaceholder="Search products…"
        emptyMessage="No products to display."
      />

      {viewRow && (
        <AdminModal title="Product details" wide onClose={() => setViewRow(null)}>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2 sm:p-8">
            {VIEW_FIELDS.map((key) => (
              <li key={key} className={`flex flex-wrap items-baseline gap-1 text-sm ${key === "description" ? "sm:col-span-2" : ""}`}>
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">
                  {FIELD_LABELS[key] ?? key}:
                </span>
                <span className="text-midnight_text dark:text-gray-200 break-all">{formatValue(key, viewRow[key])}</span>
              </li>
            ))}
          </ul>
        </AdminModal>
      )}

      {editRow && editForm && (
        <AdminModal title="Edit product" wide onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-6 p-6 sm:p-8">
            {error && <p className={ADMIN_ERROR}>{error}</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className={ADMIN_LABEL}>Title</span>
                <input className={inputClass} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Slug</span>
                <input className={inputClass} value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} required />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Sort order</span>
                <input type="number" min={0} className={inputClass} value={editForm.sortOrder} onChange={(e) => setEditForm({ ...editForm, sortOrder: e.target.value })} />
              </label>
              <label className="block sm:col-span-2">
                <span className={ADMIN_LABEL}>Description</span>
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
        <AdminModal title="Delete product" onClose={closeModals}>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete product <strong>{cellText(deleteRow, "title")}</strong>? This cannot be undone.
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
