"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUserRow } from "@/app/lib/admin/fetchUsers";
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
  "user_name",
  "email",
  "mobile_number",
  "is_active",
  "is_logged_in",
  "last_login_at",
  "created_at",
  "updated_at",
] as const;

const FIELD_LABELS: Record<string, string> = {
  user_name: "Name",
  email: "Email",
  mobile_number: "Phone",
  is_active: "Active",
  is_logged_in: "Logged in",
  last_login_at: "Last login",
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

function cellText(row: AdminUserRow, key: "user_name" | "email" | "mobile_number"): string {
  const v = row[key];
  if (v == null || v === "") return "—";
  return String(v);
}

function createdDateText(row: AdminUserRow): string {
  return formatValue("created_at", row.created_at);
}

type EditForm = {
  userName: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  isLoggedIn: boolean;
};

function userToEditForm(user: AdminUserRow): EditForm {
  return {
    userName: String(user.user_name ?? ""),
    email: String(user.email ?? ""),
    mobileNumber: String(user.mobile_number ?? ""),
    isActive: user.is_active !== false,
    isLoggedIn: user.is_logged_in === true,
  };
}

export default function UsersTable({ initialUsers }: { initialUsers: AdminUserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [viewUser, setViewUser] = useState<AdminUserRow | null>(null);
  const [editUser, setEditUser] = useState<AdminUserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUserRow | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const closeModals = useCallback(() => {
    setViewUser(null);
    setEditUser(null);
    setDeleteUser(null);
    setEditForm(null);
    setError(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    if (viewUser || editUser || deleteUser) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [viewUser, editUser, deleteUser, closeModals]);

  function openEdit(user: AdminUserRow) {
    setEditUser(user);
    setEditForm(userToEditForm(user));
    setError(null);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser?.id || !editForm) return;

    setSaving(true);
    setError(null);

    const payload = {
      userName: editForm.userName.trim(),
      email: editForm.email.trim(),
      mobileNumber: editForm.mobileNumber.trim(),
      isActive: editForm.isActive,
      isLoggedIn: editForm.isLoggedIn,
    };

    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(String(editUser.id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; data?: AdminUserRow; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Update failed");
        return;
      }
      if (data.data) {
        setUsers((prev) => prev.map((u) => (u.id === data.data!.id ? data.data! : u)));
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
    if (!deleteUser?.id) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(String(deleteUser.id))}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? data.message ?? "Delete failed");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      closeModals();
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  const inputClass = ADMIN_INPUT;

  const columns = useMemo<CrmColumn<AdminUserRow>[]>(
    () => [
      {
        id: "user_name",
        header: "Name",
        sortable: true,
        sortValue: (row) => String(row.user_name ?? ""),
        searchValue: (row) => cellText(row, "user_name"),
        cell: (row) => cellText(row, "user_name"),
      },
      {
        id: "email",
        header: "Email",
        sortable: true,
        sortValue: (row) => String(row.email ?? ""),
        searchValue: (row) => cellText(row, "email"),
        className: "max-w-[200px] truncate whitespace-nowrap",
        cell: (row) => cellText(row, "email"),
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
            <CrmActionButton label="View" variant="view" onClick={() => setViewUser(row)}>
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
                setDeleteUser(row);
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
        rows={users}
        columns={columns}
        getRowId={(row, i) => String(row.id ?? i)}
        searchPlaceholder="Search name, email, phone…"
        emptyMessage="No agents to display."
      />

      {viewUser && (
        <AdminModal title="User details" wide onClose={() => setViewUser(null)}>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2 sm:p-8">
            {VIEW_FIELDS.map((key) => (
              <li key={key} className="flex flex-wrap items-baseline gap-1 text-sm">
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">
                  {FIELD_LABELS[key] ?? key}:
                </span>
                <span className="text-midnight_text dark:text-gray-200">{formatValue(key, viewUser[key])}</span>
              </li>
            ))}
          </ul>
        </AdminModal>
      )}

      {editUser && editForm && (
        <AdminModal title="Edit user" wide onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-6 p-6 sm:p-8">
            {error && <p className={ADMIN_ERROR}>{error}</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className={ADMIN_LABEL}>Name</span>
                <input
                  className={inputClass}
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Email</span>
                <input
                  type="email"
                  className={inputClass}
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Phone</span>
                <input
                  className={inputClass}
                  value={editForm.mobileNumber}
                  onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                  required
                  maxLength={10}
                />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-midnight_text dark:text-white">Active account</span>
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={editForm.isLoggedIn}
                  onChange={(e) => setEditForm({ ...editForm, isLoggedIn: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-midnight_text dark:text-white">Logged in</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-dark_border">
              <button
                type="button"
                onClick={closeModals}
                className={ADMIN_BTN_SECONDARY}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className={ADMIN_BTN_PRIMARY}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {deleteUser && (
        <AdminModal title="Delete user" onClose={closeModals}>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete user <strong>{cellText(deleteUser, "user_name")}</strong> ({cellText(deleteUser, "mobile_number")})?
              This cannot be undone.
            </p>
            {error && <p className={`mt-3 ${ADMIN_ERROR}`}>{error}</p>}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModals}
                className={ADMIN_BTN_SECONDARY}
              >
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
