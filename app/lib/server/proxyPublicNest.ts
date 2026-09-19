import "server-only";
import { NextResponse } from "next/server";
import { toPublicClientError } from "@/app/lib/publicClientError";
import { allowRateLimitedAction, clientIpFromRequest } from "@/app/lib/security/rateLimit";
import { nestApiBase } from "./nestBase";

type NestJson = {
  message?: string;
  error?: string;
  success?: boolean;
  [key: string]: unknown;
};

function sanitizeNestJson(data: NestJson, fallback: string): NestJson {
  const next = { ...data };
  if (typeof next.message === "string") {
    next.message = toPublicClientError(next.message, fallback);
  }
  if (typeof next.error === "string") {
    next.error = toPublicClientError(next.error, fallback);
  }
  return next;
}

/** Same-origin BFF → Nest. Forwards Authorization so Firebase idToken still works. */
export async function proxyPublicToNest(
  request: Request,
  nestPath: string,
  opts?: {
    fallbackError?: string;
    rateKey?: string;
    max?: number;
    windowMs?: number;
  },
): Promise<NextResponse> {
  const fallback = opts?.fallbackError ?? "Something went wrong. Please try again.";
  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ success: false, message: "API not configured" }, { status: 503 });
  }

  const ip = clientIpFromRequest(request);
  const rateKey = opts?.rateKey ?? `public:${request.method}:${nestPath}:${ip}`;
  if (!allowRateLimitedAction(rateKey, opts?.max ?? 30, opts?.windowMs ?? 60_000)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  const method = request.method.toUpperCase();
  const headers: Record<string, string> = { Accept: "application/json" };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  const authorization = request.headers.get("authorization");
  if (authorization) headers.Authorization = authorization;
  const firebaseToken = request.headers.get("x-firebase-id-token");
  if (firebaseToken) headers["x-firebase-id-token"] = firebaseToken;

  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await request.text();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }
  }

  try {
    const res = await fetch(`${base}${nestPath}`, {
      method,
      headers,
      ...(body != null && body !== "" ? { body } : {}),
      cache: "no-store",
    });
    const raw = await res.text();
    let data: NestJson = {};
    if (raw) {
      try {
        data = JSON.parse(raw) as NestJson;
      } catch {
        return NextResponse.json(
          { success: false, message: fallback },
          { status: res.ok ? 502 : res.status },
        );
      }
    }
    return NextResponse.json(sanitizeNestJson(data, fallback), { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Cannot reach API" }, { status: 503 });
  }
}
