import { NextResponse } from "next/server";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";
import { nestApiBase } from "@/app/lib/server/nestBase";

type Params = { params: Promise<{ id: string; messageId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, messageId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !messageId) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }

  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `${base}/api/whatsapp/admin/enquiries/${encodeURIComponent(id)}/media/${encodeURIComponent(messageId)}`,
      {
        headers: {
          ...adminInternalHeaders(false, {
            sub: session.sub,
            email: session.email,
            role: session.role,
          }),
          Accept: "*/*",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Media not found." }, { status: res.status === 401 ? 401 : 404 });
    }
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": "private, max-age=120",
        "Content-Disposition": res.headers.get("content-disposition") || "inline",
      },
    });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
