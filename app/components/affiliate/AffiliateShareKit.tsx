"use client";

import { useState } from "react";
import { ADMIN_BTN_PRIMARY, ADMIN_BTN_SECONDARY } from "@/app/admin/dashboard/adminUi";
import { affiliateQrSrc, affiliateShareUrl } from "@/app/lib/affiliate/refCookie";

export default function AffiliateShareKit({
  code,
  compact = false,
}: {
  code: string;
  compact?: boolean;
}) {
  const shareUrl = affiliateShareUrl(code);
  const qrSize = compact ? 120 : 180;
  const qrSrc = affiliateQrSrc(shareUrl, qrSize);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function downloadPng() {
    if (!qrSrc) return;
    setDownloading(true);
    try {
      const res = await fetch(qrSrc);
      const blob = await res.blob();
      const png = blob.type.includes("png") ? blob : new Blob([blob], { type: "image/png" });
      const href = URL.createObjectURL(png);
      const a = document.createElement("a");
      a.href = href;
      a.download = `az-affiliate-${code.trim().toUpperCase() || "qr"}.png`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      window.open(qrSrc, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }

  if (!shareUrl) {
    return <p className="text-sm text-slate-500">Affiliate link not assigned yet.</p>;
  }

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="shrink-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc} alt="Affiliate QR" width={qrSize} height={qrSize} className="block" style={{ width: qrSize, height: qrSize }} />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share link</p>
          <p className="mt-1 break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">{shareUrl}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={ADMIN_BTN_PRIMARY} onClick={() => void copyLink()}>
            {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" className={ADMIN_BTN_SECONDARY} onClick={() => void downloadPng()} disabled={downloading}>
            {downloading ? "Downloading…" : "Download QR (PNG)"}
          </button>
        </div>
      </div>
    </div>
  );
}
