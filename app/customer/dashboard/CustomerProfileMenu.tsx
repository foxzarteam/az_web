"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminModal from "@/app/admin/dashboard/AdminModal";

type CustomerProfile = {
  name: string;
  mobile: string;
  email: string | null;
  pan: string | null;
  totalApplications: number;
  memberSince: string | null;
};

type Mode = "view" | "edit";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CustomerProfileMenu({
  name,
  mobile,
}: {
  name: string;
  mobile: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "" });
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.name || name;

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const loadProfile = useCallback(async (): Promise<CustomerProfile | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/customer/profile", { cache: "no-store" });
      const data = (await res.json()) as { profile?: CustomerProfile; error?: string };
      if (!res.ok || !data.profile) {
        setError(data.error ?? "Could not load profile");
        return null;
      }
      setProfile(data.profile);
      return data.profile;
    } catch {
      setError("Network error. Try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  async function openView() {
    setOpen(false);
    setMode("view");
    await loadProfile();
  }

  async function openEdit() {
    setOpen(false);
    setMode("edit");
    const loaded = profile ?? (await loadProfile());
    setForm({
      fullName: loaded?.name ?? name,
      email: loaded?.email ?? "",
    });
  }

  function closeModal() {
    setMode(null);
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (form.fullName.trim().length < 2) {
      setError("Enter your full name");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
        }),
      });
      const data = (await res.json()) as { profile?: CustomerProfile; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Update failed");
        return;
      }
      if (data.profile) setProfile(data.profile);
      setMode("view");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Profile menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#ff7a1a] text-sm font-bold text-white shadow-sm ring-2 ring-white transition hover:opacity-90 focus:outline-none focus-visible:ring-primary/40"
        >
          {initials(displayName)}
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-xl border border-black/5 bg-white shadow-lg"
          >
            <div className="border-b border-black/5 px-4 py-3">
              <p className="truncate text-sm font-semibold text-midnight_text">{displayName}</p>
              <p className="text-xs text-gray-500">+91 {mobile}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => void openView()}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-midnight_text transition hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
              </svg>
              View profile
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => void openEdit()}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-midnight_text transition hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit profile
            </button>
          </div>
        )}
      </div>

      {mode === "view" && (
        <AdminModal title="My profile" onClose={closeModal}>
          <div className="p-6 sm:p-8">
            {loading && <p className="text-sm text-gray-500">Loading…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {profile && !loading && (
              <>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#ff7a1a] text-lg font-bold text-white">
                    {initials(profile.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-midnight_text">{profile.name}</p>
                    <p className="text-sm text-gray-500">+91 {profile.mobile}</p>
                  </div>
                </div>

                <dl className="mt-6 space-y-3 text-sm">
                  {[
                    { label: "Email", value: profile.email || "—" },
                    { label: "PAN", value: profile.pan || "—" },
                    { label: "Applications", value: String(profile.totalApplications) },
                    { label: "Member since", value: formatDate(profile.memberSince) },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between gap-4 border-b border-gray-100 pb-2 last:border-0"
                    >
                      <dt className="text-gray-500">{row.label}</dt>
                      <dd className="text-right font-medium text-midnight_text">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-midnight_text hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ fullName: profile.name, email: profile.email ?? "" });
                      setMode("edit");
                      setError(null);
                    }}
                    className="btn-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  >
                    Edit profile
                  </button>
                </div>
              </>
            )}
          </div>
        </AdminModal>
      )}

      {mode === "edit" && (
        <AdminModal title="Edit profile" onClose={closeModal}>
          <form onSubmit={handleSave} className="p-6 sm:p-8" noValidate>
            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
            <div className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Full name
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-midnight_text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="enter name"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </span>
                <input
                  type="email"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-midnight_text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="enter email"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Mobile
                </span>
                <input
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-gray-500"
                  value={`+91 ${mobile}`}
                  readOnly
                  disabled
                />
                <span className="mt-1 block text-xs text-gray-500">
                  Mobile number cannot be changed.
                </span>
              </label>
            </div>
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-midnight_text hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}
