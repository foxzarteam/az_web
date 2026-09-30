-- Admin chooses commission when approving a lead.
-- percentage: 0 to 10, applied to the personal-loan amount.
-- fixed: rupees, not more than 50% of the personal-loan amount.
-- Older approved leads with no choice keep insurance ₹1000 / personal loan 2%.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS commission_type character varying(20);

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS commission_value numeric(12,2);

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_commission_type_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_commission_type_check
  CHECK (
    commission_type IS NULL
    OR commission_type = ANY (ARRAY['percentage'::varchar, 'fixed'::varchar])
  );

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_commission_value_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_commission_value_check
  CHECK (commission_value IS NULL OR commission_value >= 0);

CREATE OR REPLACE FUNCTION public.reconcile_partner_wallet(p_user_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid text := btrim(COALESCE(p_user_id, ''));
  v_agent uuid;
  v_earning numeric(15, 2) := 0;
  v_redeem numeric(15, 2) := 0;
  v_balance numeric(15, 2) := 0;
  v_now timestamptz := now();
  v_id uuid;
BEGIN
  IF v_uid = '' THEN
    RETURN jsonb_build_object('ok', true, 'skipped', true);
  END IF;

  BEGIN
    v_agent := v_uid::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    RETURN jsonb_build_object('ok', true, 'skipped', true);
  END;

  PERFORM pg_advisory_xact_lock(hashtext('wallet:' || v_uid));

  SELECT COALESCE(SUM(
    CASE
      WHEN lower(btrim(COALESCE(commission_type, ''))) = 'percentage'
           AND commission_value >= 0.1
           AND commission_value <= 10
           AND base_amount > 0
        THEN ROUND(base_amount * commission_value / 100.0, 2)
      WHEN lower(btrim(COALESCE(commission_type, ''))) = 'fixed'
           AND commission_value >= 100
           AND commission_value <= 30000
        THEN ROUND(commission_value, 2)
      WHEN replace(lower(btrim(COALESCE(category::text, ''))), '-', '_') = 'insurance'
        THEN 1000::numeric
      WHEN base_amount > 0
        THEN ROUND(base_amount * 0.02, 2)
      ELSE 0::numeric
    END
  ), 0)
  INTO v_earning
  FROM (
    SELECT
      category,
      commission_type,
      commission_value,
      CASE
        WHEN replace(lower(btrim(COALESCE(category::text, ''))), '-', '_') = 'insurance'
          THEN 0::numeric
        WHEN COALESCE(required_amount, 0) > 0
          THEN required_amount::numeric
        WHEN COALESCE(loan_amt, '') ~ '^[0-9]+_[0-9]+$'
          THEN (
            split_part(loan_amt, '_', 1)::numeric
            + split_part(loan_amt, '_', 2)::numeric
          ) / 2
        ELSE 0::numeric
      END AS base_amount
    FROM public.leads
    WHERE agent_id = v_agent
      AND lower(btrim(COALESCE(status, ''))) = 'approved'
      AND COALESCE(is_active, true) = true
  ) approved_leads;

  SELECT id, redeem
  INTO v_id, v_redeem
  FROM public.wallet
  WHERE user_id = v_uid
  LIMIT 1;

  v_redeem := COALESCE(v_redeem, 0);
  v_balance := GREATEST(0, v_earning - v_redeem);

  IF v_id IS NULL THEN
    INSERT INTO public.wallet (user_id, earning, redeem, balance, currency, created_at, updated_at)
    VALUES (v_uid, v_earning, 0, v_earning, 'INR', v_now, v_now);
    v_redeem := 0;
    v_balance := v_earning;
  ELSE
    UPDATE public.wallet
    SET earning = v_earning,
        balance = v_balance,
        updated_at = v_now
    WHERE id = v_id;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'earning', v_earning,
    'redeem', v_redeem,
    'balance', v_balance
  );
END;
$$;
