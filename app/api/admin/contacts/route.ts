import { NextResponse } from "next/server";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { getAdminSession } from "@/app/lib/admin/session";

function apiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = apiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${base}/api/contact/admin/all`, {
      headers: adminInternalHeaders(),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (data as { message?: string }).message ?? "Failed to load contacts" },
        { status: res.status },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
