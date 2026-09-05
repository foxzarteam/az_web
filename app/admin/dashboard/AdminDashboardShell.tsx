"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { ADMIN_UI } from "./adminUi";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of leads, partners and aggregators",
  },
  "/admin/dashboard/leads": {
    title: "Leads",
    subtitle: "Manage and track all incoming leads",
  },
  "/admin/dashboard/earnings": {
    title: "Earning",
    subtitle: "Your commission wallet",
  },
  "/admin/dashboard/users": {
    title: "Partners",
    subtitle: "Manage partner accounts and access",
  },
  "/admin/dashboard/products": {
    title: "Products",
    subtitle: "Configure loan and insurance products",
  },
  "/admin/dashboard/partners": {
    title: "Aggregators",
    subtitle: "Manage lending and insurance aggregators",
  },
  "/admin/dashboard/contacts": {
    title: "Contact",
    subtitle: "Messages from the website contact form",
  },
};

function resolvePageMeta(pathname: string, basePath: "/admin" | "/partner") {
  const normalized = pathname.replace(basePath, "/admin").replace(/\/+$/, "") || "/admin/dashboard";
  if (PAGE_TITLES[normalized]) return PAGE_TITLES[normalized];
  const match = Object.keys(PAGE_TITLES)
    .filter((k) => k !== "/admin/dashboard" && normalized.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return PAGE_TITLES[match] ?? PAGE_TITLES["/admin/dashboard"];
}

export default function AdminDashboardShell({
  role,
  basePath = "/admin",
  children,
}: {
  role: string;
  basePath?: "/admin" | "/partner";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const page = useMemo(() => resolvePageMeta(pathname, basePath), [pathname, basePath]);

  function toggleSidebar() {
    setSidebarOpen((v) => !v);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSidebar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden" style={{ backgroundColor: ADMIN_UI.surface }}>
      <button
        type="button"
        aria-label="Close menu"
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <AdminSidebar
        role={role}
        basePath={basePath}
        open={sidebarOpen}
        onClose={closeSidebar}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header
          className="z-30 shrink-0 border-b shadow-sm"
          style={{
            backgroundColor: ADMIN_UI.sidebar,
            borderColor: ADMIN_UI.sidebarBorder,
          }}
        >
          <div className="flex h-[4.5rem] items-center gap-4 px-4 sm:px-6 lg:px-8" data-admin-topbar>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white transition hover:bg-white/10 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="hidden h-2 w-2 rounded-full sm:inline-flex"
                  style={{ backgroundColor: ADMIN_UI.primary }}
                  aria-hidden
                />
                <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {page.title}
                </h1>
              </div>
              <p
                className="mt-0.5 hidden truncate text-xs sm:block"
                style={{ color: ADMIN_UI.sidebarMuted }}
              >
                {page.subtitle}
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-50 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              System online
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
