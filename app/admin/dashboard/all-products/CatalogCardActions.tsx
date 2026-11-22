"use client";

import { useState } from "react";
import { partnerUtmLink } from "@/app/admin/dashboard/partners/aggregatorDisplay";

function applyHref(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

const iconBtn =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40";

export default function CatalogCardActions({
  row,
  onViewPolicy,
  onEdit,
  onDelete,
}: {
  row: Record<string, unknown>;
  onViewPolicy: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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

  const pill =
    "inline-flex h-9 min-w-0 flex-1 items-center justify-center rounded-full border px-2.5 text-xs font-semibold transition sm:text-sm";

  return (
    <div className="mt-4 flex flex-nowrap items-center gap-1.5">
      <button
        type="button"
        onClick={onViewPolicy}
        className={`${pill} border-[#4236FB] text-[#4236FB] hover:bg-[#EEF0FF]`}
      >
        View Policy
      </button>
      <button
        type="button"
        disabled={!utm}
        onClick={() => void applyNow()}
        className={`${pill} border-transparent bg-[#4236FB] text-white hover:bg-[#352cd4] disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Apply now
      </button>
      <button
        type="button"
        disabled={!utm}
        onClick={() => void copyLink()}
        title={copied ? "Copied" : "Copy link"}
        aria-label={copied ? "Copied" : "Copy link"}
        className={`${iconBtn} border-[#4236FB] bg-[#4236FB] hover:bg-[#352cd4]`}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          aria-label="Edit"
          className={`${iconBtn} border-[#FF7E29] bg-[#FF7E29] hover:bg-[#e56e1f]`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          aria-label="Delete"
          className={`${iconBtn} border-rose-500 bg-rose-500 hover:bg-rose-600`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
