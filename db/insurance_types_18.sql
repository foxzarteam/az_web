-- Run once in Supabase SQL editor.
-- Adds image (file name only), clears insurance_types, inserts the 18 cards.
-- Leads that used a removed type (for example motor_insurance) get ins_type = NULL
-- so the foreign key can be recreated.

BEGIN;

ALTER TABLE public.insurance_types
  ADD COLUMN IF NOT EXISTS image character varying(160) NOT NULL DEFAULT '';

UPDATE public.leads
SET ins_type = NULL
WHERE ins_type IS NOT NULL
  AND ins_type NOT IN (
    'health_insurance',
    'health_renewal',
    'bike_insurance',
    'car_insurance',
    'pcv_insurance',
    'gcv_insurance',
    'travel_insurance',
    'life_insurance',
    'personal_accident_insurance',
    'miscd_insurance',
    'third_party_bike_insurance',
    'third_party_pvt_car_insurance',
    'third_party_pcv_insurance',
    'third_party_gcv_insurance',
    'third_party_miscd_insurance',
    'marine_insurance',
    'pet_insurance',
    'cyber_insurance'
  );

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_ins_type_fkey;

DELETE FROM public.insurance_types;

INSERT INTO public.insurance_types (slug, label, image, sort_order, is_active) VALUES
  ('health_insurance', 'Health Insurance', 'health.svg', 1, TRUE),
  ('health_renewal', 'Health Renewal', 'health_renewal.svg', 2, TRUE),
  ('bike_insurance', 'Bike Insurance', 'bike.svg', 3, TRUE),
  ('car_insurance', 'Car Insurance', 'car.svg', 4, TRUE),
  ('pcv_insurance', 'PCV Insurance', 'pcv.svg', 5, TRUE),
  ('gcv_insurance', 'GCV Insurance', 'gcv.svg', 6, TRUE),
  ('travel_insurance', 'Travel Insurance', 'travel.svg', 7, TRUE),
  ('life_insurance', 'Life Insurance', 'life.svg', 8, TRUE),
  ('personal_accident_insurance', 'Personal Accident Insurance', 'pa.svg', 9, TRUE),
  ('miscd_insurance', 'MISC-D Insurance', 'miscd.svg', 10, TRUE),
  ('third_party_bike_insurance', 'Third Party Bike Insurance', 'third-party-bike-insurance.svg', 11, TRUE),
  ('third_party_pvt_car_insurance', 'Third Party Pvt Car Insurance', 'third-party-pvt-car-insurance.svg', 12, TRUE),
  ('third_party_pcv_insurance', 'Third Party PCV Insurance', 'third-party-pcv-insurance.svg', 13, TRUE),
  ('third_party_gcv_insurance', 'Third Party GCV Insurance', 'third-party-gcv-insurance.svg', 14, TRUE),
  ('third_party_miscd_insurance', 'Third Party MISC-D Insurance', 'third-party-miscd-insurance.svg', 15, TRUE),
  ('marine_insurance', 'Marine Insurance', 'home_marine_icon.svg', 16, TRUE),
  ('pet_insurance', 'Pet Insurance', 'pet-insurance.svg', 17, TRUE),
  ('cyber_insurance', 'Cyber Insurance', 'cyber-insurance.svg', 18, TRUE);

ALTER TABLE public.leads
  ADD CONSTRAINT leads_ins_type_fkey
  FOREIGN KEY (ins_type) REFERENCES public.insurance_types (slug);

COMMIT;
