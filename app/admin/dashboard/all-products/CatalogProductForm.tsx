"use client";

import { useEffect, useRef, useState } from "react";
import type { AdminPartnerRow, PartnerServiceOption } from "@/app/lib/admin/fetchPartners";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/app/components/shared/crm/ui";
import { parsePartnerDocuments, REQUIRED_DOCUMENTS } from "@/app/admin/dashboard/partners/aggregatorDisplay";

export type CatalogProductFormValue = {
  name: string;
  selectedSortOrders: number[];
  policy: string;
  requiredDocuments: string[];
  utmLink: string;
  imagePath: string;
};

export function emptyCatalogForm(): CatalogProductFormValue {
  return {
    name: "",
    selectedSortOrders: [],
    policy: "",
    requiredDocuments: [],
    utmLink: "",
    imagePath: "",
  };
}

export function rowToCatalogForm(row: AdminPartnerRow): CatalogProductFormValue {
  const orders = String(row.service_id ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
  return {
    name: String(row.name ?? ""),
    selectedSortOrders: orders,
    policy: String(row.policy ?? ""),
    requiredDocuments: parsePartnerDocuments(row.required_documents),
    utmLink: String(row.utm_link ?? ""),
    imagePath: String(row.image_path ?? ""),
  };
}

function DropdownPanel({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-dark_border dark:bg-darkmode">
      {children}
    </div>
  );
}

function ServiceMultiSelect({
  options,
  selected,
  onChange,
}: {
  options: PartnerServiceOption[];
  selected: number[];
  onChange: (orders: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  if (options.length === 0) {
    return <p className="text-sm text-gray dark:text-gray-400">No active products found.</p>;
  }

  const selectedTitles = options.filter((o) => selected.includes(o.sortOrder)).map((o) => o.title);
  const triggerLabel = selectedTitles.length > 0 ? selectedTitles.join(", ") : "Select products";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`${ADMIN_INPUT} text-left`}
      >
        <span className={`block truncate text-left ${selectedTitles.length === 0 ? "text-gray dark:text-gray-400" : ""}`}>
          {triggerLabel}
        </span>
      </button>
      <DropdownPanel open={open}>
        <ul className="divide-y divide-gray-100 dark:divide-dark_border" role="listbox" aria-multiselectable>
          {options.map((opt) => (
            <li key={opt.sortOrder} role="option" aria-selected={selected.includes(opt.sortOrder)}>
              <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.sortOrder)}
                  onChange={() =>
                    onChange(
                      selected.includes(opt.sortOrder)
                        ? selected.filter((s) => s !== opt.sortOrder)
                        : [...selected, opt.sortOrder].sort((a, b) => a - b),
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-midnight_text dark:text-white">{opt.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </DropdownPanel>
    </div>
  );
}

function DocumentMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (docs: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const triggerLabel = selected.length > 0 ? selected.join(", ") : "Select documents";

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={`${ADMIN_INPUT} text-left`}>
        <span className={`block truncate text-left ${selected.length === 0 ? "text-gray dark:text-gray-400" : ""}`}>
          {triggerLabel}
        </span>
      </button>
      <DropdownPanel open={open}>
        <ul className="divide-y divide-gray-100 dark:divide-dark_border" role="listbox" aria-multiselectable>
          {REQUIRED_DOCUMENTS.map((doc) => (
            <li key={doc} role="option" aria-selected={selected.includes(doc)}>
              <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={selected.includes(doc)}
                  onChange={() =>
                    onChange(selected.includes(doc) ? selected.filter((item) => item !== doc) : [...selected, doc])
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-midnight_text dark:text-white">{doc}</span>
              </label>
            </li>
          ))}
        </ul>
      </DropdownPanel>
    </div>
  );
}

export default function CatalogProductForm({
  form,
  setForm,
  serviceOptions,
  onPickImage,
}: {
  form: CatalogProductFormValue;
  setForm: (f: CatalogProductFormValue) => void;
  serviceOptions: PartnerServiceOption[];
  onPickImage: (file: File | null) => void;
}) {
  return (
    <div className="grid gap-5">
      <label className="block">
        <span className={ADMIN_LABEL}>Name</span>
        <input
          className={ADMIN_INPUT}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="enter name"
          required
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="block min-w-0">
          <span className={ADMIN_LABEL}>Products</span>
          <ServiceMultiSelect
            options={serviceOptions}
            selected={form.selectedSortOrders}
            onChange={(selectedSortOrders) => setForm({ ...form, selectedSortOrders })}
          />
        </div>
        <div className="block min-w-0">
          <span className={ADMIN_LABEL}>Required documents</span>
          <DocumentMultiSelect
            selected={form.requiredDocuments}
            onChange={(requiredDocuments) => setForm({ ...form, requiredDocuments })}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className={ADMIN_LABEL}>UTM link</span>
          <input
            className={ADMIN_INPUT}
            value={form.utmLink}
            onChange={(e) => setForm({ ...form, utmLink: e.target.value })}
            placeholder="https://..."
          />
        </label>
        <label className="block min-w-0">
          <span className={ADMIN_LABEL}>Logo image</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={ADMIN_INPUT}
            onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <label className="block">
        <span className={ADMIN_LABEL}>Policy</span>
        <textarea
          className={`${ADMIN_INPUT} min-h-[8rem] resize-y`}
          value={form.policy}
          onChange={(e) => setForm({ ...form, policy: e.target.value })}
          placeholder="Enter policy"
          rows={6}
        />
      </label>
    </div>
  );
}
