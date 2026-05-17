"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboardShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleSidebar() {
    setSidebarOpen((v) => !v);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSidebar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-[100dvh] bg-slate-50 dark:bg-darkmode">
      <header className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-dark_border dark:bg-semidark lg:hidden">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-midnight_text transition hover:bg-gray-100 dark:border-dark_border dark:text-white dark:hover:bg-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Apni Zaroorat</p>
          <p className="truncate text-sm font-semibold text-midnight_text dark:text-white">Admin</p>
        </div>
      </header>

      <button
        type="button"
        aria-label="Close menu"
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <AdminSidebar email={email} open={sidebarOpen} onClose={closeSidebar} />

      <div className="min-w-0 flex-1 pt-[4.25rem] lg:pt-0">{children}</div>
    </div>
  );
}
