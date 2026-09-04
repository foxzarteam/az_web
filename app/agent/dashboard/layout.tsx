import { redirect } from "next/navigation";
import { getAgentSession } from "@/app/lib/agent/session";
import AgentDashboardShell from "./AgentDashboardShell";

export default async function AgentDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAgentSession();
  if (!session) redirect("/agent/login");
  return <AgentDashboardShell name={session.name}>{children}</AgentDashboardShell>;
}
