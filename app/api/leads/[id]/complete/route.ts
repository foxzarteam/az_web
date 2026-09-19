import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyPublicToNest(request, `/api/leads/${encodeURIComponent(id)}/complete`, {
    fallbackError: "Could not update details. Please try again.",
    max: 12,
  });
}
