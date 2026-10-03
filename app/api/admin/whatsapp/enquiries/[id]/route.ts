import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Chat not found." }, { status: 404 });
  }

  return proxyAdminToNest({
    session,
    nestPath: `/api/whatsapp/admin/enquiries/${encodeURIComponent(id)}`,
    method: "GET",
    fallbackError: "Could not load this chat",
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Chat not found." }, { status: 404 });
  }

  return proxyAdminToNest({
    session,
    nestPath: `/api/whatsapp/admin/enquiries/${encodeURIComponent(id)}`,
    method: "DELETE",
    fallbackError: "Could not delete this chat",
  });
}
