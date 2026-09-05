import { NextResponse } from "next/server";
import { mobileHasLead } from "@/app/lib/customer/leadsByMobile";
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

    if (mobile.length !== 10) {
      return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
    }

    const ip = clientIpFromRequest(request);
    if (!allowRateLimitedAction(`customer-check-mobile:${ip}:${mobile}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const exists = await mobileHasLead(mobile);
    return NextResponse.json({ exists });
  } catch (e) {
    console.error("customer check-mobile", e);
    return NextResponse.json({ error: "Could not verify mobile number." }, { status: 500 });
  }
}
