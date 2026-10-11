-- Run once on the live database.
-- Removes the "4 PANs per mobile" database block and the PAN+product unique index.
-- Apply rules are now: one mobile number, one application per product.
-- Approved can apply again. Rejected cannot. In progress shows the current status.

CREATE OR REPLACE FUNCTION public.claim_mobile_pan_slot(p_mobile text, p_pan_hash text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN jsonb_build_object('ok', true, 'skipped', true);
END;
$$;

DROP INDEX IF EXISTS public.leads_pan_hash_product_open_uidx;
