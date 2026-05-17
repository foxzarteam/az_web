-- Drop + create + seed (single copy-paste)

drop table if exists public.partner cascade;

create table public.partner (
  id uuid not null default gen_random_uuid(),
  name text not null,
  service_id text not null,
  payout_type text not null,
  commission_value numeric(12, 2) not null,
  created_at timestamp with time zone not null default now(),
  constraint partner_pkey primary key (id),
  constraint partner_payout_type_check check (payout_type in ('PERCENTAGE', 'FLAT'))
);

create index partner_name_idx on public.partner (name);
create index partner_created_at_idx on public.partner (created_at desc);

insert into public.partner (name, service_id, payout_type, commission_value)
values ('Urban Money', '2,5', 'PERCENTAGE', 2.5);
