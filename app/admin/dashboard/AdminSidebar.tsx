"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Leads", href: "/admin/dashboard/leads" },
  { label: "Agents", href: "/admin/dashboard/users" },
  { label: "Products", href: "/admin/dashboard/products" },
  { label: "Partners", href: "/admin/dashboard/partners" },
];

type Props = {
  email: string;
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ email, open, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-dark_border dark:bg-semidark lg:static lg:z-auto lg:w-56 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="border-b border-gray-200 px-4 py-5 dark:border-dark_border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Apni Zaroorat</p>
            <p className="mt-1 text-sm font-semibold text-midnight_text dark:text-white">Admin</p>
            <p className="mt-2 truncate text-xs text-gray dark:text-gray-400" title={email}>
              {email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-midnight_text transition hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {nav.map((item) => {
          const active =
            item.href === "/admin/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-200"
                  : "text-midnight_text hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 p-3 dark:border-dark_border">
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-left text-sm font-medium text-midnight_text transition hover:bg-gray-50 disabled:opacity-60 dark:border-dark_border dark:text-white dark:hover:bg-white/5"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
        <Link
          href="/"
          onClick={onClose}
          className="mt-2 block rounded-lg px-3 py-2 text-center text-xs text-gray hover:text-primary dark:text-gray-400"
        >
          View website
        </Link>
      </div>
    </aside>
  );
}
