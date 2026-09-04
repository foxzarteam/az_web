import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";

export type AgentClientRow = {
  id?: string;
  full_name?: string | null;
  mobile_number?: string | null;
  category?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export async function fetchAgentClients(agentId: string): Promise<AgentClientRow[]> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base || !agentId) return [];
  try {
    const res = await fetch(
      `${base}/api/leads/admin/by-agent/${encodeURIComponent(agentId)}`,
      { headers: adminInternalHeaders(), cache: "no-store" },
    );
    const body = (await res.json()) as { data?: AgentClientRow[] };
    if (!res.ok || !Array.isArray(body.data)) return [];
    return body.data;
  } catch {
    return [];
  }
}
