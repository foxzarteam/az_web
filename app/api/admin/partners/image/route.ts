import { NextResponse } from "next/server";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { nestApiBase } from "@/app/lib/server/nestBase";
import { toPublicClientError } from "@/app/lib/publicClientError";

const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
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
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      path?: string;
      error?: string;
      message?: string;
    };
    if (!res.ok || !data.path) {
      return NextResponse.json(
        { error: toPublicClientError(data.error ?? data.message, "Could not upload this image.") },
        { status: res.ok ? 400 : res.status },
      );
    }
    return NextResponse.json({ success: true, path: data.path });
  } catch {
    return NextResponse.json({ error: "Could not upload this image." }, { status: 503 });
  }
}
