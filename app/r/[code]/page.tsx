import { redirect } from "next/navigation";
import { normalizeAffiliateCode } from "@/app/lib/affiliate/code";

/** Fallback if middleware does not run; cookie is set in middleware on `/r/:code`. */
export default async function AffiliateRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!normalizeAffiliateCode(code ?? "")) {
    redirect("/");
  }
  redirect("/products/");
}
