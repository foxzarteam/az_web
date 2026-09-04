import { redirect } from "next/navigation";
import { getAgentSession } from "@/app/lib/agent/session";
import AgentLoginForm from "./AgentLoginForm";

export default async function AgentLoginPage() {
  const session = await getAgentSession();
  if (session) redirect("/agent/dashboard");
  return <AgentLoginForm />;
}
