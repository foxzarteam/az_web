import { getAgentSession } from "@/app/lib/agent/session";
import { fetchAgentClients } from "@/app/lib/agent/fetchClients";
import AgentPortal from "./AgentPortal";
import { redirect } from "next/navigation";

export default async function AgentDashboardPage() {
  const session = await getAgentSession();
  if (!session) redirect("/agent/login");
  const clients = await fetchAgentClients(session.sub);
  return <AgentPortal session={session} clients={clients} />;
}
