import { PUBLIC_API_BASE_URL } from "@/app/config/constants";

export type ServiceSliderCard = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export type ServicesFetchStatus = "ok" | "error";

export type FetchActiveServicesResult = {
  cards: ServiceSliderCard[];
  status: ServicesFetchStatus;
};

type ApiServiceRow = {
  slug?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
};

/**
 * Loads home-page service cards from GET /api/services (active rows, sort_order).
 * Backend reads `public.services` via Supabase service role.
 */
export async function fetchActiveServiceCards(): Promise<FetchActiveServicesResult> {
  const endpoint = `${PUBLIC_API_BASE_URL}/api/services`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      mode: "cors",
      credentials: "omit",
    });

    const raw = await response.text();
    let parsed: { success?: boolean; data?: unknown } = {};
    if (raw) {
      try {
        parsed = JSON.parse(raw) as typeof parsed;
      } catch {
        console.warn("[services] API returned non-JSON response");
        return { cards: [], status: "error" };
      }
    }

    if (!response.ok || parsed.success === false) {
      console.warn("[services] API error:", response.status);
      return { cards: [], status: "error" };
    }

    const rows = parsed.data;
    if (!Array.isArray(rows)) {
      return { cards: [], status: "error" };
    }

    const cards: ServiceSliderCard[] = rows
      .filter((row: ApiServiceRow) => row.isActive === true)
      .map((row: ApiServiceRow) => {
        const slug = typeof row.slug === "string" ? row.slug.trim() : "";
        if (!slug) return null;
        return {
          title: typeof row.title === "string" ? row.title : "",
          description: typeof row.description === "string" ? row.description : "",
          image: typeof row.imageUrl === "string" ? row.imageUrl.trim() : "",
          href: `/services/${slug}`,
        };
      })
      .filter((c): c is ServiceSliderCard => c !== null);

    return { cards, status: "ok" };
  } catch (e) {
    console.warn("[services] fetch failed:", e);
    return { cards: [], status: "error" };
  }
}
