import { NextResponse } from "next/server";
import { proxyAdminToNest } from "@/app/lib/admin/proxyAdminNest";
import {
  getAdminSession,
  isAgentRole,
  isCrmAdminRole,
} from "@/app/lib/admin/session";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || (!isCrmAdminRole(session.role) && !isAgentRole(session.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (isAgentRole(session.role) && body && typeof body === "object") {
    (body as Record<string, unknown>).status = "pending";
  }

  return proxyAdminToNest({
    session,
    nestPath: "/api/leads/admin",
    method: "POST",
    body,
    fallbackError: "Create failed",
    successStatus: 201,
  });
}
