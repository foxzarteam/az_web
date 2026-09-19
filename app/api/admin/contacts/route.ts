import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";

export async function GET() {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return proxyAdminToNest({
    session,
    nestPath: "/api/contact/admin/all",
    method: "GET",
    fallbackError: "Failed to load contacts",
  });
}
