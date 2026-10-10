-- Run once in the Supabase SQL editor.
-- Renames public.services to public.products and adds the admin amount range.
-- limit is a reserved SQL word, so the two columns are limit_start and limit_end.

ALTER TABLE public.services RENAME TO products;

ALTER TABLE public.products RENAME CONSTRAINT services_pkey TO products_pkey;
ALTER TABLE public.products RENAME CONSTRAINT services_slug_key TO products_slug_key;

ALTER INDEX IF EXISTS services_active_sort_idx RENAME TO products_active_sort_idx;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS limit_start integer,
  ADD COLUMN IF NOT EXISTS limit_end integer;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_limit_range_chk;

ALTER TABLE public.products
  ADD CONSTRAINT products_limit_range_chk CHECK (
    (limit_start IS NULL AND limit_end IS NULL)
    OR (
      limit_start IS NOT NULL
      AND limit_end IS NOT NULL
      AND limit_start >= 0
      AND limit_end >= limit_start
    )
  );

UPDATE public.products
SET limit_start = 25000, limit_end = 5000000, updated_at = now()
WHERE slug = 'personal-loan' AND limit_start IS NULL AND limit_end IS NULL;

COMMENT ON COLUMN public.partner.service_id IS 'Comma-separated products.sort_order, e.g. 2,5';
