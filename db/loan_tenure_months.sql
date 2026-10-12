-- Drop loan tenure from leads. Run once in the Supabase SQL editor.
ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_loan_tenure_months_check;

ALTER TABLE public.leads
  DROP COLUMN IF EXISTS loan_tenure_months;
