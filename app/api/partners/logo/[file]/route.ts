import { NextResponse } from "next/server";
import { nestApiBase } from "@/app/lib/server/nestBase";

const FILE_RE = /^[A-Za-z0-9._-]+\.(jpe?g|png|webp|gif)$/i;

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const file = decodeURIComponent((await context.params).file ?? "").trim();
  if (!FILE_RE.test(file)) {
    return new NextResponse(null, { status: 404 });
  }

  const base = nestApiBase();
  if (!base) {
    return new NextResponse(null, { status: 503 });
  }

  const res = await fetch(`${base}/api/partners/logo/${encodeURIComponent(file)}`, {
    cache: "no-store",
  }).catch(() => null);
  if (!res?.ok || !res.body) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
