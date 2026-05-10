import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/app/lib/admin/verifyCredentials";
import { setAdminSessionCookie } from "@/app/lib/admin/session";

/**
 * Admin login: browser → this route → Bankers Nest `POST {NEXT_PUBLIC_API_URL}/api/auth/login`
 * (server/src/auth) → Supabase `public.auth`. On success, httpOnly `admin_session` cookie only here.
 */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const email = typeof body === "object" && body !== null && "email" in body ? String((body as { email: unknown }).email ?? "").trim() : "";
    const password =
      typeof body === "object" && body !== null && "password" in body
        ? String((body as { password: unknown }).password ?? "")
        : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    try {
      if (!process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_SESSION_SECRET.trim().length < 16) {
        return NextResponse.json(
          { error: "Server is not configured (ADMIN_SESSION_SECRET)." },
          { status: 503 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Server session configuration error." }, { status: 503 });
    }

    const result = await verifyAdminCredentials(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.httpStatus });
    }

    await setAdminSessionCookie({ sub: result.user.id, email: result.user.email, role: result.user.role });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin login", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
