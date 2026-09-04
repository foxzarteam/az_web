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

  const mobile =
    typeof body === "object" && body !== null && "mobileNumber" in body
      ? normalizeMobile((body as { mobileNumber: unknown }).mobileNumber)
      : "";
  const mpin =
    typeof body === "object" && body !== null && "mpin" in body
      ? String((body as { mpin: unknown }).mpin ?? "").trim()
      : "";

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
  }
  if (!/^\d{4}$/.test(mpin)) {
    return NextResponse.json({ error: "PIN must be 4 digits." }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/users/agent/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ mobileNumber: mobile, mpin }),
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
        { error: data.message ?? "Invalid phone or PIN" },
        { status: res.status === 401 ? 401 : res.ok ? 401 : res.status },
      );
    }

    await setAgentSessionCookie({
      sub: String(data.data.id),
      name: String(data.data.user_name ?? "Agent"),
      mobile: String(data.data.mobile_number ?? mobile),
      code: String(data.data.referral_code ?? ""),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
