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
      message: "Missing NEXT_PUBLIC_API_URL (Bankers / Nest API base).",
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

    if (!res.ok) {
      if (res.status === 401) {
        return { ok: false, message: "Invalid email or password", httpStatus: 401 };
      }
      let bodyPreview = "";
      try {
        const text = await res.text();
        bodyPreview = text.slice(0, 120);
      } catch {
        /* ignore */
      }
      if (res.status === 404) {
        return {
          ok: false,
          message:
            `Login API not found at ${url}. Start Nest on the same host/port as NEXT_PUBLIC_API_URL (e.g. server: npm run start:dev), and run Next on a different port (az_web: npm run dev → port 3001).`,
          httpStatus: 503,
        };
      }
      return {
        ok: false,
        message: `Login API returned ${res.status}${bodyPreview ? `: ${bodyPreview}` : ""}`,
        httpStatus: 503,
      };
    }

    const data = (await res.json()) as LoginApiBody;
    const u = data.user;
    if (!data.ok || !u?.id || !u.email || !u.role) {
      return { ok: false, message: "Invalid login response from API.", httpStatus: 503 };
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
      message: `Cannot reach Bankers API at ${base}. Start Nest (server/: npm run start:dev) so it matches NEXT_PUBLIC_API_URL.`,
      httpStatus: 503,
    };
  }
}
