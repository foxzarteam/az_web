export type SubmenuItem = {
  label: string;
  href: string;
  /** From `/services/:slug` — optional styling (gradient / icon) */
  slug?: string;
};

export type HeaderItem = {
  label: string;
  href: string;
  submenu?: SubmenuItem[];
};
