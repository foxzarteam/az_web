import type { Metadata } from "next";
import AgentLanding from "@/app/components/agent/AgentLanding";
import { AGENT_PROFILE } from "@/app/agent/agent-config";
import {
  absoluteSeoUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  graphJsonLd,
  jsonLdScript,
  organizationJsonLd,
} from "@/app/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `${AGENT_PROFILE.displayName} | Advisor`,
  description: `${AGENT_PROFILE.headline.slice(0, 155)}${AGENT_PROFILE.headline.length > 155 ? "…" : ""}`,
  path: "/agent",
});

const org = organizationJsonLd();

const structuredData = graphJsonLd(
  org,
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: AGENT_PROFILE.displayName, path: "/agent" },
  ]),
  {
    "@type": "Person",
    name: AGENT_PROFILE.displayName,
    jobTitle: AGENT_PROFILE.role,
    description: AGENT_PROFILE.headline,
    url: absoluteSeoUrl("/agent"),
    worksFor: { "@id": org["@id"] },
  },
);

export default function AgentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }}
      />
      <AgentLanding />
    </>
  );
}
