import { NextResponse } from "next/server";
import { nestApiBase } from "@/app/lib/server/nestBase";

const NEST_PATH = "/api/whatsapp/webhook";

/**
 * Meta server-to-server. Do not rate-limit: verify GET must not 429,
 * and inbound POSTs retry from Facebook IPs.
 */
async function proxyMetaWebhook(request: Request): Promise<NextResponse> {
  const base = nestApiBase();
  const plain = { headers: { "Content-Type": "text/plain; charset=utf-8" } };
  if (!base) {
    return new NextResponse("API not configured", { status: 503, ...plain });
  }

  const dest = `${base}${NEST_PATH}${new URL(request.url).search}`;
  const method = request.method.toUpperCase();
  const headers: Record<string, string> = { Accept: "text/plain" };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await request.text();
    } catch {
      return new NextResponse("Invalid request body", { status: 400, ...plain });
    }
  }

  try {
    const res = await fetch(dest, {
      method,
      headers,
      ...(body != null ? { body } : {}),
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "text/plain; charset=utf-8",
      },
    });
  } catch {
    return new NextResponse("Cannot reach API", { status: 503, ...plain });
  }
}

export async function GET(request: Request) {
  return proxyMetaWebhook(request);
}

export async function POST(request: Request) {
  return proxyMetaWebhook(request);
}
