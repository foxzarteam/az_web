import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeadersFromSession } from "@/app/lib/admin/adminInternalKey";

export type AgentWallet = {
  earning: number;
  redeem: number;
  balance: number;
  currency: string;
};

function num(v: unknown): number {
  const x = typeof v === "string" ? Number(v.trim()) : Number(v);
  return Number.isFinite(x) ? x : 0;
}

/** Load `public.wallet` for a partner via Nest GET /api/wallet/user/:userId */
export async function fetchAgentWallet(userId: string): Promise<AgentWallet | null> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  const uid = userId.trim();
  if (!base || !uid) return null;

  const headers = await adminInternalHeadersFromSession();
  if (!headers) return null;

  try {
    const res = await fetch(`${base}/api/wallet/user/${encodeURIComponent(uid)}`, {
      headers,
      cache: "no-store",
    });

    const body = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: {
        earning?: unknown;
        redeem?: unknown;
        balance?: unknown;
        currency?: unknown;
      };
    };

    if (!res.ok || !body.success || !body.data) {
      return { earning: 0, redeem: 0, balance: 0, currency: "INR" };
    }

    return {
      earning: num(body.data.earning),
      redeem: num(body.data.redeem),
      balance: num(body.data.balance),
      currency: "INR",
    };
  } catch {
    return { earning: 0, redeem: 0, balance: 0, currency: "INR" };
  }
}
