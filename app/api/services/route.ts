import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function GET(request: Request) {
  return proxyPublicToNest(request, "/api/services", {
    fallbackError: "Could not load products.",
    max: 40,
  });
}
