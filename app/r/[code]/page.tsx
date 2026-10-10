import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AffiliateLanding from "@/app/components/affiliate/AffiliateLanding";
import { normalizeAffiliateCode } from "@/app/lib/affiliate/code";
import { buildPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Products",
  description: "Apni Zaroorat partner referral landing.",
  path: "/r",
  noIndex: true,
});

/**
 * Fallback when middleware rewrite does not run.
 * Keeps URL as `/r/:code` and shows the same products hub.
 */
export default async function AffiliateLandingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!normalizeAffiliateCode(code ?? "")) {
    redirect("/");
  }
  return <AffiliateLanding />;
}
