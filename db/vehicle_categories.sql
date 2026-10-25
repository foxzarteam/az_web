-- Vehicle loan dropdown. Images live in az_web/public/images/vehicle.
-- Run this once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.vehicle_categories (
  slug text PRIMARY KEY,
  label text NOT NULL,
  image text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT vehicle_categories_slug_check CHECK (slug ~ '^[a-z][a-z0-9_]{0,63}$')
);

INSERT INTO public.vehicle_categories (slug, label, image, sort_order) VALUES
  ('new_car', 'New Car', 'car.webp', 1),
  ('used_car', 'Used Car', 'used_car.webp', 2),
  ('taxi', 'Taxi', 'taxi.webp', 3),
  ('tractor', 'Tractor', 'tractor.webp', 4),
  ('commercial_vehicle', 'Commercial Vehicle', 'commercial.webp', 5),
  ('construction_equipment', 'Construction Equipment', 'construction.webp', 6)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  image = EXCLUDED.image,
  sort_order = EXCLUDED.sort_order,
  is_active = true;
