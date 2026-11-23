import { NextResponse } from "next/server";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { nestApiBase } from "@/app/lib/server/nestBase";

const KINDS = new Set(["aadhaarFront", "aadhaarBack", "panCard", "selfie"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; kind: string }> },
) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, kind } = await context.params;
  if (!KINDS.has(kind)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }
  try {
    const res = await fetch(
      `${base}/api/users/admin/${encodeURIComponent(id)}/kyc-file/${encodeURIComponent(kind)}`,
      {
        headers: adminInternalHeaders(false, {
          sub: session.sub,
          email: session.email,
          role: session.role,
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "File not found" }, { status: res.status });
    }
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
