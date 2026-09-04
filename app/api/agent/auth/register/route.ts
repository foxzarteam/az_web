import { NextResponse } from "next/server";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { setAgentSessionCookie } from "@/app/lib/agent/session";

function normalizeMobile(raw: unknown): string {
  const d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  return d.slice(-10);
}

export async function POST(request: Request) {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const obj = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const userName = String(obj.userName ?? "").trim();
  const email = String(obj.email ?? "").trim();
  const mobile = normalizeMobile(obj.mobileNumber);
  const mpin = String(obj.mpin ?? "").replace(/\D/g, "").slice(0, 4);

  if (userName.length < 2) {
    return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
  }
  if (!/^\d{4}$/.test(mpin)) {
    return NextResponse.json({ error: "Password must be a 4-digit PIN." }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/users/agent/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        userName,
        mobileNumber: mobile,
        mpin,
        ...(email ? { email } : {}),
      }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: {
        id?: string;
        user_name?: string;
        mobile_number?: string;
        referral_code?: string;
      };
      message?: string;
    };
    if (!res.ok || !data.success || !data.data?.id) {
      return NextResponse.json(
        { error: data.message ?? "Could not create account" },
        { status: res.status === 409 ? 409 : res.ok ? 400 : res.status },
      );
    }

    await setAgentSessionCookie({
      sub: String(data.data.id),
      name: String(data.data.user_name ?? userName),
      mobile: String(data.data.mobile_number ?? mobile),
      code: String(data.data.referral_code ?? ""),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
