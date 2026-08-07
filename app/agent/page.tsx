import type { Metadata } from "next";
import AgentLanding from "@/app/components/agent/AgentLanding";
import { AGENT_PROFILE } from "@/app/agent/agent-config";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  absoluteSeoUrl,
  buildPageMetadata,
  pageSeoGlue,
} from "@/app/lib/seo";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

export const metadata: Metadata = buildPageMetadata({
  title: `${AGENT_PROFILE.displayName} | Advisor`,
  description: `${AGENT_PROFILE.headline.slice(0, 155)}${AGENT_PROFILE.headline.length > 155 ? "…" : ""}`,
  path: "/agent",
});

const structuredData = pageSeoGlue({
  name: `${AGENT_PROFILE.displayName} | Advisor`,
  description: AGENT_PROFILE.headline,
  path: "/agent",
  extra: [
    {
      "@type": "Person",
      "@id": `${absoluteSeoUrl("/agent")}#person`,
      name: AGENT_PROFILE.displayName,
      jobTitle: AGENT_PROFILE.role,
      description: AGENT_PROFILE.headline,
      url: absoluteSeoUrl("/agent"),
      worksFor: { "@id": `${PUBLIC_SITE_URL}/#organization` },
    },
  ],
});

export default function AgentPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <AgentLanding />
    </>
  );
}
