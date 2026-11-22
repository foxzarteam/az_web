"use client";

import AdminModal from "@/app/components/shared/crm/AppModal";
import {
  parsePartnerDocuments,
  partnerName,
  partnerProductLabel,
  partnerPolicyText,
  partnerImageSrc,
  partnerUtmLink,
} from "./aggregatorDisplay";

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

  return (
    <AdminModal title="Aggregator details" wide onClose={onClose}>
      <div className="space-y-5 p-6 sm:p-8">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="" className="h-14 w-14 rounded-xl border border-slate-200 bg-white object-contain p-1" />
        ) : null}
        <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <li className="flex flex-wrap items-baseline gap-1 text-sm">
            <span className="shrink-0 font-semibold text-midnight_text dark:text-white">Name:</span>
            <span className="text-midnight_text dark:text-gray-200">{partnerName(row)}</span>
          </li>
          <li className="flex flex-wrap items-baseline gap-1 text-sm">
            <span className="shrink-0 font-semibold text-midnight_text dark:text-white">Products:</span>
            <span className="text-midnight_text dark:text-gray-200">{partnerProductLabel(row)}</span>
          </li>
          {utm ? (
            <li className="flex flex-wrap items-baseline gap-1 text-sm sm:col-span-2">
              <span className="shrink-0 font-semibold text-midnight_text dark:text-white">UTM link:</span>
              <a href={utm} target="_blank" rel="noopener noreferrer" className="break-all text-[#4236FB] hover:underline">
                {utm}
              </a>
            </li>
          ) : null}
        </ul>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Required documents</p>
          {docs.length > 0 ? (
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
              {docs.map((doc) => (
                <span
                  key={doc}
                  className="inline-flex shrink-0 items-center rounded-full border border-[#C7C3FE] bg-[#EEF0FF] px-3 py-1 text-xs font-semibold whitespace-nowrap text-[#4236FB]"
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Policy</p>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 whitespace-pre-wrap text-slate-700 shadow-inner dark:border-dark_border dark:bg-white/5 dark:text-gray-200">
            {policy || "—"}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
