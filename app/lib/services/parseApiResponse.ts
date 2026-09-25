import type { ApiServiceRow, InsuranceTypeOption, ServiceSliderCard } from "@/app/lib/services/types";
import { isPublicProductSlug } from "@/app/lib/services/allowedProducts";
import { INSURANCE_TYPE_OPTIONS } from "@/app/utils/leadForm";

function rowSortKey(row: ApiServiceRow): number {
  const n = row.sort_order ?? row.sortOrder;
  return typeof n === "number" && !Number.isNaN(n) ? n : 0;
}

/** Explicit `false` excludes; missing fields count as active (API may already filter). */
function isRowActive(row: ApiServiceRow): boolean {
  return row.isActive !== false && row.is_active !== false;
}

function rowToCard(row: ApiServiceRow): ServiceSliderCard | null {
  const slug = typeof row.slug === "string" ? row.slug.trim() : "";
  if (!slug || !isPublicProductSlug(slug)) return null;
  const imageRaw = row.imageUrl ?? row.image_url;
  const image =
    typeof imageRaw === "string"
      ? imageRaw.trim().replace(
          /\/images\/service\/(personal|insurance)\.png$/i,
          "/images/service/$1.webp",
        )
      : "";
  return {
    title: typeof row.title === "string" ? row.title : "",
    description: typeof row.description === "string" ? row.description : "",
    image,
    href: `/products/${slug}`,
  };
}

/**
 * Parses your backend JSON: `{ success?: boolean, data?: ApiServiceRow[] }` or a raw array.
 * Keeps only active rows; sorts by `sort_order` when present.
 */
export function parseServicesApiPayload(raw: unknown): ServiceSliderCard[] {
  let rows: unknown[] = [];
  if (Array.isArray(raw)) {
    rows = raw;
  } else if (raw && typeof raw === "object" && "data" in raw) {
    const data = (raw as { data?: unknown }).data;
    if (Array.isArray(data)) rows = data;
  }

  const filtered = rows
    .filter((r): r is ApiServiceRow => r !== null && typeof r === "object")
    .filter(isRowActive);

  filtered.sort((a, b) => rowSortKey(a) - rowSortKey(b));

  const cards: ServiceSliderCard[] = [];
  for (const row of filtered) {
    const card = rowToCard(row);
    if (card) cards.push(card);
  }
  return cards;
}

const INS_TYPE_SLUG_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;

export function fallbackInsuranceTypes(): InsuranceTypeOption[] {
  return INSURANCE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
}

export function parseInsuranceTypesPayload(raw: unknown): InsuranceTypeOption[] {
  const fallback = fallbackInsuranceTypes();
  if (!raw || typeof raw !== "object") return fallback;
  const list = (raw as { insuranceTypes?: unknown }).insuranceTypes;
  if (!Array.isArray(list) || list.length === 0) return fallback;

  const out: InsuranceTypeOption[] = [];
  const seen = new Set<string>();
  for (const row of list) {
    if (!row || typeof row !== "object") continue;
    const rec = row as { value?: unknown; slug?: unknown; label?: unknown };
    const value = String(rec.value ?? rec.slug ?? "")
      .trim()
      .toLowerCase();
    const label = String(rec.label ?? "").trim();
    if (!INS_TYPE_SLUG_PATTERN.test(value) || !label || seen.has(value)) continue;
    seen.add(value);
    out.push({ value, label });
  }
  return out.length > 0 ? out : fallback;
}
