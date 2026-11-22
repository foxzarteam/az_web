-- Run in Supabase SQL editor.
-- UTM link + logo path for aggregator cards.

ALTER TABLE public.partner
  ADD COLUMN IF NOT EXISTS utm_link text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS image_path text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.partner.utm_link IS 'Apply / share URL shown on All Products cards.';
COMMENT ON COLUMN public.partner.image_path IS 'Public path, e.g. /images/aggregators/<file>.jpg';
