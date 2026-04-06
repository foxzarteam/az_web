-- public.services — source of truth for GET /api/services on your backend.
-- Run in Supabase SQL editor (or any Postgres). Index speeds listing by is_active + sort.

create table if not exists public.services (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  title text not null,
  description text not null,
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint services_pkey primary key (id),
  constraint services_slug_key unique (slug)
);

create index if not exists services_active_sort_idx
  on public.services (is_active, sort_order);

-- Optional RLS: anon can only read active rows
-- alter table public.services enable row level security;
-- create policy "anon_read_active_services"
--   on public.services for select to anon
--   using (is_active = true);
