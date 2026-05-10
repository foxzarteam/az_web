import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/app/lib/admin/session";

export async function POST() {
  await clearAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
