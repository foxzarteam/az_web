import { NextResponse } from "next/server";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { getCustomerSession } from "@/app/lib/customer/session";

function apiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getCustomerSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Missing application id" }, { status: 400 });
  }

  const base = apiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${base}/api/customer/applications/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: adminInternalHeaders(true),
      body: JSON.stringify({ mobileNumber: session.sub }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            (data as { message?: string; error?: string }).message ??
            (data as { error?: string }).error ??
            "Delete failed",
        },
        { status: res.status },
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
