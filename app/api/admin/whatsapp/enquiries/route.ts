import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireCrmAdminSession } from "@/app/lib/admin/requireAdminRole";

export async function GET(request: Request) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const q = url.searchParams.get("q") || "";
  const params = new URLSearchParams({ page });
  if (q.trim()) params.set("q", q.trim().slice(0, 40));

  return proxyAdminToNest({
    session,
    nestPath: `/api/whatsapp/admin/enquiries?${params.toString()}`,
    method: "GET",
    fallbackError: "Failed to load WhatsApp queries",
  });
}

export async function POST(request: Request) {
  const session = await requireCrmAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { phone?: string; text?: string } | null;
  return proxyAdminToNest({
    session,
    nestPath: "/api/whatsapp/admin/enquiries",
    method: "POST",
    body: { phone: String(body?.phone ?? ""), text: String(body?.text ?? "") },
    fallbackError: "Could not start this chat.",
  });
}
