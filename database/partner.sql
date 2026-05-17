-- public.partner — service_id = services.sort_order list (text), e.g. '2,5'
-- payout_type: PERCENTAGE | FLAT

create table if not exists public.partner (
  id uuid not null default gen_random_uuid(),
  name text not null,
  service_id text not null,
  payout_type text not null,
  commission_value numeric(12, 2) not null,
  created_at timestamp with time zone not null default now(),
  constraint partner_pkey primary key (id),
  constraint partner_payout_type_check
    check (payout_type in ('PERCENTAGE', 'FLAT'))
);

create index if not exists partner_name_idx on public.partner (name);
create index if not exists partner_created_at_idx on public.partner (created_at desc);

comment on column public.partner.service_id is 'Comma-separated services.sort_order values, e.g. 2,5';
comment on column public.partner.payout_type is 'PERCENTAGE (e.g. 2%) or FLAT (e.g. 1500 Rs)';
comment on column public.partner.commission_value is 'Rate or fixed amount per payout_type';
