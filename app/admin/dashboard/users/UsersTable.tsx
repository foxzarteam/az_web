"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AdminUserRow } from "@/app/lib/admin/fetchUsers";

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

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-midnight_text focus:outline-none focus:ring-2 focus:ring-primary/80 dark:border-dark_border dark:bg-darkmode dark:text-white";

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-dark_border dark:bg-darklight">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-dark_border">
            <thead className="bg-slate-50 dark:bg-semidark">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Email</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Phone</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Created date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-midnight_text dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark_border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray dark:text-gray-400">
                    No data to display.
                  </td>
                </tr>
              ) : (
                users.map((row, i) => (
                  <tr key={String(row.id ?? i)} className="hover:bg-slate-50/80 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">
                      {cellText(row, "user_name")}
                    </td>
                    <td className="max-w-[200px] truncate whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">
                      {cellText(row, "email")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">
                      {cellText(row, "mobile_number")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-midnight_text dark:text-gray-200">{createdDateText(row)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <IconButton label="View" onClick={() => setViewUser(row)}>
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
                        <IconButton label="Delete" variant="danger" onClick={() => { setDeleteUser(row); setError(null); }}>
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

      {viewUser && (
        <ModalShell title="User details" wide onClose={() => setViewUser(null)}>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 p-5 sm:grid-cols-2">
            {VIEW_FIELDS.map((key) => (
              <li key={key} className="flex flex-wrap items-baseline gap-1 text-sm">
                <span className="shrink-0 font-semibold text-midnight_text dark:text-white">
                  {FIELD_LABELS[key] ?? key}:
                </span>
                <span className="text-midnight_text dark:text-gray-200">{formatValue(key, viewUser[key])}</span>
              </li>
            ))}
          </ul>
        </ModalShell>
      )}

      {editUser && editForm && (
        <ModalShell title="Edit user" onClose={closeModals}>
          <form onSubmit={handleSaveEdit} className="space-y-4 p-5">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Name</span>
                <input
                  className={inputClass}
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Email</span>
                <input
                  type="email"
                  className={inputClass}
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-midnight_text dark:text-white">Phone</span>
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
            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-dark_border">
              <button
                type="button"
                onClick={closeModals}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-dark_border dark:text-white"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {deleteUser && (
        <ModalShell title="Delete user" onClose={closeModals}>
          <div className="p-5">
            <p className="text-sm text-midnight_text dark:text-gray-200">
              Delete user <strong>{cellText(deleteUser, "user_name")}</strong> ({cellText(deleteUser, "mobile_number")})?
              This cannot be undone.
            </p>
            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModals}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-dark_border dark:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </>
  );
}
