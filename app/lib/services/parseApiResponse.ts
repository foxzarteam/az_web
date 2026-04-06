import type { ApiServiceRow, ServiceSliderCard } from "@/app/lib/services/types";

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
  if (!slug) return null;
  const imageRaw = row.imageUrl ?? row.image_url;
  return {
    title: typeof row.title === "string" ? row.title : "",
    description: typeof row.description === "string" ? row.description : "",
    image: typeof imageRaw === "string" ? imageRaw.trim() : "",
    href: `/services/${slug}`,
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
