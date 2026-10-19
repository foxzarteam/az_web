import type {
  ApiServiceRow,
  InsuranceTypeOption,
  LoanProductTab,
  ServiceSliderCard,
} from "@/app/lib/services/types";
import { isPublicProductSlug } from "@/app/lib/services/allowedProducts";
import { INSURANCE_TYPE_OPTIONS } from "@/app/lib/leads/leadForm";

function payloadRows(raw: unknown): ApiServiceRow[] {
  let rows: unknown[] = [];
  if (Array.isArray(raw)) {
    rows = raw;
  } else if (raw && typeof raw === "object" && "data" in raw) {
    const data = (raw as { data?: unknown }).data;
    if (Array.isArray(data)) rows = data;
  }
  return rows.filter((r): r is ApiServiceRow => r !== null && typeof r === "object");
}

/** personal-loan, home-loan, business-loan, car-loan. The /products/loans hub is not a product. */
export function isLoanProductSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*-loan$/.test(slug);
}

function rowSortKey(row: ApiServiceRow): number {
  const n = row.sort_order ?? row.sortOrder;
  return typeof n === "number" && !Number.isNaN(n) ? n : 0;
}

/** Explicit `false` excludes; missing fields count as active (API may already filter). */
function isRowActive(row: ApiServiceRow): boolean {
  return row.isActive !== false && row.is_active !== false;
}

function rupeeField(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  return null;
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
    limitStart: rupeeField(row.limitStart ?? row.limit_start),
    limitEnd: rupeeField(row.limitEnd ?? row.limit_end),
  };
}

/**
 * Parses your backend JSON: `{ success?: boolean, data?: ApiServiceRow[] }` or a raw array.
 * Keeps only active rows; sorts by `sort_order` when present.
 */
function loanSourceRows(raw: unknown): ApiServiceRow[] {
  if (raw && typeof raw === "object" && "loanProducts" in raw) {
    const list = (raw as { loanProducts?: unknown }).loanProducts;
    if (Array.isArray(list) && list.length > 0) {
      return list.filter((r): r is ApiServiceRow => r !== null && typeof r === "object");
    }
  }
  return payloadRows(raw).filter(isRowActive);
}

export function parseLoanProducts(raw: unknown): LoanProductTab[] {
  const rows = loanSourceRows(raw);
  const tabs: Array<LoanProductTab & { sortOrder: number }> = [];
  for (const row of rows) {
    const slug = typeof row.slug === "string" ? row.slug.trim() : "";
    if (!isLoanProductSlug(slug)) continue;
    const title = typeof row.title === "string" ? row.title.trim() : "";
    tabs.push({
      slug,
      title: title || slug,
      limitStart: rupeeField(row.limitStart ?? row.limit_start),
      limitEnd: rupeeField(row.limitEnd ?? row.limit_end),
      sortOrder: rowSortKey(row),
    });
  }
  tabs.sort((a, b) => {
    if (a.slug === "personal-loan") return -1;
    if (b.slug === "personal-loan") return 1;
    return a.sortOrder - b.sortOrder;
  });
  return tabs.map(({ slug, title, limitStart, limitEnd }) => ({
    slug,
    title,
    limitStart,
    limitEnd,
  }));
}

export function parseServicesApiPayload(raw: unknown): ServiceSliderCard[] {
  const filtered = payloadRows(raw).filter(isRowActive);

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
  return INSURANCE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label, image: o.image }));
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
    const rec = row as { value?: unknown; slug?: unknown; label?: unknown; image?: unknown };
    const stored = String(rec.value ?? rec.slug ?? "")
      .trim()
      .toLowerCase();
    const value =
      stored === "car_insurance"
        ? "vehicle_insurance"
        : stored === "third_party_pvt_car_insurance"
          ? "third_party_pvt_vehicle_insurance"
          : stored;
    const rawLabel = String(rec.label ?? "").trim();
    const label =
      value === "vehicle_insurance"
        ? "Vehicle Insurance"
        : value === "third_party_pvt_vehicle_insurance"
          ? "Third Party Pvt Vehicle Insurance"
          : rawLabel;
    const image = typeof rec.image === "string" ? rec.image.trim() : "";
    if (!INS_TYPE_SLUG_PATTERN.test(value) || !label || seen.has(value)) continue;
    seen.add(value);
    out.push({ value, label, image });
  }
  return out.length > 0 ? out : fallback;
}
