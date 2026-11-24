-- Personal loan min ₹50,000. Vehicle loan min ₹1,00,000.
-- Run in Supabase SQL editor. Existing max is kept (or set to ₹50L if missing).

update public.products
set
  limit_start = 50000,
  limit_end = greatest(coalesce(limit_end, 5000000), 50000),
  updated_at = now()
where slug = 'personal-loan';

update public.products
set
  limit_start = 100000,
  limit_end = greatest(coalesce(limit_end, 5000000), 100000),
  updated_at = now()
where slug in ('vehicle-loan', 'car-loan');
