"use client";

import { useEffect, useMemo, useState } from "react";
import { ADMIN_BTN_PRIMARY, ADMIN_BTN_SECONDARY } from "@/app/admin/dashboard/adminUi";
import { affiliateQrSrc, affiliateShareUrl } from "@/app/lib/affiliate/refCookie";

const SHARE_TEXT = "Apply with Apni Zaroorat using my link:";

type ShareItem = {
  id: string;
  label: string;
  href: string;
  className: string;
  icon: React.ReactNode;
};

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.133-1.6-.79-1.848-.88-.248-.09-.429-.133-.61.134-.181.266-.7.88-.858 1.061-.157.182-.315.203-.583.067-.268-.133-1.13-.416-2.15-1.327-.795-.71-1.332-1.586-1.49-1.854-.156-.267-.017-.412.118-.545.121-.12.268-.314.402-.47.134-.157.179-.268.268-.446.09-.178.045-.334-.022-.468-.067-.133-.61-1.47-.835-2.013-.22-.53-.443-.458-.61-.467-.157-.009-.337-.01-.517-.01-.18 0-.47.067-.716.334-.248.267-.945.923-.945 2.25s.968 2.61 1.103 2.797c.134.178 1.904 2.908 4.613 4.077.645.278 1.148.444 1.54.569.646.206 1.233.177 1.697.107.518-.077 1.6-.653 1.826-1.284.225-.63.225-1.17.157-1.284-.067-.112-.247-.178-.514-.311z" />
      <path d="M12.004 2C6.486 2 2 6.487 2 12.006c0 1.77.463 3.45 1.27 4.905L2.1 21.9l5.11-1.34A9.96 9.96 0 0 0 12.004 22C17.523 22 22 17.514 22 11.995 22 6.476 17.523 2 12.004 2zm0 18.13a8.12 8.12 0 0 1-4.14-1.13l-.297-.176-3.034.796.81-2.958-.193-.304A8.1 8.1 0 0 1 3.87 12.006c0-4.48 3.646-8.126 8.134-8.126 4.48 0 8.126 3.646 8.126 8.126 0 4.48-3.646 8.124-8.126 8.124z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M21.95 4.23a1.2 1.2 0 0 0-1.24-.18L2.9 11.2c-.74.3-.73 1.36.02 1.63l4.4 1.55 1.7 5.3c.22.7 1.13.9 1.64.36l2.45-2.6 4.56 3.35c.55.4 1.33.1 1.5-.57l3.2-14.2a1.2 1.2 0 0 0-.42-1.19zM9.7 14.2l-.3 3.35-1.25-3.9 9.7-6.1-8.15 6.65z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.5l-5.1-6.7L5.7 22H2.6l7.3-8.3L1 2h6.6l4.6 6.1L18.9 2zm-1.1 18h1.8L7.3 4H5.4l12.4 16z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94zM20.44 20h-3.37v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.96V20h-3.37V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.04 2.25 4.04 5.17V20z" />
    </svg>
  );
}

function SmsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareNativeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

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
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  const shareMessage = useMemo(
    () => `${SHARE_TEXT} ${shareUrl}`.trim(),
    [shareUrl],
  );

  const socialLinks = useMemo<ShareItem[]>(() => {
    if (!shareUrl) return [];
    const u = encodeURIComponent(shareUrl);
    const t = encodeURIComponent(SHARE_TEXT);
    const full = encodeURIComponent(shareMessage);
    return [
      {
        id: "whatsapp",
        label: "WhatsApp",
        href: `https://wa.me/?text=${full}`,
        className: "bg-[#25D366] text-white hover:bg-[#1ebe57]",
        icon: <WhatsAppIcon />,
      },
      {
        id: "email",
        label: "Email",
        href: `mailto:?subject=${encodeURIComponent("Apni Zaroorat — apply with my link")}&body=${full}`,
        className: "bg-slate-700 text-white hover:bg-slate-800",
        icon: <EmailIcon />,
      },
      {
        id: "sms",
        label: "SMS",
        href: `sms:?&body=${full}`,
        className: "bg-emerald-600 text-white hover:bg-emerald-700",
        icon: <SmsIcon />,
      },
      {
        id: "telegram",
        label: "Telegram",
        href: `https://t.me/share/url?url=${u}&text=${t}`,
        className: "bg-[#229ED9] text-white hover:bg-[#1b8bc0]",
        icon: <TelegramIcon />,
      },
      {
        id: "facebook",
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        className: "bg-[#1877F2] text-white hover:bg-[#1464cf]",
        icon: <FacebookIcon />,
      },
      {
        id: "x",
        label: "X",
        href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
        className: "bg-slate-900 text-white hover:bg-black",
        icon: <XIcon />,
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        className: "bg-[#0A66C2] text-white hover:bg-[#08539c]",
        icon: <LinkedInIcon />,
      },
    ];
  }, [shareUrl, shareMessage]);

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

  async function nativeShare() {
    if (!shareUrl || typeof navigator.share !== "function") return;
    try {
      await navigator.share({
        title: "Apni Zaroorat",
        text: SHARE_TEXT,
        url: shareUrl,
      });
    } catch {
      /* user cancelled */
    }
  }

  if (!shareUrl) {
    return <p className="text-sm text-slate-500">Share link not ready yet.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="shrink-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="Your share QR code"
          width={qrSize}
          height={qrSize}
          className="block"
          style={{ width: qrSize, height: qrSize }}
        />
      </div>
      <div className="min-w-0 w-full flex-1 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your UTM link</p>
          <p className="mt-1 break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
            {shareUrl}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={ADMIN_BTN_PRIMARY} onClick={() => void copyLink()}>
            <CopyIcon />
            {copied ? "Copied" : "Copy link"}
          </button>
          <button
            type="button"
            className={ADMIN_BTN_SECONDARY}
            onClick={() => void downloadPng()}
            disabled={downloading}
          >
            <DownloadIcon />
            {downloading ? "Downloading…" : "Download QR"}
          </button>
        </div>

        <div className="w-full border-t border-slate-100 pt-3">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Share on
          </p>
          <div className="flex flex-wrap gap-2.5">
            {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.id === "email" || item.id === "sms" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={`Share on ${item.label}`}
                title={item.label}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition ${item.className}`}
              >
                {item.icon}
              </a>
            ))}
            {canNativeShare ? (
              <button
                type="button"
                onClick={() => void nativeShare()}
                aria-label="More share options"
                title="More"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#4236FB] text-white shadow-sm transition hover:bg-[#3528E8]"
              >
                <ShareNativeIcon />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
