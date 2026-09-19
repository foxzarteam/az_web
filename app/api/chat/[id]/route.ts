import { proxyPublicToNest } from "@/app/lib/server/proxyPublicNest";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyPublicToNest(request, `/api/chat/${encodeURIComponent(id)}`, {
    fallbackError: "Could not update chat.",
    max: 20,
  });
}
