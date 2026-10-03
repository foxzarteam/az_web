import { NextResponse } from "next/server";
import { nestApiBase } from "@/app/lib/server/nestBase";

/** Public wa.me link for the website button. No credentials. */
export async function GET() {
  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ url: null }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const res = await fetch(`${base}/api/whatsapp/link`, { cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as { url?: unknown };
    const url = typeof data.url === "string" && data.url.startsWith("https://wa.me/") ? data.url : null;
    return NextResponse.json({ url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ url: null }, { headers: { "Cache-Control": "no-store" } });
  }
}
