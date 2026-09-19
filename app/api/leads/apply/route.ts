import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/leads/apply", {
    fallbackError: "Could not submit application. Please try again.",
    max: 12,
  });
}
