import "server-only";
import { NextResponse } from "next/server";
import { toPublicClientError } from "@/app/lib/publicClientError";
import { adminInternalHeaders } from "./adminInternalKey";
import { nestApiBase } from "@/app/lib/server/nestBase";
import type { AdminSession } from "./session";

type NestErrorBody = {
  message?: string;
  error?: string;
  code?: string;
  leadStatusSaved?: boolean;
  field?: string;
  success?: boolean;
};

export async function proxyAdminToNest(opts: {
  session: AdminSession;
  nestPath: string;
  method: string;
  body?: unknown;
  fallbackError: string;
  successStatus?: number;
}): Promise<NextResponse> {
  const base = nestApiBase();
  if (!base) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  const method = opts.method.toUpperCase();
  const hasBody = opts.body !== undefined && method !== "GET" && method !== "HEAD";

  try {
    const res = await fetch(`${base}${opts.nestPath}`, {
      method,
      headers: adminInternalHeaders(hasBody, {
        sub: opts.session.sub,
        email: opts.session.email,
        role: opts.session.role,
      }),
      ...(hasBody ? { body: JSON.stringify(opts.body) } : {}),
      cache: "no-store",
    });

    const data = (await res.json().catch(() => ({}))) as NestErrorBody;

    if (!res.ok || data.success === false) {
      const raw = data.message ?? data.error;
      const payload: Record<string, unknown> = {
        error: toPublicClientError(raw, opts.fallbackError),
      };
      if (data.code) payload.code = data.code;
      if (data.field) payload.field = data.field;
      if (typeof data.leadStatusSaved === "boolean") {
        payload.leadStatusSaved = data.leadStatusSaved;
      }
      return NextResponse.json(payload, {
        status: res.ok ? 400 : res.status,
      });
    }

    return NextResponse.json(data, { status: opts.successStatus ?? res.status });
  } catch {
    return NextResponse.json({ error: "Cannot reach API" }, { status: 503 });
  }
}
