"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Leads", href: "/admin/dashboard/leads" },
  { label: "Agents", href: "/admin/dashboard/users" },
  { label: "Services", href: "/admin/dashboard/services" },
  { label: "Partners", href: "/admin/dashboard/partners" },
];

export default function AdminSidebar({ email }: { email: string }) {
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
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-dark_border dark:bg-semidark">
      <div className="border-b border-gray-200 px-4 py-5 dark:border-dark_border">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Apni Zaroorat</p>
        <p className="mt-1 text-sm font-semibold text-midnight_text dark:text-white">Admin</p>
        <p className="mt-2 truncate text-xs text-gray dark:text-gray-400" title={email}>
          {email}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {nav.map((item) => {
          const active =
            item.href === "/admin/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
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
          className="mt-2 block rounded-lg px-3 py-2 text-center text-xs text-gray hover:text-primary dark:text-gray-400"
        >
          View website
        </Link>
      </div>
    </aside>
  );
}
