import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { allowRateLimitedAction } from "@/app/lib/security/rateLimit";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!allowRateLimitedAction(`pan-reveal:${session.sub}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "Too many PAN reveals. Try again in a minute." },
      { status: 429 },
    );
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
  }

  let reason = "admin_panel_reveal";
  try {
    const body = (await request.json()) as { reason?: string };
    if (body.reason?.trim()) reason = body.reason.trim().slice(0, 200);
  } catch {
    /* optional body */
  }

  return proxyAdminToNest({
    session,
    nestPath: `/api/leads/admin/${encodeURIComponent(id)}/pan/reveal`,
    method: "POST",
    body: { reason },
    fallbackError: "Reveal failed",
  });
}
