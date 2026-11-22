export const REQUIRED_DOCUMENTS = [
  "AADHAR CARD",
  "PAN CARD",
  "BANK STATEMENT",
  "SALARY SLIP",
  "CURRENT ADDRESS",
  "OFFICE ADDRESS",
] as const;

export function parsePartnerDocuments(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
  const allowed = new Set<string>(REQUIRED_DOCUMENTS);
  const out: string[] = [];
  for (const item of list) {
    const value = String(item ?? "").trim();
    if (!allowed.has(value) || out.includes(value)) continue;
    out.push(value);
  }
  return out;
}

export function partnerName(row: Record<string, unknown>): string {
  const name = String(row.name ?? "").trim();
  return name || "Aggregator";
}

export function partnerProductLabel(row: Record<string, unknown>): string {
  const names = String(row.service_names ?? "").trim();
  if (names) return names;
  const ids = String(row.service_id ?? "").trim();
  return ids || "—";
}

export function partnerProductList(row: Record<string, unknown>): string[] {
  return partnerProductLabel(row)
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && item !== "—");
}

export function partnerPolicyText(row: Record<string, unknown>): string {
  return String(row.policy ?? "").trim();
}

export function partnerUtmLink(row: Record<string, unknown>): string {
  return String(row.utm_link ?? "").trim();
}

export function partnerImageSrc(row: Record<string, unknown>): string {
  const value = String(row.image_path ?? "").trim();
  if (!value) return "";
  if (value.startsWith("blob:") || value.startsWith("data:")) return value;
  if (/^\/images\/aggregators\/[A-Za-z0-9._-]+$/.test(value)) return value;
  if (/^https:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? value : "";
    } catch {
      return "";
    }
  }
  const key = value.replace(/^\//, "");
  const file = key.startsWith("aggregators/") ? key.slice("aggregators/".length) : "";
  if (!file || !/^[A-Za-z0-9._-]+\.(jpe?g|png|webp|gif)$/i.test(file)) return "";
  return `/api/partners/logo/${encodeURIComponent(file)}`;
}
