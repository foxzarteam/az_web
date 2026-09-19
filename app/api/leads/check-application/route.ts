import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/leads/check-application", {
    fallbackError: "Could not verify existing application. Please try again.",
    rateKey: `lead-check:${request.headers.get("x-forwarded-for") ?? "ip"}`,
    max: 20,
  });
}
