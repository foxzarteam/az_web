"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { WhatsappChatMessage, WhatsappEnquiryDetail, WhatsappEnquiryRow } from "@/app/lib/admin/fetchWhatsapp";
import { toPublicClientError } from "@/app/lib/publicClientError";

const EMOJIS = ["🙏", "😊", "👍", "🎉", "✅", "❤️"];

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return digits ? `+${digits}` : phone;
}

function formatClock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function formatListTime(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return sameDay
    ? date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function ProfileIcon({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase();
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-sm font-semibold text-white">
      {letter || "W"}
    </span>
  );
}

function senderLabel(message: WhatsappChatMessage): string {
  if (message.role !== "assistant") return "Customer";
  if (message.replyBy === "admin") return "You";
  if (message.kind === "welcome" || message.kind === "personal_loan" || message.kind === "insurance" || message.replyBy === "template") {
    return "Template";
  }
  return "Team";
}

function ChatThread({ messages }: { messages: WhatsappChatMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-[#667781]">No messages in this chat yet.</p>;
  }

  return (
    <div className="space-y-2 px-3 py-4 sm:px-5">
      {messages.map((message) => {
        const mine = message.role === "assistant";
        return (
          <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                mine ? "rounded-tr-none bg-[#d9fdd3] text-[#111b21]" : "rounded-tl-none bg-white text-[#111b21]"
              }`}
            >
              {message.filename ? (
                <p className="mb-1 text-[11px] font-medium text-[#128C7E]">
                  {message.waType === "image" ? "Photo" : "File"} · {message.filename}
                </p>
              ) : null}
              <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
              {message.sendError ? (
                <p className="mt-1 text-[11px] leading-snug text-[#b42318]">Not delivered: {message.sendError}</p>
              ) : null}
              <p className={`mt-1 text-[10px] ${mine ? "text-right text-[#667781]" : "text-[#667781]"}`}>
                {senderLabel(message)} · {formatClock(message.at)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

export default function WhatsappInbox({ initialRows }: { initialRows: WhatsappEnquiryRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<WhatsappEnquiryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => `${row.profileName} ${row.phone} ${row.lastMessage}`.toLowerCase().includes(q));
  }, [rows, search]);

  async function openChat(row: WhatsappEnquiryRow) {
    if (openId === row.id && detail) return;
    setOpenId(row.id);
    setDetail(null);
    setError(null);
    setDraft("");
    setFile(null);
    setSendError(null);
    setConfirmDelete(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/whatsapp/enquiries/${encodeURIComponent(row.id)}`);
      const data = (await res.json().catch(() => ({}))) as { error?: string; data?: WhatsappEnquiryDetail };
      if (!res.ok || !data.data) {
        setError(toPublicClientError(data.error, "Could not load this chat."));
        return;
      }
      setDetail(data.data);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function sendManual() {
    if (!openId || sending) return;
    const text = draft.trim();
    if (!text && !file) return;
    setSending(true);
    setSendError(null);
    try {
      const body = new FormData();
      body.append("text", text);
      if (file) body.append("file", file);
      const res = await fetch(`/api/admin/whatsapp/enquiries/${encodeURIComponent(openId)}/reply`, {
        method: "POST",
        body,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; data?: WhatsappEnquiryDetail };
      if (!res.ok || !data.data) {
        setSendError(toPublicClientError(data.error, "Could not send this message."));
        return;
      }
      setDetail(data.data);
      setDraft("");
      setFile(null);
      setRows((prev) =>
        prev
          .map((row) =>
            row.id === openId
              ? { ...row, lastMessage: data.data?.messages.at(-1)?.text ?? row.lastMessage, lastChatAt: new Date().toISOString() }
              : row,
          )
          .sort((a, b) => (b.lastChatAt ?? "").localeCompare(a.lastChatAt ?? "")),
      );
      router.refresh();
    } catch {
      setSendError("Network error. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function deleteChat() {
    if (!openId || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/whatsapp/enquiries/${encodeURIComponent(openId)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(toPublicClientError(data.error, "Could not delete this chat."));
        return;
      }
      setRows((prev) => prev.filter((row) => row.id !== openId));
      setOpenId(null);
      setDetail(null);
      setConfirmDelete(false);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  const selected = rows.find((row) => row.id === openId) ?? null;

  return (
    <div className="flex h-[calc(100dvh-4.5rem)] min-h-0 overflow-hidden bg-white">
      <aside
        className={`flex w-full shrink-0 flex-col border-r border-[#e9edef] bg-white md:w-[22rem] ${
          openId ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-[#e9edef] bg-[#f0f2f5] p-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or number"
            className="w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-[#111b21] outline-none ring-1 ring-[#e9edef] focus:ring-[#128C7E]"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#667781]">No chats yet.</p>
          ) : (
            filtered.map((row) => {
              const active = row.id === openId;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => void openChat(row)}
                  className={`flex w-full items-center gap-3 border-b border-[#f0f2f5] px-3 py-3 text-left hover:bg-[#f5f6f6] ${
                    active ? "bg-[#f0f2f5]" : "bg-white"
                  }`}
                >
                  <ProfileIcon name={row.profileName} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-[#111b21]">{row.profileName || "WhatsApp user"}</span>
                      <span className="shrink-0 text-[11px] text-[#667781]">{formatListTime(row.lastChatAt)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[#667781]">{row.lastMessage || formatPhone(row.phone)}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className={`min-w-0 flex-1 flex-col ${openId ? "flex" : "hidden md:flex"}`}>
        {!openId ? (
          <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] text-sm text-[#667781]">
            Select a chat to reply
          </div>
        ) : (
          <>
            <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e9edef] bg-[#f0f2f5] px-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#54656f] md:hidden"
                onClick={() => {
                  setOpenId(null);
                  setDetail(null);
                  setConfirmDelete(false);
                }}
                aria-label="Back to chats"
              >
                ←
              </button>
              <ProfileIcon name={detail?.profileName || selected?.profileName || ""} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#111b21]">
                  {detail?.profileName || selected?.profileName || "WhatsApp user"}
                </p>
                <p className="truncate text-xs text-[#667781]">{formatPhone(detail?.phone || selected?.phone || "")}</p>
              </div>
              {confirmDelete ? (
                <span className="flex items-center gap-2 text-xs">
                  <button type="button" className="text-[#667781]" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                    Cancel
                  </button>
                  <button type="button" className="font-semibold text-[#b42318]" onClick={() => void deleteChat()} disabled={deleting}>
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-xs font-medium text-[#667781] hover:text-[#b42318]"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </button>
              )}
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto" style={{ backgroundColor: "#efeae2" }}>
              {loading ? <p className="px-4 py-10 text-center text-sm text-[#667781]">Loading chat…</p> : null}
              {error ? <p className="px-4 py-10 text-center text-sm text-[#b42318]">{error}</p> : null}
              {detail && !loading ? <ChatThread messages={detail.messages} /> : null}
            </div>

            <div className="shrink-0 border-t border-[#e9edef] bg-[#f0f2f5] p-2 sm:p-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="rounded-md px-1.5 py-0.5 text-base hover:bg-white"
                    onClick={() => setDraft((prev) => `${prev}${emoji}`)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {file ? (
                <p className="mb-2 px-1 text-xs text-[#667781]">
                  {file.name}
                  <button type="button" className="ml-2 text-[#b42318]" onClick={() => setFile(null)}>
                    Remove
                  </button>
                </p>
              ) : null}
              {sendError ? <p className="mb-2 px-1 text-xs text-[#b42318]">{sendError}</p> : null}
              <div className="flex items-end gap-2">
                <label className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#54656f] shadow-sm hover:bg-[#e9edef]">
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/webp,application/pdf,audio/mpeg,audio/ogg,video/mp4,.doc,.docx"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  />
                  +
                </label>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={1}
                  placeholder="Type a message"
                  className="max-h-28 min-h-[40px] flex-1 resize-none rounded-2xl border-0 bg-white px-3 py-2 text-sm text-[#111b21] outline-none"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendManual();
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={sending || (!draft.trim() && !file)}
                  onClick={() => void sendManual()}
                  className="inline-flex h-10 items-center rounded-full bg-[#128C7E] px-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {sending ? "…" : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
