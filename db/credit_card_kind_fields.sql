-- Credit card form: FD vs Normal, plus FD amount.
-- CIBIL for Normal uses existing leads.cibil_band.
-- Run once in the Supabase SQL editor.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS credit_card_kind character varying(16),
  ADD COLUMN IF NOT EXISTS fd_amount numeric;

COMMENT ON COLUMN public.leads.credit_card_kind IS 'Credit card form: fd or normal.';
COMMENT ON COLUMN public.leads.fd_amount IS 'Fixed-deposit amount when credit_card_kind is fd.';
