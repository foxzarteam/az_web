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

  const btn =
    "inline-flex h-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition sm:text-sm";

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex flex-nowrap items-center gap-1.5">
        <button
          type="button"
          onClick={onViewPolicy}
          className={`${btn} min-w-0 flex-1 border-[#4236FB] px-2.5 text-[#4236FB] hover:bg-[#EEF0FF]`}
        >
          View Policy
        </button>
        <button
          type="button"
          disabled={!utm}
          onClick={() => void copyLink()}
          title={copied ? "Copied" : "Copy link"}
          aria-label={copied ? "Copied" : "Copy link"}
          className={`${btn} h-9 w-9 border-slate-200 text-slate-600 hover:border-[#4236FB]/40 hover:text-[#4236FB] disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
        <button
          type="button"
          disabled={!utm}
          onClick={() => void applyNow()}
          className={`${btn} min-w-0 flex-1 border-transparent bg-[#4236FB] px-2.5 text-white hover:bg-[#352cd4] disabled:cursor-not-allowed disabled:opacity-40`}
        >
          Apply now
        </button>
      </div>
      {extra ? <div className="flex flex-wrap gap-2">{extra}</div> : null}
    </div>
  );
}
