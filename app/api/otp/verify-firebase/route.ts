import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/otp/verify-firebase", {
    fallbackError: "Verification failed. Please try again.",
    max: 10,
  });
}
