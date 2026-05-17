import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";

export type DashboardStats = {
  totalLeads: number;
  totalAgents: number;
  totalPartners: number;
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) {
    return { totalLeads: 0, totalAgents: 0, totalPartners: 0 };
  }

  const url = `${base}/api/admin/stats`;

  try {
    const res = await fetch(url, {
      headers: adminInternalHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { totalLeads: 0, totalAgents: 0, totalPartners: 0 };
    }

    const body = (await res.json()) as {
      success?: boolean;
      data?: { totalLeads?: number; totalAgents?: number; totalPartners?: number };
    };

    if (!body.success || !body.data) {
      return { totalLeads: 0, totalAgents: 0, totalPartners: 0 };
    }

    return {
      totalLeads: Number(body.data.totalLeads ?? 0),
      totalAgents: Number(body.data.totalAgents ?? 0),
      totalPartners: Number(body.data.totalPartners ?? 0),
    };
  } catch {
    return { totalLeads: 0, totalAgents: 0, totalPartners: 0 };
  }
}
