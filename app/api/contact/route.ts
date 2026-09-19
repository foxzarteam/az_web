import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/contact", {
    fallbackError: "Could not send your message. Please try again.",
    max: 8,
  });
}
