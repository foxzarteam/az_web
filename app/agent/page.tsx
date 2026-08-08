import type { Metadata } from "next";
import AgentLanding from "@/app/components/agent/AgentLanding";
import { AGENT_PROFILE } from "@/app/agent/agent-config";
import { buildPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `${AGENT_PROFILE.displayName} | Advisor | Apni Zaroorat`,
  description: `${AGENT_PROFILE.headline.slice(0, 155)}${AGENT_PROFILE.headline.length > 155 ? "…" : ""}`,
  path: "/agent",
  absoluteTitle: true,
  noIndex: true,
});

export default function AgentPage() {
  return <AgentLanding />;
}
