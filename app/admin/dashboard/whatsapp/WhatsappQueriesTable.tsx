"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { WhatsappChatMessage, WhatsappEnquiryDetail, WhatsappEnquiryRow } from "@/app/lib/admin/fetchWhatsapp";
import { toPublicClientError } from "@/app/lib/publicClientError";
import CrmDataTable, { CrmActionButton, type CrmColumn } from "@/app/components/shared/crm/DataTable";
import AdminModal from "@/app/components/shared/crm/AppModal";
import { ADMIN_BTN_DANGER, ADMIN_BTN_SECONDARY, ADMIN_ERROR } from "@/app/components/shared/crm/ui";

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return digits ? `+${digits}` : phone;
}

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function formatClock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function ProfileIcon({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase();
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-sm font-semibold text-white">
      {letter || (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
        </svg>
      )}
    </span>
  );
}

function ChatThread({ messages }: { messages: WhatsappChatMessage[] }) {
  if (messages.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-[#667781]">No messages in this chat yet.</p>;
  }

  return (
    <div className="space-y-2 px-3 py-4 sm:px-4" style={{ backgroundColor: "#efeae2" }}>
      {messages.map((message) => {
        const mine = message.role === "assistant";
        return (
          <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                mine ? "rounded-tr-none bg-[#d9fdd3] text-[#111b21]" : "rounded-tl-none bg-white text-[#111b21]"
              }`}
            >
              <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
              {message.sendError ? (
                <p className="mt-1 text-[11px] leading-snug text-[#b42318]">Not delivered: {message.sendError}</p>
              ) : null}
              {message.aiError ? (
                <p className="mt-1 text-[11px] leading-snug text-[#b42318]">AI: {message.aiError}</p>
              ) : null}
              <p className={`mt-1 text-[10px] ${mine ? "text-right text-[#667781]" : "text-[#667781]"}`}>
                {mine ? "Navya" : "Customer"} · {formatClock(message.at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const deleteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default function WhatsappQueriesTable({ initialRows }: { initialRows: WhatsappEnquiryRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<WhatsappEnquiryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteRow, setDeleteRow] = useState<WhatsappEnquiryRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  async function viewChat(row: WhatsappEnquiryRow) {
    setOpenId(row.id);
    setDetail(null);
    setError(null);
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

  async function confirmDelete() {
    if (!deleteRow) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/whatsapp/enquiries/${encodeURIComponent(deleteRow.id)}`, {
        method: "DELETE",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setDeleteError(toPublicClientError(data.error, "Could not delete this chat."));
        return;
      }
      const removedId = deleteRow.id;
      setRows((prev) => prev.filter((row) => row.id !== removedId));
      if (openId === removedId) {
        setOpenId(null);
        setDetail(null);
      }
      setDeleteRow(null);
      router.refresh();
    } catch {
      setDeleteError("Network error. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  const columns: CrmColumn<WhatsappEnquiryRow>[] = [
    {
      id: "profile",
      header: "Profile",
      sortable: true,
      sortValue: (row) => row.profileName || row.phone,
      searchValue: (row) => `${row.profileName} ${row.phone}`,
      cell: (row) => (
        <span className="inline-flex items-center gap-3">
          <ProfileIcon name={row.profileName} />
          <span className="font-medium text-slate-800">{row.profileName || "WhatsApp user"}</span>
        </span>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      sortable: true,
      sortValue: (row) => row.phone,
      cell: (row) => <span className="tabular-nums text-slate-700">{formatPhone(row.phone)}</span>,
    },
    {
      id: "lastChat",
      header: "Last Chat",
      sortable: true,
      sortValue: (row) => row.lastChatAt ?? "",
      searchValue: (row) => row.lastMessage,
      cell: (row) => <span className="text-sm text-slate-800">{formatWhen(row.lastChatAt)}</span>,
    },
    {
      id: "actions",
      header: "View Chat",
      searchable: false,
      cell: (row) => (
        <span className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => void viewChat(row)}
            className="inline-flex h-9 items-center rounded-lg bg-[#128C7E] px-3 text-xs font-semibold text-white transition hover:bg-[#075e54]"
          >
            View Chat
          </button>
          <CrmActionButton
            label="Delete chat"
            variant="danger"
            onClick={() => {
              setDeleteRow(row);
              setDeleteError(null);
            }}
          >
            {deleteIcon}
          </CrmActionButton>
        </span>
      ),
    },
  ];

  const titlePhone = detail ? formatPhone(detail.phone) : "Chat";

  return (
    <>
      <CrmDataTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        searchPlaceholder="Search phone or message…"
        emptyMessage="No WhatsApp chats yet."
        comfortable
      />

      {openId ? (
        <AdminModal
          title={detail?.profileName ? `${detail.profileName} · ${titlePhone}` : titlePhone}
          wide
          onClose={() => {
            setOpenId(null);
            setDetail(null);
            setError(null);
          }}
        >
          {loading ? <p className="px-6 py-10 text-sm text-slate-500">Loading chat…</p> : null}
          {error ? <p className="px-6 py-10 text-sm text-red-600">{error}</p> : null}
          {detail ? <ChatThread messages={detail.messages} /> : null}
        </AdminModal>
      ) : null}

      {deleteRow ? (
        <AdminModal title="Delete chat" onClose={() => !deleting && setDeleteRow(null)}>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-slate-700">
              Delete the chat for{" "}
              <strong>{deleteRow.profileName || "this number"}</strong> ({formatPhone(deleteRow.phone)})?
              This removes it from the database and cannot be undone.
            </p>
            {deleteError ? <p className={`mt-3 ${ADMIN_ERROR}`}>{deleteError}</p> : null}
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteRow(null)} disabled={deleting} className={ADMIN_BTN_SECONDARY}>
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                className={ADMIN_BTN_DANGER}
                onClick={() => void confirmDelete()}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </AdminModal>
      ) : null}
    </>
  );
}
