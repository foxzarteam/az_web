const DEFAULT_ADMIN_INTERNAL_KEY = "az-admin-internal-dev-key";

export function adminInternalKey(): string {
  return (process.env.ADMIN_INTERNAL_KEY ?? "").trim() || DEFAULT_ADMIN_INTERNAL_KEY;
}

export function adminInternalHeaders(json = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-admin-internal-key": adminInternalKey(),
  };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}
