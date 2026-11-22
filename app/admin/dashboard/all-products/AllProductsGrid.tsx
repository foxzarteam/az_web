"use client";

import { useMemo, useState } from "react";
import type { AdminPartnerRow } from "@/app/lib/admin/fetchPartners";
import AggregatorDetailsModal from "@/app/admin/dashboard/partners/AggregatorDetailsModal";
import CatalogCardActions from "./CatalogCardActions";
import {
  partnerName,
  partnerPolicyText,
  partnerProductLabel,
  partnerProductList,
  partnerImageSrc,
} from "@/app/admin/dashboard/partners/aggregatorDisplay";

export default function AllProductsGrid({
  partners,
  headerRight,
  onEdit,
  onDelete,
}: {
  partners: AdminPartnerRow[];
  headerRight?: React.ReactNode;
  onEdit?: (row: AdminPartnerRow) => void;
  onDelete?: (row: AdminPartnerRow) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<AdminPartnerRow | null>(null);

  const filters = useMemo(() => {
    const names = new Set<string>();
    for (const row of partners) {
      for (const name of partnerProductList(row)) names.add(name);
    }
    return ["All", ...[...names].sort((a, b) => a.localeCompare(b))];
  }, [partners]);

  const rows = useMemo(() => {
    if (filter === "All") return partners;
    return partners.filter((row) => partnerProductList(row).includes(filter));
  }, [partners, filter]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = item === filter;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#4236FB] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#4236FB]/40 hover:text-[#4236FB]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        {headerRight}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          No products to show.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => {
            const name = partnerName(row);
            const product = partnerProductLabel(row);
            const policy = partnerPolicyText(row);
            const imageSrc = partnerImageSrc(row);
            const letter = name.trim().charAt(0).toUpperCase() || "A";
            return (
              <article
                key={String(row.id ?? index)}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 bg-white object-contain p-1"
                    />
                  ) : (
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FF] text-sm font-bold text-[#4236FB]">
                      {letter}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-slate-900">{name}</h2>
                    <p className="truncate text-sm text-slate-500">{product}</p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-slate-500">
                  {policy || "No policy added yet."}
                </p>

                <CatalogCardActions
                  row={row}
                  onViewPolicy={() => setOpen(row)}
                  onEdit={onEdit ? () => onEdit(row) : undefined}
                  onDelete={onDelete ? () => onDelete(row) : undefined}
                />
              </article>
            );
          })}
        </div>
      )}

      {open ? <AggregatorDetailsModal row={open} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
