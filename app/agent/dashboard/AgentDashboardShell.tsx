"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_UI } from "@/app/admin/dashboard/adminUi";

export default function AgentDashboardShell({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/agent/auth/logout", { method: "POST" });
      router.replace("/agent/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh]" style={{ backgroundColor: ADMIN_UI.surface }}>
      <aside
        className="hidden w-64 shrink-0 flex-col border-r lg:flex"
        style={{ backgroundColor: ADMIN_UI.sidebar, borderColor: ADMIN_UI.sidebarBorder }}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#1B2A6B]">
            AZ
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Agent portal</p>
            <p className="text-[11px] text-indigo-200">Affiliate desk</p>
          </div>
        </div>
        <nav className="flex-1 px-3">
          <Link
            href="/agent/dashboard"
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-[#1B2A6B]"
          >
            Overview
          </Link>
        </nav>
        <div className="border-t px-5 py-4" style={{ borderColor: ADMIN_UI.sidebarBorder }}>
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="text-[11px] text-indigo-200">Affiliate partner</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-20 flex h-[4.5rem] items-center justify-between gap-4 border-b px-4 sm:px-6"
          style={{ backgroundColor: ADMIN_UI.sidebar, borderColor: ADMIN_UI.sidebarBorder }}
        >
          <div>
            <h1 className="text-lg font-semibold text-white">Affiliate overview</h1>
            <p className="hidden text-xs text-indigo-200 sm:block">Your link, QR and referred clients</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={loggingOut}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
          >
            {loggingOut ? "…" : "Logout"}
          </button>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
