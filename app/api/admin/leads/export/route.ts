import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { allowRateLimitedAction } from "@/app/lib/security/rateLimit";

export async function GET() {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!allowRateLimitedAction(`lead-export:${session.sub}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many exports. Try again in a minute." },
      { status: 429 },
    );
  }

  return proxyAdminToNest({
    session,
    nestPath: "/api/leads/admin/export",
    method: "GET",
    fallbackError: "Export failed",
  });
}
