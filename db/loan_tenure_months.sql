-- Personal loan apply form: tenure in months (12–72).
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS loan_tenure_months integer;

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_loan_tenure_months_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_loan_tenure_months_check
  CHECK (loan_tenure_months IS NULL OR (loan_tenure_months >= 12 AND loan_tenure_months <= 72));
