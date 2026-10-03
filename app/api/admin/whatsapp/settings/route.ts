import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";

async function sessionOr401() {
  const session = await requireCrmAdminSession();
  if (!session) return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { session, response: null };
}

export async function GET() {
  const { session, response } = await sessionOr401();
  if (!session) return response;

  return proxyAdminToNest({
    session,
    nestPath: "/api/whatsapp/admin/settings",
    method: "GET",
    fallbackError: "Failed to load WhatsApp settings",
  });
}

export async function PUT(request: Request) {
  const { session, response } = await sessionOr401();
  if (!session) return response;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
  }

  return proxyAdminToNest({
    session,
    nestPath: "/api/whatsapp/admin/settings",
    method: "PUT",
    body,
    fallbackError: "Could not save WhatsApp settings",
  });
}
