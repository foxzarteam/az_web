import { NextResponse } from "next/server";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { allowRateLimitedAction } from "@/app/lib/security/rateLimit";

function apiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

/**
 * Reveal full PAN for a lead. Identity from session → x-admin-actor (not request body).
 * Body: reason only.
 */
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

  const base = apiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  let reason = "admin_panel_reveal";
  try {
    const body = (await request.json()) as { reason?: string };
    if (body.reason?.trim()) reason = body.reason.trim().slice(0, 200);
  } catch {
    // optional body
  }

  try {
    const res = await fetch(
      `${base}/api/leads/admin/${encodeURIComponent(id)}/pan/reveal`,
      {
        method: "POST",
        headers: adminInternalHeaders(true, {
          sub: session.sub,
          email: session.email,
          role: session.role,
        }),
        body: JSON.stringify({ reason }),
        cache: "no-store",
      },
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            (data as { message?: string; error?: string }).message ??
            (data as { error?: string }).error ??
            "Reveal failed",
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      pan: (data as { pan?: string }).pan,
      masked: (data as { masked?: string }).masked,
      revealedAt: (data as { revealedAt?: string }).revealedAt,
    });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
