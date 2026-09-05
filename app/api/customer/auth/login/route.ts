import { NextResponse } from "next/server";
import { customerLoginOnApi } from "@/app/lib/customer/leadsByMobile";
import { setCustomerSessionCookie } from "@/app/lib/customer/session";
import { allowRateLimitedAction, clientIpFromRequest } from "@/app/lib/security/rateLimit";

function normalizeMobile(raw: unknown): string {
  const d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  return d.slice(-10);
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const mobile =
      typeof body === "object" && body !== null && "mobileNumber" in body
        ? normalizeMobile((body as { mobileNumber: unknown }).mobileNumber)
        : "";
    const idToken =
      typeof body === "object" && body !== null && "idToken" in body
        ? String((body as { idToken: unknown }).idToken ?? "").trim()
        : "";

    if (mobile.length !== 10) {
      return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
    }
    if (!idToken) {
      return NextResponse.json({ error: "Verification token missing." }, { status: 400 });
    }

    const ip = clientIpFromRequest(request);
    if (!allowRateLimitedAction(`customer-login:${ip}:${mobile}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const result = await customerLoginOnApi(mobile, idToken);
    if (!result.ok) {
      const msg = result.message || "Login failed.";
      const status = msg.toLowerCase().includes("no application")
        ? 404
        : msg.toLowerCase().includes("otp") || msg.toLowerCase().includes("verif")
          ? 401
          : 400;
      return NextResponse.json({ error: msg }, { status });
    }

    const name = result.customer?.name || "Customer";
    await setCustomerSessionCookie({ sub: mobile, name });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("customer login", e);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
