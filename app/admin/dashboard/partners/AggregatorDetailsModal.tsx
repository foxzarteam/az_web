"use client";

import { useState } from "react";
import AdminModal from "@/app/components/shared/crm/AppModal";
import {
  parsePartnerDocuments,
  partnerName,
  partnerProductLabel,
  partnerPolicyText,
  partnerImageSrc,
  partnerUtmLink,
} from "./aggregatorDisplay";

function applyHref(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export default function AggregatorDetailsModal({
  row,
  onClose,
}: {
  row: Record<string, unknown>;
  onClose: () => void;
}) {
  const docs = parsePartnerDocuments(row.required_documents);
  const policy = partnerPolicyText(row);
  const imageSrc = partnerImageSrc(row);
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

  return (
    <AdminModal title="Product details" wide onClose={onClose}>
      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt=""
              className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1.5"
            />
          ) : (
            <div className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-slate-50" />
          )}
          <div className="min-w-0">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {partnerName(row)}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-slate-500">{partnerProductLabel(row)}</p>
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-sm font-semibold text-slate-900 dark:text-white">Required Documents</p>
          {docs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {docs.map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-600 dark:border-dark_border dark:bg-white/5 dark:text-gray-300"
                >
                  {doc}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">—</p>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Policy</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-dark_border">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-[#EEF0FF] to-white px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#4236FB]" aria-hidden />
              <span className="text-xs font-semibold tracking-wide text-[#4236FB]">Policy document</span>
            </div>
            <div className="bg-slate-100 px-5 py-4 text-sm leading-7 whitespace-pre-wrap text-slate-700 dark:bg-white/10 dark:text-gray-200">
              {policy || "—"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={!utm}
            onClick={() => void copyLink()}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2B3A9B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#243286] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? "Copied" : "Copy Link"}
          </button>
          <button
            type="button"
            disabled={!utm}
            onClick={() => void applyNow()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2B3A9B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#243286] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply Now
            <span aria-hidden>↗</span>
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
