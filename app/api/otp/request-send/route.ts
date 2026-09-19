import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function POST(request: Request) {
  return proxyPublicToNest(request, "/api/otp/request-send", {
    fallbackError: "Could not send OTP. Please try again.",
    max: 8,
  });
}
