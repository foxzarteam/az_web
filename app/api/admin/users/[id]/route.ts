import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireAdminSession, requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  return proxyAdminToNest({
    session,
    nestPath: `/api/users/admin/${encodeURIComponent(id)}`,
    method: "PATCH",
    body,
    fallbackError: "Update failed",
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession({ roles: ["admin"] });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  return proxyAdminToNest({
    session,
    nestPath: `/api/users/admin/${encodeURIComponent(id)}`,
    method: "DELETE",
    fallbackError: "Delete failed",
  });
}
