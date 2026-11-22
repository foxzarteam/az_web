import { NextResponse } from "next/server";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { nestApiBase } from "@/app/lib/server/nestBase";
import { toPublicClientError } from "@/app/lib/publicClientError";

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
  if (!form) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/partners/admin/image`, {
      method: "POST",
      headers: adminInternalHeaders(false, {
        sub: session.sub,
        email: session.email,
        role: session.role,
      }),
      body: form,
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
