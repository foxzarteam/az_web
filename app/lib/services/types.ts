/** Home slider, nav submenu, footer — same shape everywhere. */
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

/** Loose row from GET /api/services (camelCase or snake_case). */
export type ApiServiceRow = {
  slug?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  image_url?: string;
  isActive?: boolean;
  is_active?: boolean;
  sortOrder?: number;
  sort_order?: number;
};
