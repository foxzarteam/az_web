import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  return proxyAdminToNest({
    session,
    nestPath: `/api/users/admin/${encodeURIComponent(id)}/kyc`,
    method: "GET",
    fallbackError: "Could not load KYC.",
  });
}
