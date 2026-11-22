-- Run in Supabase SQL editor.
-- Adds policy (long text) and required_documents (checkbox list) on public.partner.

ALTER TABLE public.partner
  ADD COLUMN IF NOT EXISTS policy text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS required_documents text[] NOT NULL DEFAULT '{}'::text[];

COMMENT ON COLUMN public.partner.policy IS 'Aggregator policy / notes (long text).';
COMMENT ON COLUMN public.partner.required_documents IS
  'Selected required documents, e.g. {AADHAR CARD,PAN CARD}';

ALTER TABLE public.partner
  DROP CONSTRAINT IF EXISTS partner_required_documents_check;

ALTER TABLE public.partner
  ADD CONSTRAINT partner_required_documents_check CHECK (
    required_documents <@ ARRAY[
      'AADHAR CARD',
      'PAN CARD',
      'BANK STATEMENT',
      'SALARY SLIP(OPTIONAL)',
      'CURRENT ADDRESS',
      'OFFICE ADDRESS'
    ]::text[]
  );
