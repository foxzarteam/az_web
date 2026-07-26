import { NextResponse } from "next/server";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { getAdminSession } from "@/app/lib/admin/session";

function apiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

/**
 * Reveal full PAN for a lead. Forwards admin session identity so Nest can audit.
 * Response includes plaintext PAN once — never log it client-side beyond UI state.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent");

  try {
    const res = await fetch(
      `${base}/api/leads/admin/${encodeURIComponent(id)}/pan/reveal`,
      {
        method: "POST",
        headers: adminInternalHeaders(true),
        body: JSON.stringify({
          adminId: session.sub,
          adminEmail: session.email,
          adminRole: session.role,
          reason,
          ipAddress,
          userAgent,
        }),
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
