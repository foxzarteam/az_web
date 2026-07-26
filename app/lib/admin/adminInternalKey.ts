const DEFAULT_ADMIN_INTERNAL_KEY = "az-admin-internal-dev-key";

export function adminInternalKey(): string {
  const fromEnv = (process.env.ADMIN_INTERNAL_KEY ?? "").trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_INTERNAL_KEY is required in production");
  }
  return DEFAULT_ADMIN_INTERNAL_KEY;
}

export function adminInternalHeaders(json = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-admin-internal-key": adminInternalKey(),
  };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}
