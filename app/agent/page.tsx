import type { Metadata } from "next";
import AgentLanding from "@/app/components/agent/AgentLanding";
import { AGENT_PROFILE } from "@/app/agent/agent-config";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

export const metadata: Metadata = {
  title: `${AGENT_PROFILE.displayName} | Advisor | Apni Zaroorat`,
  description: `${AGENT_PROFILE.role}. Connect with your Apni Zaroorat advisor.`,
  openGraph: {
    title: `${AGENT_PROFILE.displayName} — Apni Zaroorat`,
    description: `${AGENT_PROFILE.role}. Personal loan & insurance guidance.`,
    url: `${PUBLIC_SITE_URL}/agent`,
  },
};

export default function AgentPage() {
  return <AgentLanding />;
}
