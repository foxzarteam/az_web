-- Run in Supabase SQL editor.
-- Removes aggregator payout/commission from public.partner.

ALTER TABLE public.partner
  DROP CONSTRAINT IF EXISTS partner_payout_type_check;

ALTER TABLE public.partner
  DROP COLUMN IF EXISTS payout_type,
  DROP COLUMN IF EXISTS commission_value;
