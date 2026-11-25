-- Used car loan form: car details, RC, existing car loan.
-- Run once in the Supabase SQL editor.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS car_details character varying(120),
  ADD COLUMN IF NOT EXISTS vehicle_rc character varying(11),
  ADD COLUMN IF NOT EXISTS existing_car_loan boolean;

COMMENT ON COLUMN public.leads.car_details IS 'Used-car make/model from the used-car-loan form.';
COMMENT ON COLUMN public.leads.vehicle_rc IS 'Vehicle RC number (e.g. MH12AB1234).';
COMMENT ON COLUMN public.leads.existing_car_loan IS 'Whether the applicant already has a car loan.';
