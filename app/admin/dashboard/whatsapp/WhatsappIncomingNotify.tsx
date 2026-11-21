"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { WhatsappEnquiryRow } from "@/app/lib/admin/fetchWhatsapp";
import { getOpenWhatsappChat, requestOpenWhatsappChat } from "./whatsappNotifyBus";

type Snapshot = {
  lastChatAt: string;
  unread: number;
  lastMessage: string;
};

type Toast = {
  key: string;
  id: string;
  phone: string;
  name: string;
  preview: string;
};

const POLL_MS = 4_000;
const TOAST_MS = 8_000;

function tenDigitMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length >= 10) return digits.slice(-10);
  return "";
}

function previewText(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return "New WhatsApp message";
  return text.length > 120 ? `${text.slice(0, 117)}…` : text;
}

function askDesktopPermission() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "default") return;
  void Notification.requestPermission();
}

export default function WhatsappIncomingNotify() {
  const router = useRouter();
  const pathname = usePathname();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seen = useRef<Map<string, Snapshot> | null>(null);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  function openChat(toast: Pick<Toast, "id" | "phone" | "name">) {
    const ten = tenDigitMobile(toast.phone);
    requestOpenWhatsappChat({ id: toast.id, phone: ten || toast.phone, name: toast.name });
    const qs = new URLSearchParams();
    if (ten) qs.set("phone", ten);
    if (toast.name) qs.set("name", toast.name);
    router.push(qs.size ? `/admin/dashboard/whatsapp?${qs.toString()}` : "/admin/dashboard/whatsapp");
  }

  function pushToast(row: WhatsappEnquiryRow) {
    const viewingThisChat =
      document.visibilityState === "visible" &&
      getOpenWhatsappChat() === row.id &&
      pathnameRef.current.replace(/\/+$/, "").endsWith("/whatsapp");
    if (viewingThisChat) return;

    const toast: Toast = {
      key: `${row.id}-${row.lastChatAt ?? Date.now()}`,
      id: row.id,
      phone: row.phone,
      name: row.profileName || "WhatsApp user",
      preview: previewText(row.lastMessage),
    };
    setToasts((prev) => [toast, ...prev.filter((item) => item.id !== row.id)].slice(0, 4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.key !== toast.key));
    }, TOAST_MS);

    if (document.visibilityState === "visible") return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    try {
      const note = new Notification(`${toast.name} • WhatsApp`, {
        body: toast.preview,
        tag: `az-wa-${row.id}`,
        icon: "/favicon.webp",
      });
      note.onclick = () => {
        window.focus();
        openChat(toast);
        note.close();
      };
    } catch {
      /* ignore blocked notifications */
    }
  }

  useEffect(() => {
    askDesktopPermission();
    function onGesture() {
      askDesktopPermission();
    }
    document.addEventListener("click", onGesture, { once: true });
    document.addEventListener("keydown", onGesture, { once: true });
    return () => {
      document.removeEventListener("click", onGesture);
      document.removeEventListener("keydown", onGesture);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/admin/whatsapp/enquiries?page=1");
        const body = (await res.json().catch(() => ({}))) as {
          data?: { rows?: WhatsappEnquiryRow[] };
        };
        const rows = body.data?.rows;
        if (cancelled || !res.ok || !Array.isArray(rows)) return;

        const prev = seen.current;
        const next = new Map<string, Snapshot>();
        for (const row of rows) {
          const unread = Number(row.unreadCount) || 0;
          const snap: Snapshot = {
            lastChatAt: row.lastChatAt ?? "",
            unread,
            lastMessage: row.lastMessage ?? "",
          };
          next.set(row.id, snap);
          if (!prev) continue;
          const before = prev.get(row.id);
          const isNewInbound =
            unread > 0 &&
            (!before || unread > before.unread || (snap.lastChatAt && snap.lastChatAt !== before.lastChatAt));
          if (isNewInbound) pushToast(row);
        }
        seen.current = next;
      } catch {
        /* keep watching */
      }
    }

    void poll();
    const timer = window.setInterval(() => void poll(), POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col-reverse gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.key}
          className="pointer-events-auto w-full rounded-xl border border-[#d1e7dd] bg-white p-3 shadow-lg shadow-slate-900/15 ring-1 ring-black/5"
        >
          <div className="flex items-start gap-2">
            <button
              type="button"
              className="flex min-w-0 flex-1 items-start gap-2 text-left"
              onClick={() => {
                setToasts((prev) => prev.filter((item) => item.key !== toast.key));
                openChat(toast);
              }}
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.5.7.7-3.4-.2-.3A9.1 9.1 0 1 1 12 20.5Z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#111b21]">{toast.name}</span>
                <span className="mt-0.5 block text-xs leading-5 text-[#54656f]">{toast.preview}</span>
              </span>
            </button>
            <button
              type="button"
              aria-label="Dismiss"
              className="shrink-0 px-1 text-sm text-[#8696a0] hover:text-[#111b21]"
              onClick={() => setToasts((prev) => prev.filter((item) => item.key !== toast.key))}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
