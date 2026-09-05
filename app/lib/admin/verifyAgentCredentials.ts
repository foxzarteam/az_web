import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";

export type VerifiedAgent = {
  id: string;
  name: string;
  mobile: string;
  code: string;
};

export type VerifyAgentResult =
  | { ok: true; user: VerifiedAgent }
  | { ok: false; message: string; httpStatus: number };

function normalizeMobile(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  return d.slice(-10);
}

/** Nest `POST /api/users/agent/login` → users table (mobile + mpin). */
export async function verifyAgentCredentials(
  mobileRaw: string,
  mpin: string,
): Promise<VerifyAgentResult> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) {
    return { ok: false, message: "Login service is not configured.", httpStatus: 503 };
  }

  const mobile = normalizeMobile(mobileRaw);
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { ok: false, message: "Invalid phone or PIN", httpStatus: 400 };
  }
  if (!/^\d{4}$/.test(mpin)) {
    return { ok: false, message: "Invalid phone or PIN", httpStatus: 400 };
  }

  try {
    const res = await fetch(`${base}/api/users/agent/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ mobileNumber: mobile, mpin }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: {
        id?: string;
        user_name?: string;
        mobile_number?: string;
        referral_code?: string;
      };
      message?: string;
    };
    if (!res.ok || !data.success || !data.data?.id) {
      return {
        ok: false,
        message: data.message ?? "Invalid phone or PIN",
        httpStatus: res.status === 401 ? 401 : res.ok ? 401 : res.status,
      };
    }
    return {
      ok: true,
      user: {
        id: String(data.data.id),
        name: String(data.data.user_name ?? "Agent"),
        mobile: String(data.data.mobile_number ?? mobile),
        code: String(data.data.referral_code ?? ""),
      },
    };
  } catch {
    return { ok: false, message: "Cannot reach login service. Try again later.", httpStatus: 503 };
  }
}
