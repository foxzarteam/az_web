-- Partner prescreening. Run in Supabase SQL editor.
-- Existing partners stay approved so they are not locked out of the portal.

alter table public.users
  add column if not exists kyc_status text;

update public.users
set kyc_status = 'approved'
where kyc_status is null or btrim(kyc_status) = '';

alter table public.users
  alter column kyc_status set default 'pending';

alter table public.users
  alter column kyc_status set not null;

alter table public.users
  drop constraint if exists users_kyc_status_check;

alter table public.users
  add constraint users_kyc_status_check
  check (kyc_status in ('pending', 'submitted', 'approved', 'rejected'));

create table if not exists public.partner_kyc (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  aadhaar_number character varying(12) not null,
  pan character varying(10) not null,
  bank_name text not null default '',
  account_holder text not null default '',
  account_number text not null default '',
  ifsc character varying(11) not null default '',
  aadhaar_front_path text not null default '',
  aadhaar_back_path text not null default '',
  pan_card_path text not null default '',
  selfie_path text not null default '',
  submitted_at timestamp with time zone not null default now(),
  reviewed_at timestamp with time zone,
  constraint partner_kyc_pkey primary key (id),
  constraint partner_kyc_user_id_key unique (user_id),
  constraint partner_kyc_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade,
  constraint partner_kyc_aadhaar_check check ((aadhaar_number)::text ~ '^[0-9]{12}$'),
  constraint partner_kyc_pan_check check ((pan)::text ~ '^[A-Z]{5}[0-9]{4}[A-Z]$')
);

create index if not exists idx_partner_kyc_user_id on public.partner_kyc using btree (user_id);
create index if not exists idx_users_kyc_status on public.users using btree (kyc_status);

alter table public.partner_kyc enable row level security;
drop policy if exists "Allow all for partner_kyc" on public.partner_kyc;
create policy "Allow all for partner_kyc" on public.partner_kyc using (true) with check (true);
