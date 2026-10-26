"use client";

import { useEffect, useRef } from "react";
import type { WhatsappChatMessage } from "@/app/lib/admin/fetchWhatsapp";

function formatClock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return `${day}, ${time}`;
}

function DeliveryNote({ message }: { message: WhatsappChatMessage }) {
  if (message.sendError || message.delivery === "failed") {
    return (
      <p className="mt-1 text-[11px] leading-snug text-[#b42318]">
        Not delivered: {message.sendError || "WhatsApp could not deliver this message."}
      </p>
    );
  }
  if (message.delivery === "read") {
    return <p className="mt-1 text-right text-[11px] font-medium text-[#53bdeb]">Seen</p>;
  }
  if (message.delivery === "delivered") {
    return <p className="mt-1 text-right text-[11px] font-medium text-[#027a69]">Delivered</p>;
  }
  if (message.delivery === "sent") {
    return <p className="mt-1 text-right text-[11px] text-[#667781]">Sent</p>;
  }
  return null;
}

function senderLabel(message: WhatsappChatMessage): string {
  if (message.role !== "assistant") return "Customer";
  if (message.replyBy === "admin") return "You";
  if (message.replyBy === "template") return "Template";
  return "Team";
}

function mediaSrc(enquiryId: string, messageId: string): string {
  return `/api/admin/whatsapp/enquiries/${encodeURIComponent(enquiryId)}/media/${encodeURIComponent(messageId)}`;
}

const MISSING_FILE_NOTICE = "This file did not come through. Ask the customer to send it again as a photo or PDF.";

function isFalseMissingNotice(message: WhatsappChatMessage, messages: WhatsappChatMessage[]): boolean {
  const text = message.text.trim();
  const notice =
    message.role === "user" &&
    !message.hasMedia &&
    (text === MISSING_FILE_NOTICE || /^\[(unsupported|unknown|empty) message\]$/i.test(text));
  if (!notice) return false;
  const at = Date.parse(message.at);
  return messages.some((other) => {
    if (other.id === message.id || other.role !== "user" || !other.hasMedia) return false;
    const otherAt = Date.parse(other.at);
    return Number.isFinite(at) && Number.isFinite(otherAt) && Math.abs(otherAt - at) <= 2 * 60 * 1000;
  });
}

function visibleText(message: WhatsappChatMessage): string {
  const text = message.text.trim();
  if (!text) return "";
  if (/^\[(unsupported|unknown|empty) message\]$/i.test(text)) {
    return message.hasMedia ? "" : "This file did not come through. Ask the customer to send it again as a photo or PDF.";
  }
  if (message.filename && text === message.filename) return "";
  if (message.hasMedia && /^(photo|image|video|audio|document|file)$/i.test(text)) return "";
  return text;
}

function isImage(message: WhatsappChatMessage): boolean {
  return message.waType === "image" || String(message.mime ?? "").toLowerCase().startsWith("image/");
}

function isVideo(message: WhatsappChatMessage): boolean {
  return message.waType === "video" || String(message.mime ?? "").toLowerCase().startsWith("video/");
}

function isAudio(message: WhatsappChatMessage): boolean {
  return message.waType === "audio" || String(message.mime ?? "").toLowerCase().startsWith("audio/");
}

function fileLabel(message: WhatsappChatMessage): string {
  if (message.filename) return message.filename;
  if (message.waType === "image") return "Photo";
  if (message.waType === "video") return "Video";
  if (message.waType === "audio") return "Audio";
  return "File";
}

function BubbleMedia({ enquiryId, message }: { enquiryId: string; message: WhatsappChatMessage }) {
  const src = message.hasMedia ? mediaSrc(enquiryId, message.id) : "";
  if (src && isImage(message)) {
    return (
      <a href={src} target="_blank" rel="noreferrer" className="mb-1 block">
        <img src={src} alt={message.filename || "Photo"} className="max-h-72 max-w-full rounded-md object-contain" />
      </a>
    );
  }
  if (src && isVideo(message)) {
    return <video src={src} controls className="mb-1 max-h-72 max-w-full rounded-md" />;
  }
  if (src && isAudio(message)) {
    return <audio src={src} controls className="mb-1 w-full max-w-xs" />;
  }
  if (src || message.waType === "document" || message.filename) {
    return src ? (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="mb-1 flex items-center gap-2 rounded-md bg-black/5 px-2 py-2 text-[#128C7E]"
      >
        <span aria-hidden>📄</span>
        <span className="min-w-0 truncate underline">{fileLabel(message)}</span>
      </a>
    ) : (
      <p className="mb-1 flex items-center gap-2 text-[#111b21]">
        <span aria-hidden>📄</span>
        <span className="min-w-0 truncate">{fileLabel(message)}</span>
      </p>
    );
  }
  return null;
}

function scrollBox(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const overflow = getComputedStyle(el).overflowY;
    if (overflow === "auto" || overflow === "scroll") return el;
    el = el.parentElement;
  }
  return null;
}

export default function WhatsappThread({ enquiryId, messages }: { enquiryId: string; messages: WhatsappChatMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const seenEnquiry = useRef(enquiryId);
  const seenCount = useRef(0);

  useEffect(() => {
    const box = scrollBox(endRef.current);
    if (!box) return;
    const onScroll = () => {
      stickToBottom.current = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    };
    box.addEventListener("scroll", onScroll, { passive: true });
    return () => box.removeEventListener("scroll", onScroll);
  }, [enquiryId, messages.length]);

  useEffect(() => {
    const opened = seenEnquiry.current !== enquiryId;
    const grew = messages.length > seenCount.current;
    seenEnquiry.current = enquiryId;
    seenCount.current = messages.length;
    if (!opened && (!grew || !stickToBottom.current)) return;
    const box = scrollBox(endRef.current);
    if (box) box.scrollTop = box.scrollHeight;
  }, [enquiryId, messages]);

  if (messages.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-[#667781]">No messages in this chat yet.</p>;
  }

  return (
    <div className="space-y-2 px-3 py-4 sm:px-5">
      {messages.filter((message) => !isFalseMissingNotice(message, messages)).map((message) => {
        const mine = message.role === "assistant";
        const text = visibleText(message);
        return (
          <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                mine ? "rounded-tr-none bg-[#d9fdd3] text-[#111b21]" : "rounded-tl-none bg-white text-[#111b21]"
              }`}
            >
              <BubbleMedia enquiryId={enquiryId} message={message} />
              {text ? <p className="whitespace-pre-wrap break-words leading-relaxed">{text}</p> : null}
              {message.buttons && message.buttons.length > 0 ? (
                <div className="mt-2 space-y-1.5">
                  {message.buttons.map((label) => (
                    <div
                      key={label}
                      className="rounded-md border border-[#25D366]/40 bg-white px-3 py-1.5 text-center text-sm font-medium text-[#027a69]"
                    >
                      {label}
                    </div>
                  ))}
                </div>
              ) : null}
              {mine ? <DeliveryNote message={message} /> : null}
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
