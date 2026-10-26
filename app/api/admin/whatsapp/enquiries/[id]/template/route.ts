import { NextResponse } from "next/server";
import { nestApiBase } from "@/app/lib/server/nestBase";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { toPublicClientError } from "@/app/lib/publicClientError";
import { isAdminTemplateId } from "@/app/admin/dashboard/whatsapp/adminTemplates";

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

  const body = (await request.json().catch(() => null)) as { template?: unknown; name?: unknown } | null;
  const template = String(body?.template ?? "").trim();
  const name = String(body?.name ?? "").trim();
  if (!isAdminTemplateId(template)) {
    return NextResponse.json({ error: "Choose a template from the list." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Enter the customer name." }, { status: 400 });
  }

  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${base}/api/whatsapp/admin/enquiries/${encodeURIComponent(id)}/template`, {
      method: "POST",
      headers: adminInternalHeaders(true, {
        sub: session.sub,
        email: session.email,
        role: session.role,
      }),
      body: JSON.stringify({ template, name: name.slice(0, 120) }),
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
        { error: toPublicClientError(data.message ?? data.error, "Could not send this template.") },
        { status: res.ok ? 400 : res.status },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
