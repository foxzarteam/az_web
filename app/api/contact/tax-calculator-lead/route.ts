import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/contact/tax-calculator-lead", {
    fallbackError: "Could not save details.",
    max: 10,
  });
}
