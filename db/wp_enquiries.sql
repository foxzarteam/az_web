-- WhatsApp AI chatbot storage.
-- Does not alter leads, contact, partner, wallet, or any CRM table.
-- Run once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.app_settings IS 'Encrypted app settings. WhatsApp + Gemini credentials live under key whatsapp_integration.';

CREATE TABLE IF NOT EXISTS public.wp_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  chat jsonb NOT NULL DEFAULT '{"messages":[]}'::jsonb,
  last_chat_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT wp_enquiries_phone_unique UNIQUE (phone),
  CONSTRAINT wp_enquiries_phone_digits CHECK (phone ~ '^[0-9]{8,15}$')
);

COMMENT ON TABLE public.wp_enquiries IS 'One row per WhatsApp phone. chat JSON holds the full conversation.';

CREATE INDEX IF NOT EXISTS wp_enquiries_last_chat_at_idx
  ON public.wp_enquiries (last_chat_at DESC NULLS LAST);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wp_enquiries ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.app_settings TO postgres, service_role;
GRANT ALL ON TABLE public.wp_enquiries TO postgres, service_role;

-- Already created the table? Run this too. Same phone stays one row.
ALTER TABLE public.wp_enquiries DROP CONSTRAINT IF EXISTS wp_enquiries_phone_unique;

WITH normalized AS (
  SELECT
    id,
    CASE
      WHEN regexp_replace(phone, '\D', '', 'g') ~ '^[6-9][0-9]{9}$'
        THEN '91' || regexp_replace(phone, '\D', '', 'g')
      ELSE regexp_replace(phone, '\D', '', 'g')
    END AS canon,
    created_at
  FROM public.wp_enquiries
),
keeper AS (
  SELECT DISTINCT ON (canon) canon, id AS keep_id
  FROM normalized
  ORDER BY canon, created_at ASC, id ASC
),
folded AS (
  SELECT
    k.keep_id,
    k.canon,
    jsonb_build_object(
      'profileName', COALESCE((
        SELECT e.chat->>'profileName'
        FROM public.wp_enquiries e
        JOIN normalized n ON n.id = e.id
        WHERE n.canon = k.canon
          AND COALESCE(e.chat->>'profileName', '') <> ''
        ORDER BY e.created_at ASC
        LIMIT 1
      ), ''),
      'messages', COALESCE((
        SELECT jsonb_agg(m ORDER BY COALESCE(m->>'at', ''))
        FROM public.wp_enquiries e
        JOIN normalized n ON n.id = e.id AND n.canon = k.canon
        CROSS JOIN LATERAL jsonb_array_elements(COALESCE(e.chat->'messages', '[]'::jsonb)) AS m
      ), '[]'::jsonb)
    ) AS chat,
    (
      SELECT MAX(e.last_chat_at)
      FROM public.wp_enquiries e
      JOIN normalized n ON n.id = e.id AND n.canon = k.canon
    ) AS last_chat_at
  FROM keeper k
)
UPDATE public.wp_enquiries AS row
SET
  phone = folded.canon,
  chat = folded.chat,
  last_chat_at = folded.last_chat_at,
  updated_at = now()
FROM folded
WHERE row.id = folded.keep_id;

DELETE FROM public.wp_enquiries
WHERE id NOT IN (
  SELECT DISTINCT ON (
    CASE
      WHEN regexp_replace(phone, '\D', '', 'g') ~ '^[6-9][0-9]{9}$'
        THEN '91' || regexp_replace(phone, '\D', '', 'g')
      ELSE regexp_replace(phone, '\D', '', 'g')
    END
  ) id
  FROM public.wp_enquiries
  ORDER BY
    CASE
      WHEN regexp_replace(phone, '\D', '', 'g') ~ '^[6-9][0-9]{9}$'
        THEN '91' || regexp_replace(phone, '\D', '', 'g')
      ELSE regexp_replace(phone, '\D', '', 'g')
    END,
    created_at ASC,
    id ASC
);

ALTER TABLE public.wp_enquiries
  ADD CONSTRAINT wp_enquiries_phone_unique UNIQUE (phone);
