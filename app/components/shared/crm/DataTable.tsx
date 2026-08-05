"use client";

import { useMemo, useState } from "react";

export type CrmColumn<T> = {
  id: string;
  header: string;
  sortable?: boolean;
  /** Include this column in global search (default true unless actions). */
  searchable?: boolean;
  sortValue?: (row: T) => string | number | boolean | null | undefined;
  searchValue?: (row: T) => string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type SortDir = "asc" | "desc";

type Props<T> = {
  rows: T[];
  columns: CrmColumn<T>[];
  getRowId: (row: T, index: number) => string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
};

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return String(a).localeCompare(String(b), "en", { numeric: true, sensitivity: "base" });
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={`ml-1 inline-flex flex-col leading-none ${active ? "text-[#4236FB]" : "text-slate-300"}`}
      aria-hidden
    >
      <svg width="8" height="8" viewBox="0 0 8 8" className={active && dir === "asc" ? "opacity-100" : "opacity-40"}>
        <path d="M4 1.5 6.5 4.5h-5L4 1.5Z" fill="currentColor" />
      </svg>
      <svg width="8" height="8" viewBox="0 0 8 8" className={`-mt-0.5 ${active && dir === "desc" ? "opacity-100" : "opacity-40"}`}>
        <path d="M4 6.5 1.5 3.5h5L4 6.5Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function CrmDataTable<T>({
  rows,
  columns,
  getRowId,
  searchPlaceholder = "Search…",
  emptyMessage = "No records found.",
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  toolbarLeft,
  toolbarRight,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [sortId, setSortId] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      columns.some((col) => {
        if (col.searchable === false) return false;
        const raw = col.searchValue?.(row);
        if (raw != null) return String(raw).toLowerCase().includes(q);
        if (col.sortValue) return String(col.sortValue(row) ?? "").toLowerCase().includes(q);
        return false;
      }),
    );
  }, [rows, columns, query]);

  const sorted = useMemo(() => {
    if (!sortId) return filtered;
    const col = columns.find((c) => c.id === sortId);
    if (!col?.sortable || !col.sortValue) return filtered;
    const list = [...filtered];
    list.sort((ra, rb) => {
      const cmp = compareValues(col.sortValue!(ra), col.sortValue!(rb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, columns, sortId, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);
  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + pageSize, total);

  function toggleSort(col: CrmColumn<T>) {
    if (!col.sortable) return;
    if (sortId === col.id) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortId(col.id);
      setSortDir("asc");
    }
    setPage(1);
  }

  function onSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  function onPageSizeChange(value: number) {
    setPageSize(value);
    setPage(1);
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-dark_border dark:bg-darklight">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 dark:border-dark_border sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {toolbarLeft}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4236FB] focus:ring-2 focus:ring-[#4236FB]/20 dark:border-dark_border dark:bg-darkmode dark:text-white"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {toolbarRight}
          <label className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-gray-400">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 min-w-[4.5rem] rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800 outline-none focus:border-[#4236FB] focus:ring-2 focus:ring-[#4236FB]/20 dark:border-dark_border dark:bg-darkmode dark:text-white"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-dark_border dark:bg-semidark/50">
              {columns.map((col) => {
                const active = sortId === col.id;
                return (
                  <th
                    key={col.id}
                    className={`whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-300 ${
                      col.sortable ? "cursor-pointer select-none hover:text-[#4236FB]" : ""
                    } ${active ? "text-[#4236FB]" : ""}`}
                    onClick={() => toggleSort(col)}
                    aria-sort={
                      !col.sortable ? undefined : active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                    }
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {col.sortable && <SortIcon active={active} dir={sortDir} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark_border">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500 dark:text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={getRowId(row, start + i)}
                  className="transition hover:bg-blue-50/60 dark:hover:bg-white/5"
                >
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={`px-4 py-3 text-slate-700 dark:text-gray-200 ${col.className ?? "whitespace-nowrap"}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-dark_border dark:bg-semidark/40 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Showing <span className="font-semibold text-slate-700 dark:text-gray-200">{showingFrom}</span>
          {"–"}
          <span className="font-semibold text-slate-700 dark:text-gray-200">{showingTo}</span>
          {" of "}
          <span className="font-semibold text-slate-700 dark:text-gray-200">{total}</span>
          {query.trim() ? " filtered" : ""} records
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage(1)}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark_border dark:bg-darklight dark:text-gray-300"
            aria-label="First page"
          >
            «
          </button>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark_border dark:bg-darklight dark:text-gray-300"
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="px-2 text-xs font-medium text-slate-600 dark:text-gray-300">
            Page {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark_border dark:bg-darklight dark:text-gray-300"
            aria-label="Next page"
          >
            ›
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(totalPages)}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark_border dark:bg-darklight dark:text-gray-300"
            aria-label="Last page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

export function CrmActionButton({
  label,
  onClick,
  children,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "view" | "danger";
}) {
  const styles =
    variant === "danger"
      ? "border-red-200 bg-red-50/60 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
      : variant === "view"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10 hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800 hover:shadow-md hover:shadow-emerald-500/15 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
        : "border-slate-200 text-slate-600 hover:border-[#4236FB]/30 hover:bg-[#EEF0FF] hover:text-[#4236FB] dark:border-dark_border dark:text-gray-200 dark:hover:bg-white/10";

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${styles}`}
    >
      {children}
    </button>
  );
}
