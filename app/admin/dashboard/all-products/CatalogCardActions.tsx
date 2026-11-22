"use client";

import { useState } from "react";
import { partnerUtmLink } from "@/app/admin/dashboard/partners/aggregatorDisplay";

function applyHref(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export default function CatalogCardActions({
  row,
  onViewPolicy,
  extra,
}: {
  row: Record<string, unknown>;
  onViewPolicy: () => void;
  extra?: React.ReactNode;
}) {
  const utm = partnerUtmLink(row);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!utm) return;
    try {
      await navigator.clipboard.writeText(utm);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function applyNow() {
    if (!utm) return;
    try {
      await navigator.clipboard.writeText(utm);
    } catch {
      /* still open */
    }
    window.open(applyHref(utm), "_blank", "noopener,noreferrer");
  }

  const outline =
    "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold transition";

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onViewPolicy}
        className={`${outline} border-[#4236FB] text-[#4236FB] hover:bg-[#EEF0FF]`}
      >
        View Policy
      </button>
      <button
        type="button"
        disabled={!utm}
        onClick={() => void copyLink()}
        className={`${outline} border-slate-200 text-slate-600 hover:border-[#4236FB]/40 hover:text-[#4236FB] disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        disabled={!utm}
        onClick={() => void applyNow()}
        className={`${outline} border-slate-200 bg-[#4236FB] text-white hover:bg-[#352cd4] disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Apply now
      </button>
      {extra}
    </div>
  );
}
