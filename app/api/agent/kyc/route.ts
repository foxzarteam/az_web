import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import { requireAdminSession } from "@/app/lib/admin/requireAdminRole";

export async function GET() {
  const session = await requireAdminSession({ roles: ["agent"] });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return proxyAdminToNest({
    session,
    nestPath: "/api/users/agent/kyc-status",
    method: "GET",
    fallbackError: "Could not load KYC status.",
  });
}

export async function POST(request: Request) {
  const session = await requireAdminSession({ roles: ["agent"] });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  return proxyAdminToNest({
    session,
    nestPath: "/api/users/agent/kyc",
    method: "POST",
    body,
    fallbackError: "Could not submit KYC.",
    passThroughError: true,
  });
}
