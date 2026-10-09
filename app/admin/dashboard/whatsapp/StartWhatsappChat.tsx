"use client";

import { useEffect, useRef, useState } from "react";
import type { WhatsappEnquiryDetail } from "@/app/lib/admin/fetchWhatsapp";
import { toPublicClientError } from "@/app/lib/publicClientError";

type Props = {
  open: boolean;
  onClose: () => void;
  onStarted: (detail: WhatsappEnquiryDetail) => void;
};

export default function StartWhatsappChat({ open, onClose, onStarted }: Props) {
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setPhone("");
    setText("");
    setError(null);
    const t = window.setTimeout(() => phoneRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !sending) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, sending, onClose]);

  if (!open) return null;

  async function send() {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/whatsapp/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, text }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; data?: WhatsappEnquiryDetail };
      if (!res.ok || !data.data) {
        setError(toPublicClientError(data.error, "Could not send this message."));
        return;
      }
      onStarted(data.data);
      onClose();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={() => !sending && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-wa-title"
        className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="start-wa-title" className="text-base font-semibold text-[#111b21]">
          New WhatsApp message
        </h2>
        <p className="mt-1 text-xs text-[#667781]">Enter the mobile number and first message. Chat will appear in the list after it sends.</p>
        <label className="mt-4 block text-xs font-medium text-[#54656f]" htmlFor="start-wa-phone">
          Mobile number
        </label>
        <input
          id="start-wa-phone"
          ref={phoneRef}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          className="mt-1 w-full rounded-lg border border-[#e9edef] px-3 py-2 text-sm text-[#111b21] outline-none focus:border-[#128C7E]"
        />
        <label className="mt-3 block text-xs font-medium text-[#54656f]" htmlFor="start-wa-text">
          First message
        </label>
        <textarea
          id="start-wa-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          maxLength={4000}
          placeholder="Type the first message"
          className="mt-1 w-full resize-none rounded-lg border border-[#e9edef] px-3 py-2 text-sm text-[#111b21] outline-none focus:border-[#128C7E]"
        />
        {error ? <p className="mt-2 text-xs text-[#b42318]">{error}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="rounded-lg px-3 py-2 text-sm text-[#54656f]" disabled={sending} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            disabled={sending || !phone.trim() || !text.trim()}
            onClick={() => void send()}
            className="rounded-lg bg-[#128C7E] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
