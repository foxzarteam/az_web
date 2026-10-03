import "server-only";
import { adminNestGet } from "@/app/lib/admin/adminNestGet";

export type DashboardStats = {
  totalLeads: number;
  totalAgents: number;
  totalPartners: number;
};

const EMPTY: DashboardStats = { totalLeads: 0, totalAgents: 0, totalPartners: 0 };

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await adminNestGet<{ totalLeads?: number; totalAgents?: number; totalPartners?: number }>(
    "/api/admin/stats",
  );
  if (!data) return EMPTY;
  return {
    totalLeads: Number(data.totalLeads ?? 0),
    totalAgents: Number(data.totalAgents ?? 0),
    totalPartners: Number(data.totalPartners ?? 0),
  };
}
