import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/app/lib/admin/verifyCredentials";
import { setAdminSessionCookie } from "@/app/lib/admin/session";

/**
 * Same-origin only: after Nest `POST …/api/auth/login` succeeds in the browser,
 * call this to set the httpOnly `admin_session` cookie (Next cannot read cross-site Nest cookies).
 * Re-verifies credentials server-side via Nest before setting the cookie.
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

    const result = await verifyAdminCredentials(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.httpStatus });
    }

    await setAdminSessionCookie({ sub: result.user.id, email: result.user.email, role: result.user.role });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin session", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
