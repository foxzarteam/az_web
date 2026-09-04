import { NextResponse } from "next/server";
import { clearAgentSessionCookie } from "@/app/lib/agent/session";

export async function POST() {
  await clearAgentSessionCookie();
  return NextResponse.json({ ok: true });
}
