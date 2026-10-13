import { buildStoredZip } from "@/app/lib/admin/xlsxSheet";

type CustomerFileMessage = {
  id: string;
  role: "user" | "assistant";
  hasMedia?: boolean;
  filename?: string;
  mime?: string;
  waType?: string;
};

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/3gpp": "3gp",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
};

function extensionOf(name: string): string {
  const match = /\.([a-z0-9]{1,8})$/i.exec(name.trim());
  return match ? match[1].toLowerCase() : "";
}

function mimeExtension(contentType: string): string {
  const mime = contentType.split(";")[0].trim().toLowerCase();
  if (MIME_EXT[mime]) return MIME_EXT[mime];
  if (mime === "image/jpeg") return "jpg";
  const sub = mime.split("/")[1] ?? "";
  if (sub === "jpeg") return "jpg";
  if (/^[a-z0-9]{1,8}$/.test(sub) && sub !== "octet-stream") return sub;
  return "";
}

function sniffExtension(bytes: Uint8Array): string {
  if (bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return "pdf";
  }
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "gif";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return "";
}

function cleanName(name: string): string {
  return name
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

function withExtension(name: string, ext: string): string {
  const base = cleanName(name) || "file";
  if (extensionOf(base) || !ext) return base;
  return `${base}.${ext}`;
}

function uniqueName(name: string, used: Set<string>): string {
  const key = name.toLowerCase();
  if (!used.has(key)) {
    used.add(key);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let n = 2;
  let next = `${stem}-${n}${ext}`;
  while (used.has(next.toLowerCase())) {
    n += 1;
    next = `${stem}-${n}${ext}`;
  }
  used.add(next.toLowerCase());
  return next;
}

function dispositionName(header: string | null): string {
  if (!header) return "";
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (encoded?.[1]) {
    try {
      return decodeURIComponent(encoded[1].trim());
    } catch {
      return encoded[1].trim();
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted?.[1]) return quoted[1].trim();
  const plain = /filename=([^;]+)/i.exec(header);
  return plain?.[1]?.trim() ?? "";
}

function fallbackStem(message: CustomerFileMessage): string {
  if (message.waType === "image") return "photo";
  if (message.waType === "video") return "video";
  if (message.waType === "audio") return "audio";
  return "file";
}

export function customerFileMessages(messages: CustomerFileMessage[]): CustomerFileMessage[] {
  return messages.filter((message) => message.role === "user" && message.hasMedia);
}

export function customerZipName(customerName: string): string {
  const clean = cleanName(customerName).replace(/\.+$/g, "").trim();
  return `${clean || "Customer"}.zip`;
}

function fileNameFor(message: CustomerFileMessage, headerName: string, contentType: string, bytes: Uint8Array): string {
  const ext = extensionOf(message.filename || "") || extensionOf(headerName) || sniffExtension(bytes) || mimeExtension(message.mime || contentType);
  const preferred = message.filename?.trim() || (headerName && headerName.toLowerCase() !== "file" ? headerName : "") || fallbackStem(message);
  return withExtension(preferred, ext);
}

export async function downloadCustomerDocuments(opts: {
  enquiryId: string;
  customerName: string;
  messages: CustomerFileMessage[];
}): Promise<{ ok: true; saved: number; missing: number } | { ok: false; error: string }> {
  const files = customerFileMessages(opts.messages);
  if (files.length === 0) {
    return { ok: false, error: "This customer has not sent any files." };
  }

  const used = new Set<string>();
  const packed: { name: string; data: Uint8Array }[] = [];
  let missing = 0;

  for (const message of files) {
    try {
      const res = await fetch(
        `/api/admin/whatsapp/enquiries/${encodeURIComponent(opts.enquiryId)}/media/${encodeURIComponent(message.id)}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        missing += 1;
        continue;
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      if (!bytes.length) {
        missing += 1;
        continue;
      }
      const name = uniqueName(
        fileNameFor(message, dispositionName(res.headers.get("content-disposition")), res.headers.get("content-type") || "", bytes),
        used,
      );
      packed.push({ name, data: bytes });
    } catch {
      missing += 1;
    }
  }

  if (packed.length === 0) {
    return { ok: false, error: "Could not download this customer's files." };
  }

  const zip = buildStoredZip(packed);
  const blob = new Blob([Uint8Array.from(zip)], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = customerZipName(opts.customerName);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { ok: true, saved: packed.length, missing };
}
