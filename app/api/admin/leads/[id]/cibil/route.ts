import { NextResponse } from "next/server";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import { requireAdminSession } from "@/app/lib/admin/requireAdminRole";
import { nestApiBase } from "@/app/lib/server/nestBase";
import { toPublicClientError } from "@/app/lib/publicClientError";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminSession({ roles: ["admin", "staff", "agent"] });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
  }

  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  try {
    const upstream = await fetch(`${base}/api/leads/admin/${encodeURIComponent(id)}/cibil-report`, {
      method: "GET",
      headers: adminInternalHeaders(false, {
        sub: session.sub,
        email: session.email,
        role: session.role,
      }),
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      const data = (await upstream.json().catch(() => ({}))) as { message?: string; error?: string };
      return NextResponse.json(
        {
          error: toPublicClientError(
            data.message ?? data.error,
            "Could not download the CIBIL report.",
          ),
        },
        { status: upstream.status || 502 },
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
    headers.set(
      "Content-Disposition",
      upstream.headers.get("content-disposition") || 'attachment; filename="cibil-report"',
    );
    headers.set("Cache-Control", "private, no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    const length = upstream.headers.get("content-length");
    if (length) headers.set("Content-Length", length);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
