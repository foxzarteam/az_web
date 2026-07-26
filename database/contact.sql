-- public.contact — Contact Us form submissions
-- Run in Supabase SQL editor (or any Postgres).

create table if not exists public.contact (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint contact_pkey primary key (id),
  constraint contact_status_check check (
    status in ('new', 'read', 'replied', 'archived')
  ),
  constraint contact_phone_check check (phone ~ '^[6-9][0-9]{9}$'),
  constraint contact_email_check check (position('@' in email) > 1)
);

create index if not exists contact_created_at_idx on public.contact (created_at desc);
create index if not exists contact_status_idx on public.contact (status);
create index if not exists contact_email_idx on public.contact (email);

comment on table public.contact is 'Messages from the website Contact Us form';
comment on column public.contact.status is 'new | read | replied | archived';
