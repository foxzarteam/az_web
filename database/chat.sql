-- public.chat — Loan Helper chatbox answers (Q&A in one JSON column).
-- Flow: chat answers → mobile → OTP → personal loan form (mobile disabled) → leads table
-- Run in Supabase SQL editor (or any Postgres).

create table if not exists public.chat (
  id uuid not null default gen_random_uuid(),
  mobile_number text null,
  -- All chat Q&A in one column (jsonb). Example shape below in comment.
  answers jsonb not null default '{}'::jsonb,
  -- started | otp_sent | otp_verified | lead_submitted | abandoned
  status text not null default 'started',
  lead_id uuid null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint chat_pkey primary key (id),
  constraint chat_status_check check (
    status in ('started', 'otp_sent', 'otp_verified', 'lead_submitted', 'abandoned')
  ),
  constraint chat_mobile_number_check check (
    mobile_number is null or mobile_number ~ '^[6-9][0-9]{9}$'
  )
);

create index if not exists chat_mobile_number_idx on public.chat (mobile_number);
create index if not exists chat_status_idx on public.chat (status);
create index if not exists chat_created_at_idx on public.chat (created_at desc);
create index if not exists chat_answers_gin_idx on public.chat using gin (answers);

comment on table public.chat is 'Loan Helper chat sessions; Q&A stored in answers jsonb';
comment on column public.chat.answers is
  'JSON object of chat Q&A, e.g. {"employment":{"id":"salaried","label":"Salaried"},"salary":{"id":"40-70k","label":"₹40,000 – ₹70,000"},"existing_emi":{"id":"no","label":"Nahi, koi EMI nahi"},"loan_amount":{"id":"2-5","label":"₹2 – ₹5 lakh"}}';
comment on column public.chat.mobile_number is '10-digit Indian mobile; set when user enters number before OTP';
comment on column public.chat.lead_id is 'Set after OTP + personal loan form submit (link to leads.id)';
comment on column public.chat.status is 'started → otp_sent → otp_verified → lead_submitted';

-- Example insert (after chat answers + mobile collected):
-- insert into public.chat (mobile_number, answers, status)
-- values (
--   '9876543210',
--   '{
--     "employment": { "id": "salaried", "label": "Salaried" },
--     "salary": { "id": "40-70k", "label": "₹40,000 – ₹70,000" },
--     "existing_emi": { "id": "no", "label": "Nahi, koi EMI nahi" },
--     "loan_amount": { "id": "2-5", "label": "₹2 – ₹5 lakh" }
--   }'::jsonb,
--   'otp_sent'
-- );
