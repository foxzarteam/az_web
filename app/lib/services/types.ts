/** Home slider, nav submenu, footer — same shape everywhere. */
export type ServiceSliderCard = {
  title: string;
  description: string;
  image: string;
  href: string;
  limitStart?: number | null;
  limitEnd?: number | null;
};

export type ServicesFetchStatus = "ok" | "error";

export type InsuranceTypeOption = {
  value: string;
  label: string;
  /** File name from `insurance_types.image`, or a full path/URL. */
  image?: string;
};

/** Active loan row used as a tab on /products/loans. */
export type LoanProductTab = {
  slug: string;
  title: string;
  limitStart: number | null;
  limitEnd: number | null;
};

export type FetchActiveServicesResult = {
  cards: ServiceSliderCard[];
  insuranceTypes: InsuranceTypeOption[];
  loanProducts: LoanProductTab[];
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
  limitStart?: number | null;
  limitEnd?: number | null;
  limit_start?: number | null;
  limit_end?: number | null;
};
