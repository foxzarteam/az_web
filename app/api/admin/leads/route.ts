import { NextResponse } from "next/server";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import {
  getAdminSession,
  isAgentRole,
  isCrmAdminRole,
} from "@/app/lib/admin/session";

function apiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || (!isCrmAdminRole(session.role) && !isAgentRole(session.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = apiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Partners cannot self-approve; Nest also forces pending + their agent_id.
  if (isAgentRole(session.role) && body && typeof body === "object") {
    (body as Record<string, unknown>).status = "pending";
  }

  try {
    const res = await fetch(`${base}/api/leads/admin`, {
      method: "POST",
      headers: adminInternalHeaders(true, {
        sub: session.sub,
        email: session.email,
        role: session.role,
      }),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            (data as { message?: string; error?: string }).message ??
            (data as { error?: string }).error ??
            "Create failed",
        },
        { status: res.status },
      );
    }

    if ((data as { success?: boolean }).success === false) {
      return NextResponse.json(
        {
          error:
            (data as { message?: string }).message ?? "Failed to create lead",
          field: (data as { field?: string }).field,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
