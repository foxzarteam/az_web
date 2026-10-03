"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { hidePublicChrome } from "@/app/lib/layout/hidePublicChrome";

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <path
        fill="currentColor"
        d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.5.7.7-3.4-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9 14 14 0 0 0 1.5.5 3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z"
      />
    </svg>
  );
}

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [url, setUrl] = useState<string | null>(null);
  const hidden = hidePublicChrome(pathname);

  useEffect(() => {
    if (hidden) return;
    let cancelled = false;
    fetch("/api/whatsapp/link")
      .then((res) => res.json())
      .then((data: { url?: unknown }) => {
        if (cancelled) return;
        setUrl(typeof data.url === "string" ? data.url : null);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [hidden]);

  if (hidden || !url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp, 1 new message"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-[1000] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition hover:scale-105 hover:bg-[#1ebe5d] sm:bottom-6 sm:right-6"
    >
      <span
        className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#EF4444] text-[11px] font-bold leading-none text-white shadow-sm"
        aria-hidden
      >
        1
      </span>
      <WhatsAppGlyph />
    </a>
  );
}
