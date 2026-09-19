import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/chat", {
    fallbackError: "Could not save chat. Please try again.",
    max: 10,
  });
}
