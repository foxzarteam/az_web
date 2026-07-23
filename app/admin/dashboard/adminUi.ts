/**
 * Single admin template theme — use these tokens everywhere
 * (shell, sidebar, tables, modals, forms, buttons).
 */
export const ADMIN_UI = {
  primary: "#4236FB",
  primaryHover: "#3528E8",
  primarySoft: "#EEF0FF",
  primaryMuted: "#C7C3FE",
  accent: "#FF7E29",
  sidebar: "#1B2A6B",
  sidebarDeep: "#152456",
  sidebarBorder: "rgba(255,255,255,0.10)",
  sidebarMuted: "#A5B4FC",
  sidebarText: "#E0E7FF",
  surface: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  text: "#0F172A",
  textSecondary: "#334155",
  muted: "#64748B",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
  success: "#059669",
  successSoft: "#ECFDF5",
} as const;

/** Shared form control class — all admin inputs/selects/textareas */
export const ADMIN_INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#4236FB] focus:ring-2 focus:ring-[#4236FB]/20 dark:border-dark_border dark:bg-darkmode dark:text-white";

export const ADMIN_LABEL =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400";

export const ADMIN_BTN_PRIMARY =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4236FB] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3528E8] disabled:cursor-not-allowed disabled:opacity-60";

export const ADMIN_BTN_SECONDARY =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark_border dark:bg-darklight dark:text-white dark:hover:bg-white/5";

export const ADMIN_BTN_DANGER =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60";

export const ADMIN_CARD =
  "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-dark_border dark:bg-darklight";

export const ADMIN_ERROR =
  "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300";
