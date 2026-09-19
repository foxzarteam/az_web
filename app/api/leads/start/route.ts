import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/leads/start", {
    fallbackError: "Could not start application. Please try again.",
    max: 12,
  });
}
