import { NextResponse } from "next/server";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { nestApiBase } from "@/app/lib/server/nestBase";

const MAX_BYTES = 2 * 1024 * 1024;

function exactError(status: number, rawText: string, data: Record<string, unknown>): string {
  const message = data.message;
  const error = data.error;
  const parts = [
    `HTTP ${status}`,
    Array.isArray(message) ? message.map((x) => String(x)).join(", ") : message != null ? String(message) : "",
    error != null && error !== message ? String(error) : "",
    !message && !error ? rawText : "",
  ]
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.join(" | ").slice(0, 800) || `HTTP ${status}`;
}

export async function POST(request: Request) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured: NEXT_PUBLIC_API_URL empty" }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 2 MB or smaller." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!buffer.length) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/partners/admin/image`, {
      method: "POST",
      headers: adminInternalHeaders(true, {
        sub: session.sub,
        email: session.email,
        role: session.role,
      }),
      body: JSON.stringify({
        filename: file.name || "logo.jpg",
        mimeType: file.type || "application/octet-stream",
        contentBase64: buffer.toString("base64"),
      }),
      cache: "no-store",
    });
    const rawText = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      data = {};
    }
    const path = typeof data.path === "string" ? data.path : "";
    if (!res.ok || !path) {
      return NextResponse.json(
        { error: exactError(res.status, rawText, data) },
        { status: res.ok ? 400 : res.status },
      );
    }
    return NextResponse.json({ success: true, path });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `fetch failed: ${detail}`.slice(0, 800) }, { status: 503 });
  }
}
