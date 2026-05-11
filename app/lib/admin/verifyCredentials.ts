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

function adminApiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

export type VerifyCredentialsResult =
  | { ok: true; user: VerifiedAdmin }
  | { ok: false; message: string; httpStatus: number };

/**
 * Server-side: Nest `POST /api/auth/login` → `public.auth` (email + password verified on server).
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<VerifyCredentialsResult> {
  const base = adminApiBase();
  if (!base) {
    return {
      ok: false,
      message: "Login service is not configured.",
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
      if (res.status === 400) {
        return { ok: false, message: "Invalid email or password", httpStatus: 400 };
      }
      if (res.status === 404) {
        return {
          ok: false,
          message: "Login service not found. Try again later.",
          httpStatus: 503,
        };
      }
      if (res.status === 503 || res.status === 502) {
        return {
          ok: false,
          message: "Login temporarily unavailable. Try again later.",
          httpStatus: 503,
        };
      }
      return {
        ok: false,
        message: "Something went wrong. Try again later.",
        httpStatus: res.status >= 500 ? 503 : res.status,
      };
    }

    const data = (await res.json()) as LoginApiBody;
    const u = data.user;
    if (!data.ok || !u?.id || !u?.email || !u?.role) {
      return { ok: false, message: "Something went wrong. Try again later.", httpStatus: 503 };
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
      message: "Cannot reach login service. Try again later.",
      httpStatus: 503,
    };
  }
}
