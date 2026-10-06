import { NextResponse } from "next/server";
import { nestApiBase } from "@/app/lib/server/nestBase";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { toPublicClientError } from "@/app/lib/publicClientError";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Chat not found." }, { status: 404 });
  }

  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  const incoming = await request.formData();
  const outbound = new FormData();
  const text = String(incoming.get("text") ?? "");
  outbound.append("text", text.slice(0, 4000));
  const file = incoming.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.size > 16 * 1024 * 1024) {
      return NextResponse.json({ error: "File is too large (max 16 MB)." }, { status: 400 });
    }
    outbound.append("file", file, file.name);
  }

  try {
    const res = await fetch(`${base}/api/whatsapp/admin/enquiries/${encodeURIComponent(id)}/reply`, {
      method: "POST",
      headers: adminInternalHeaders(false, {
        sub: session.sub,
        email: session.email,
        role: session.role,
      }),
      body: outbound,
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: unknown;
      message?: string;
      error?: string;
    };
    if (!res.ok || data.success === false) {
      return NextResponse.json(
        { error: toPublicClientError(data.message ?? data.error, "Could not send this message.") },
        { status: res.ok ? 400 : res.status },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
