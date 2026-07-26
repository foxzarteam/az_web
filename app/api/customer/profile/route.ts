import { NextResponse } from "next/server";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";
import {
  getCustomerSession,
  setCustomerSessionCookie,
} from "@/app/lib/customer/session";

type CustomerProfile = {
  name: string;
  mobile: string;
  email: string | null;
  pan: string | null;
  totalApplications: number;
  memberSince: string | null;
};

function apiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

export async function GET() {
  const session = await getCustomerSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = apiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${base}/api/customer/profile`, {
      method: "POST",
      headers: adminInternalHeaders(true),
      body: JSON.stringify({ mobileNumber: session.sub }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      profile?: CustomerProfile;
      message?: string;
    };
    if (!res.ok || !data.profile) {
      return NextResponse.json(
        { error: data.message ?? "Could not load profile" },
        { status: res.status === 200 ? 500 : res.status },
      );
    }
    return NextResponse.json({ success: true, profile: data.profile });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const session = await getCustomerSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = apiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  let body: { fullName?: unknown; email?: unknown };
  try {
    body = (await request.json()) as { fullName?: unknown; email?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  if (fullName.length < 2) {
    return NextResponse.json({ error: "Enter your full name" }, { status: 400 });
  }
  const email = String(body.email ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/customer/profile`, {
      method: "PATCH",
      headers: adminInternalHeaders(true),
      body: JSON.stringify({ mobileNumber: session.sub, fullName, email }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      profile?: CustomerProfile;
      message?: string;
      error?: string;
    };
    if (!res.ok || data.success === false) {
      return NextResponse.json(
        { error: data.message ?? data.error ?? "Update failed" },
        { status: res.ok ? 400 : res.status },
      );
    }

    await setCustomerSessionCookie({
      sub: session.sub,
      name: data.profile?.name ?? fullName,
    });

    return NextResponse.json({ success: true, profile: data.profile });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
