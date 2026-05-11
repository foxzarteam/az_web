import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";

export type VerifiedAdmin = {
  id: string;
  email: string;
  role: string;
  full_name: string;
};

type LoginApiBody = {
  ok?: boolean;
  message?: string;
  user?: { id: string; email: string; role: string; full_name: string };
};

/** Nest / class-validator error bodies use `message` as string or string[]. */
function pickNestMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const m = (body as { message?: unknown }).message;
  if (typeof m === "string" && m.trim()) return m.trim();
  if (Array.isArray(m)) {
    const parts = m.filter((x): x is string => typeof x === "string" && x.trim() !== "");
    if (parts.length) return parts.join(" ");
  }
  return undefined;
}

/** Same base as leads / public API: `NEXT_PUBLIC_API_URL` → `PUBLIC_API_BASE_URL`. Nest must listen on this origin; Next dev uses another port (see package.json `dev`). */
function adminApiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

export type VerifyCredentialsResult =
  | { ok: true; user: VerifiedAdmin }
  | { ok: false; message: string; httpStatus: number };

/**
 * Server-side only: calls **az_pro/server** Nest `AuthController` → `POST /api/auth/login`.
 * No Supabase from Next for admin credentials — single source of truth is the Bankers API + `public.auth`.
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<VerifyCredentialsResult> {
  const base = adminApiBase();
  if (!base) {
    return {
      ok: false,
      message: "NEXT_PUBLIC_API_URL is missing. Set it to your Nest API origin (e.g. https://your-api.vercel.app) and redeploy.",
      httpStatus: 503,
    };
  }

  const url = `${base}/api/auth/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
      cache: "no-store",
    });

    const raw = await res.text();
    let parsed: unknown;
    try {
      parsed = raw ? (JSON.parse(raw) as unknown) : undefined;
    } catch {
      parsed = undefined;
    }

    const nestMsg = pickNestMessage(parsed);

    if (!res.ok) {
      if (res.status === 401) {
        return {
          ok: false,
          message: nestMsg || "Login was rejected (401). Check email, password, and public.auth in Supabase.",
          httpStatus: 401,
        };
      }
      if (res.status === 400) {
        return {
          ok: false,
          message: nestMsg || "Invalid request to the login API (check email format).",
          httpStatus: 400,
        };
      }
      if (res.status === 404) {
        return {
          ok: false,
          message:
            nestMsg ||
            `Login URL not found: ${url}. Is Nest running with global prefix "api"? Set NEXT_PUBLIC_API_URL to that API’s origin.`,
          httpStatus: 503,
        };
      }
      if (res.status === 503 || res.status === 502) {
        return {
          ok: false,
          message: nestMsg || `Login API unavailable (HTTP ${res.status}). Try again later.`,
          httpStatus: 503,
        };
      }
      const preview = raw.replace(/\s+/g, " ").slice(0, 200);
      return {
        ok: false,
        message:
          nestMsg ||
          (preview
            ? `Login API returned HTTP ${res.status}: ${preview}`
            : `Login API returned HTTP ${res.status}.`),
        httpStatus: res.status >= 500 ? 503 : res.status,
      };
    }

    const data = parsed as LoginApiBody;
    const u = data?.user;
    if (!data?.ok || !u?.id || !u?.email || !u?.role) {
      return {
        ok: false,
        message: nestMsg || "Login API returned 200 but the response body was not usable (missing user).",
        httpStatus: 503,
      };
    }

    return {
      ok: true,
      user: {
        id: String(u.id),
        email: u.email,
        role: u.role,
        full_name: typeof u.full_name === "string" ? u.full_name : "",
      },
    };
  } catch {
    return {
      ok: false,
      message: `Cannot reach the login API at ${base}. Start or deploy the Nest server and ensure NEXT_PUBLIC_API_URL matches it.`,
      httpStatus: 503,
    };
  }
}
