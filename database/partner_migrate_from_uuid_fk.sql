-- Agar pehle wali partner table (service_id uuid + FK) bana chuke ho, pehle ye chalao:

alter table if exists public.partner drop constraint if exists partner_service_id_fkey;

alter table if exists public.partner
  alter column service_id type text using service_id::text;

alter table if exists public.partner
  add column if not exists payout_type text,
  add column if not exists commission_value numeric(12, 2);

update public.partner
set
  payout_type = coalesce(payout_type, 'PERCENTAGE'),
  commission_value = coalesce(commission_value, 0)
where payout_type is null or commission_value is null;

alter table if exists public.partner
  alter column payout_type set not null,
  alter column commission_value set not null;

alter table if exists public.partner drop constraint if exists partner_payout_type_check;
alter table if exists public.partner
  add constraint partner_payout_type_check
  check (payout_type in ('PERCENTAGE', 'FLAT'));
