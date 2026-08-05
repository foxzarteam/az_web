"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminContactRow } from "@/app/lib/admin/fetchContacts";
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

const STATUSES = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
] as const;

const VIEW_FIELDS = ["name", "email", "phone", "message", "status", "created_at", "updated_at"] as const;

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
  status: "Status",
  created_at: "Created",
  updated_at: "Updated",
};

function formatValue(key: string, value: unknown): string {
  if (value == null || value === "") return "—";
  if (key === "status") {
    return STATUSES.find((s) => s.value === value)?.label ?? String(value);
  }
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    }
  }
  return s;
}

type EditForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
};

function toEditForm(row: AdminContactRow): EditForm {
  return {
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    message: row.message ?? "",
    status: row.status ?? "new",
  };
}

export default function ContactsTable({ initialContacts }: { initialContacts: AdminContactRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialContacts);
  const [viewRow, setViewRow] = useState<AdminContactRow | null>(null);
  const [editRow, setEditRow] = useState<AdminContactRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<AdminContactRow | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialContacts);
  }, [initialContacts]);

  const closeModals = useCallback(() => {
    setViewRow(null);
    setEditRow(null);
    setDeleteRow(null);
    setEditForm(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (editRow) setEditForm(toEditForm(editRow));
  }, [editRow]);

  async function saveEdit() {
    if (!editRow || !editForm) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contacts/${encodeURIComponent(editRow.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || "Update failed");
        return;
      }
      closeModals();
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteRow) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contacts/${encodeURIComponent(deleteRow.id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || "Delete failed");
        return;
      }
      closeModals();
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setDeleting(false);
    }
  }

  const columns: CrmColumn<AdminContactRow>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        sortable: true,
        sortValue: (row) => row.name,
        searchValue: (row) => row.name,
        cell: (row) => row.name || "—",
      },
      {
        id: "email",
        header: "Email",
        sortable: true,
        sortValue: (row) => row.email,
        searchValue: (row) => row.email,
        cell: (row) => row.email || "—",
      },
      {
        id: "phone",
        header: "Phone",
        sortable: true,
        sortValue: (row) => row.phone,
        searchValue: (row) => row.phone,
        cell: (row) => row.phone || "—",
      },
      {
        id: "message",
        header: "Message",
        searchable: true,
        searchValue: (row) => row.message,
        cell: (row) => (
          <span className="line-clamp-2 max-w-[220px] text-sm text-slate-600 dark:text-gray-300">
            {row.message || "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortValue: (row) => row.status,
        searchValue: (row) => row.status,
        cell: (row) => (
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#1E3A8A] dark:bg-blue-950/40 dark:text-blue-200">
            {formatValue("status", row.status)}
          </span>
        ),
      },
      {
        id: "created_at",
        header: "Created",
        sortable: true,
        sortValue: (row) => row.created_at,
        cell: (row) => formatValue("created_at", row.created_at),
      },
      {
        id: "actions",
        header: "Actions",
        searchable: false,
        className: "w-[1%] whitespace-nowrap",
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            <CrmActionButton label="View" variant="view" onClick={() => setViewRow(row)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </CrmActionButton>
            <CrmActionButton label="Edit" onClick={() => setEditRow(row)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </CrmActionButton>
            <CrmActionButton label="Delete" variant="danger" onClick={() => setDeleteRow(row)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
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

  const inputClass = ADMIN_INPUT;

  return (
    <>
      <CrmDataTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        searchPlaceholder="Search contacts…"
        emptyMessage="No contact messages yet."
      />

      {viewRow && (
        <AdminModal title="Contact message" onClose={closeModals}>
          <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8">
            {VIEW_FIELDS.map((key) => (
              <div
                key={key}
                className={`flex flex-wrap items-baseline gap-1 text-sm ${
                  key === "message" ? "sm:col-span-2" : ""
                }`}
              >
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">
                  {FIELD_LABELS[key]}:
                </span>
                <span className="text-midnight_text dark:text-gray-200 whitespace-pre-wrap">
                  {formatValue(key, viewRow[key])}
                </span>
              </div>
            ))}
          </div>
        </AdminModal>
      )}

      {editRow && editForm && (
        <AdminModal
          title="Edit contact"
          onClose={closeModals}
          footer={
            <>
              <button type="button" className={ADMIN_BTN_SECONDARY} onClick={closeModals} disabled={saving}>
                Cancel
              </button>
              <button type="button" className={ADMIN_BTN_PRIMARY} onClick={() => void saveEdit()} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </>
          }
        >
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            {error && <p className={`${ADMIN_ERROR} sm:col-span-2`}>{error}</p>}
            <label className="block">
              <span className={ADMIN_LABEL}>Name</span>
              <input
                className={inputClass}
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className={ADMIN_LABEL}>Email</span>
              <input
                className={inputClass}
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className={ADMIN_LABEL}>Phone</span>
              <input
                className={inputClass}
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
                required
                maxLength={10}
              />
            </label>
            <label className="block">
              <span className={ADMIN_LABEL}>Status</span>
              <select
                className={inputClass}
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className={ADMIN_LABEL}>Message</span>
              <textarea
                className={inputClass}
                rows={4}
                value={editForm.message}
                onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                required
              />
            </label>
          </div>
        </AdminModal>
      )}

      {deleteRow && (
        <AdminModal
          title="Delete contact"
          onClose={closeModals}
          footer={
            <>
              <button type="button" className={ADMIN_BTN_SECONDARY} onClick={closeModals} disabled={deleting}>
                Cancel
              </button>
              <button
                type="button"
                className={ADMIN_BTN_DANGER}
                onClick={() => void confirmDelete()}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </>
          }
        >
          <div className="p-6 sm:p-8">
            <p className="text-sm text-gray dark:text-gray-300">
              Delete message from <strong>{deleteRow.name}</strong> ({deleteRow.email})? This cannot be undone.
            </p>
            {error && <p className={`${ADMIN_ERROR} mt-3`}>{error}</p>}
          </div>
        </AdminModal>
      )}
    </>
  );
}
