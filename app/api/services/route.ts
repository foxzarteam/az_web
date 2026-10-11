import { NextResponse } from "next/server";
import { PUBLIC_API_FALLBACK_ORIGIN } from "@/app/config/publicEnv";
import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function GET(request: Request) {
  const local = await proxyPublicToNest(request, "/api/services", {
    fallbackError: "Could not load products.",
    max: 40,
  });
  if (local.status < 500) return local;

  try {
    const res = await fetch(`${PUBLIC_API_FALLBACK_ORIGIN.replace(/\/+$/, "")}/api/services`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const raw = await res.text();
    return new NextResponse(raw, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return local;
  }
}
