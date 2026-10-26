"use client";

import { useEffect, useRef, useState } from "react";
import type { WhatsappEnquiryDetail } from "@/app/lib/admin/fetchWhatsapp";
import { toPublicClientError } from "@/app/lib/publicClientError";
import { ADMIN_TEMPLATES } from "./adminTemplates";

type Props = {
  open: boolean;
  onClose: () => void;
  onStarted: (detail: WhatsappEnquiryDetail) => void;
};

export default function StartWhatsappChat({ open, onClose, onStarted }: Props) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setPhone("");
    setName("");
    setText("");
    setError(null);
    setTemplateOpen(false);
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

  useEffect(() => {
    if (!templateOpen) return;
    function onPointer(event: MouseEvent) {
      if (!templateRef.current?.contains(event.target as Node)) setTemplateOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [templateOpen]);

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

  async function sendTemplate(templateId: string) {
    if (sending) return;
    if (!phone.trim()) {
      setError("Enter the mobile number.");
      return;
    }
    if (!name.trim()) {
      setError("Enter the customer name.");
      return;
    }
    setTemplateOpen(false);
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/whatsapp/enquiries/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name: name.trim(), template: templateId }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; data?: WhatsappEnquiryDetail };
      if (!res.ok || !data.data) {
        setError(toPublicClientError(data.error, "Could not send this template."));
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
        <p className="mt-1 text-xs text-[#667781]">Type a name and use + to send a template. The name goes into the message. Or type a first message and press Send.</p>
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
        <label className="mt-3 block text-xs font-medium text-[#54656f]" htmlFor="start-wa-name">
          Name
        </label>
        <input
          id="start-wa-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={120}
          placeholder="Name for the template"
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
        <div className="mt-4 flex items-center justify-between gap-2">
          <div ref={templateRef} className="relative">
            {templateOpen ? (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-72 overflow-hidden rounded-xl border border-[#e9edef] bg-white py-1 shadow-lg">
                {ADMIN_TEMPLATES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={sending}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#111b21] hover:bg-[#f0f2f5] disabled:opacity-50"
                    onClick={() => void sendTemplate(item.id)}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.dot }} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] via-[#7c3aed] to-[#53bdeb] text-white shadow-md hover:brightness-105"
              aria-label="Send a template"
              aria-expanded={templateOpen}
              onClick={() => setTemplateOpen((open) => !open)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2">
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
    </div>
  );
}
