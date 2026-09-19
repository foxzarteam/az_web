import { NextResponse } from "next/server";
import { leadPatchRequiresAdmin } from "@/app/lib/admin/leadPatchGate";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireAdminSession } from "@/app/lib/admin/requireAdminRole";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const session = await requireAdminSession(
    leadPatchRequiresAdmin(body) ? { roles: ["admin"] } : { roles: ["admin", "staff"] },
  );
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  return proxyAdminToNest({
    session,
    nestPath: `/api/leads/admin/${encodeURIComponent(id)}`,
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
    nestPath: `/api/leads/admin/${encodeURIComponent(id)}`,
    method: "DELETE",
    fallbackError: "Delete failed",
  });
}
