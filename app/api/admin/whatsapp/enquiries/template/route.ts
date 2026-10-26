import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { isAdminTemplateId } from "@/app/admin/dashboard/whatsapp/adminTemplates";

export async function POST(request: Request) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { phone?: unknown; name?: unknown; template?: unknown } | null;
  const phone = String(body?.phone ?? "").trim();
  const name = String(body?.name ?? "").trim();
  const template = String(body?.template ?? "").trim();
  if (!isAdminTemplateId(template)) {
    return NextResponse.json({ error: "Choose a template from the list." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Enter the customer name." }, { status: 400 });
  }

  return proxyAdminToNest({
    session,
    nestPath: "/api/whatsapp/admin/enquiries/template",
    method: "POST",
    body: { phone, name: name.slice(0, 120), template },
    fallbackError: "Could not send this template.",
  });
}
