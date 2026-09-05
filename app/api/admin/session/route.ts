import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/app/lib/admin/verifyCredentials";
import { verifyAgentCredentials } from "@/app/lib/admin/verifyAgentCredentials";
import { setAdminSessionCookie } from "@/app/lib/admin/session";
import { allowRateLimitedAction, clientIpFromRequest } from "@/app/lib/security/rateLimit";

/**
 * Same-origin: set httpOnly `admin_session`.
 * Admin: email + password. Agent: mobile + 4-digit PIN (same cookie, role=agent).
 */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const obj = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
    const email = String(obj.email ?? "").trim();
    const password = String(obj.password ?? "");
    const mobileNumber = String(obj.mobileNumber ?? obj.mobile ?? "").trim();
    const mpin = String(obj.mpin ?? "").trim();

    const looksMobile =
      /^[6-9]\d{9}$/.test(mobileNumber.replace(/\D/g, "").slice(-10)) ||
      /^[6-9]\d{9}$/.test(email.replace(/\D/g, "").slice(-10));

    const ip = clientIpFromRequest(request);
    const identifier = looksMobile || (mobileNumber && mpin)
      ? (mobileNumber || email).replace(/\D/g, "").slice(-10) || "unknown"
      : email.toLowerCase() || "unknown";

    if (!allowRateLimitedAction(`admin-session:${ip}:${identifier}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    if (looksMobile || (mobileNumber && mpin)) {
      const mobile = mobileNumber || email;
      const pin = mpin || password;
      const result = await verifyAgentCredentials(mobile, pin);
      if (!result.ok) {
        return NextResponse.json({ error: result.message }, { status: result.httpStatus });
      }
      await setAdminSessionCookie({
        sub: result.user.id,
        email: result.user.mobile,
        role: "agent",
        name: result.user.name,
        mobile: result.user.mobile,
        code: result.user.code,
      });
      return NextResponse.json({ ok: true, role: "agent" });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await verifyAdminCredentials(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.httpStatus });
    }

    await setAdminSessionCookie({
      sub: result.user.id,
      email: result.user.email,
      role: result.user.role,
      name: result.user.full_name || undefined,
    });
    return NextResponse.json({ ok: true, role: result.user.role });
  } catch (e) {
    console.error("admin session", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
