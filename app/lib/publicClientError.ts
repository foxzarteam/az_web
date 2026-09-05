/** Hide DB/schema details from browser-facing error strings. */
export function toPublicClientError(
  raw: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const msg = Array.isArray(raw)
    ? raw.map((x) => String(x ?? "").trim()).filter(Boolean).join(" ")
    : String(raw ?? "").trim();
  if (!msg) return fallback;

  if (
    /public\.\w+|schema cache|relation |column |postgres|supabase|postgrest|sqlstate|permission denied|row-level security|\brls\b|violates |foreign key|check constraint|duplicate key|2350[0-9]|pgrst|service_role|SUPABASE_/i.test(
      msg,
    )
  ) {
    if (/duplicate|unique|already exists|23505|already registered/i.test(msg)) {
      return "This phone number is already registered. Please log in.";
    }
    return fallback;
  }

  return msg;
}
