-- Apni Zaroorat — live public schema (keep this file in sync with Supabase).
-- Tables: auth, banners, chat, contact, lead_mobile_pan_slots, leads,
--   otp_sessions, pan_access_audit, partner, payment_accounts, services, users, wallet
-- Dropped (unused): lead_status_audit, financial_products, user_sessions
-- Wallet: insurance ₹1000; personal loan 2% of required_amount, else loan_amt midpoint.
--
-- New project: paste this whole file in SQL Editor and Run.
-- Local: psql "$DATABASE_URL" -f az_web/db/supabase_backup.sql

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET search_path = public;

DROP TABLE IF EXISTS public.lead_status_audit CASCADE;
DROP TABLE IF EXISTS public.financial_products CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP FUNCTION IF EXISTS public.clean_expired_otps();
DROP FUNCTION IF EXISTS public.set_updated_at();

CREATE OR REPLACE FUNCTION public.claim_mobile_pan_slot(p_mobile text, p_pan_hash text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_mobile text := btrim(COALESCE(p_mobile, ''));
  v_hash text := btrim(COALESCE(p_pan_hash, ''));
  v_existing smallint;
  v_used integer;
  v_slot smallint;
BEGIN
  IF v_mobile = '' OR v_hash = '' THEN
    RETURN jsonb_build_object('ok', true, 'skipped', true);
  END IF;

  -- Serialize claims for this mobile so two new PANs cannot both take slot 4.
  PERFORM pg_advisory_xact_lock(hashtext('lead_mobile_pan:' || v_mobile));

  SELECT slot INTO v_existing
  FROM public.lead_mobile_pan_slots
  WHERE mobile_number = v_mobile
    AND pan_hash = v_hash;

  IF FOUND THEN
    RETURN jsonb_build_object('ok', true, 'reused', true, 'slot', v_existing);
  END IF;

  SELECT COUNT(*)::integer INTO v_used
  FROM public.lead_mobile_pan_slots
  WHERE mobile_number = v_mobile;

  IF v_used >= 4 THEN
    RAISE EXCEPTION 'MOBILE_PAN_LIMIT_REACHED'
      USING ERRCODE = 'P0001';
  END IF;

  SELECT s.slot
  INTO v_slot
  FROM generate_series(1, 4) AS s(slot)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.lead_mobile_pan_slots x
    WHERE x.mobile_number = v_mobile
      AND x.slot = s.slot
  )
  ORDER BY s.slot
  LIMIT 1;

  IF v_slot IS NULL THEN
    RAISE EXCEPTION 'MOBILE_PAN_LIMIT_REACHED'
      USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.lead_mobile_pan_slots (mobile_number, pan_hash, slot)
  VALUES (v_mobile, v_hash, v_slot);

  RETURN jsonb_build_object('ok', true, 'reused', false, 'slot', v_slot);
END;
$$;

COMMENT ON FUNCTION public.claim_mobile_pan_slot(p_mobile text, p_pan_hash text) IS 'Idempotent: links pan_hash to mobile in the next free slot 1-4, or reuses an existing row.';

CREATE OR REPLACE FUNCTION public.create_wallet_on_user_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.wallet (user_id, earning, redeem, balance, currency)
  VALUES (NEW.id::text, 0, 0, 0, 'INR')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_wallet_on_user_delete() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  DELETE FROM public.wallet
  WHERE user_id = OLD.id::text;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_wallet() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.wallet (user_id, earning, redeem, balance, currency)
  VALUES (NEW.id::text, 0, 0, 0, 'INR')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.leads_claim_mobile_pan_slot() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.is_active IS TRUE
     AND NEW.pan_hash IS NOT NULL
     AND btrim(NEW.pan_hash) <> '' THEN
    PERFORM public.claim_mobile_pan_slot(NEW.mobile_number, NEW.pan_hash);
  END IF;
  RETURN NEW;
END;
$$;

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

  -- One writer per partner: concurrent approvals cannot overwrite a stale sum.
  PERFORM pg_advisory_xact_lock(hashtext('wallet:' || v_uid));

  SELECT COALESCE(SUM(
    CASE
      WHEN replace(lower(btrim(COALESCE(category::text, ''))), '-', '_') = 'insurance'
        THEN 1000::numeric
      WHEN COALESCE(required_amount, 0) > 0
        THEN ROUND((required_amount::numeric * 0.02), 2)
      WHEN COALESCE(loan_amt, '') ~ '^[0-9]+_[0-9]+$'
        THEN ROUND(
          (
            (
              split_part(loan_amt, '_', 1)::numeric
              + split_part(loan_amt, '_', 2)::numeric
            ) / 2
          ) * 0.02
        , 2)
      ELSE 0::numeric
    END
  ), 0)
  INTO v_earning
  FROM public.leads
  WHERE agent_id = v_agent
    AND lower(btrim(COALESCE(status, ''))) = 'approved'
    AND COALESCE(is_active, true) = true;

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

COMMENT ON FUNCTION public.reconcile_partner_wallet(p_user_id text) IS 'Lock partner wallet, recompute earning from approved leads, write earning/balance.';

CREATE OR REPLACE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_wallet_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE public.auth (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT auth_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'staff'::text])))
);

CREATE TABLE public.banners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    title character varying(255),
    description text,
    category character varying(50) DEFAULT 'carousel'::character varying,
    display_order integer DEFAULT 0,
    action_url text,
    action_type character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT valid_action_type CHECK (((action_type IS NULL) OR ((action_type)::text = ANY ((ARRAY['url'::character varying, 'screen'::character varying, 'none'::character varying])::text[])))),
    CONSTRAINT valid_display_order CHECK ((display_order >= 0))
);

CREATE TABLE public.chat (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mobile_number text,
    answers jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'started'::text NOT NULL,
    lead_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_mobile_number_check CHECK (((mobile_number IS NULL) OR (mobile_number ~ '^[6-9][0-9]{9}$'::text))),
    CONSTRAINT chat_status_check CHECK ((status = ANY (ARRAY['started'::text, 'otp_sent'::text, 'otp_verified'::text, 'lead_submitted'::text, 'abandoned'::text])))
);

CREATE TABLE public.contact (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text,
    phone text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT contact_email_check CHECK (((email IS NULL) OR (POSITION(('@'::text) IN (email)) > 1))),
    CONSTRAINT contact_phone_check CHECK ((phone ~ '^[6-9][0-9]{9}$'::text)),
    CONSTRAINT contact_status_check CHECK ((status = ANY (ARRAY['new'::text, 'read'::text, 'replied'::text, 'archived'::text])))
);

CREATE TABLE public.lead_mobile_pan_slots (
    mobile_number text NOT NULL,
    pan_hash text NOT NULL,
    slot smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lead_mobile_pan_slots_slot_range CHECK (((slot >= 1) AND (slot <= 4)))
);

COMMENT ON TABLE public.lead_mobile_pan_slots IS 'At most 4 unique PAN fingerprints per mobile. Reusing the same mobile+PAN does not take another slot.';

CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    pan character varying(10) NOT NULL,
    mobile_number character varying(10) NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255),
    pincode character varying(6),
    required_amount numeric(12,2),
    category character varying(50) DEFAULT 'personal_loan'::character varying NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    loan_amt character varying(50),
    ins_type character varying(50),
    pan_encrypted text,
    pan_hash text,
    employment_type character varying(30),
    net_monthly_income numeric(12,0),
    ip_location character varying(255),
    ip character varying(45),
    agent_id uuid,
    CONSTRAINT leads_category_check CHECK (((category)::text = ANY (ARRAY['personal_loan'::text, 'home_loan'::text, 'business_loan'::text, 'credit_card'::text, 'insurance'::text, 'vehicle_loan'::text]))),
    CONSTRAINT leads_employment_type_check CHECK (((employment_type IS NULL) OR ((employment_type)::text = ANY ((ARRAY['salaried'::character varying, 'self_employed'::character varying])::text[])))),
    CONSTRAINT leads_ins_type_check CHECK (((ins_type IS NULL) OR ((ins_type)::text = ANY ((ARRAY['life_insurance'::character varying, 'health_insurance'::character varying, 'motor_insurance'::character varying])::text[])))),
    CONSTRAINT leads_loan_amt_check CHECK (((loan_amt IS NULL) OR ((loan_amt)::text = ANY ((ARRAY['25000_100000'::character varying, '100000_200000'::character varying, '200000_300000'::character varying, '300000_400000'::character varying, '400000_500000'::character varying, '500000_600000'::character varying, '600000_700000'::character varying, '700000_800000'::character varying, '800000_900000'::character varying, '900000_1000000'::character varying])::text[])))),
    CONSTRAINT leads_net_monthly_income_check CHECK (((net_monthly_income IS NULL) OR (net_monthly_income >= (0)::numeric))),
    CONSTRAINT leads_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_process'::character varying, 'approved'::character varying, 'rejected'::character varying, 'action_required'::character varying])::text[])))
);

COMMENT ON COLUMN public.leads.pan IS 'Masked PAN for display only (e.g. ABCDE****F). Never store plaintext.';

COMMENT ON COLUMN public.leads.pan_encrypted IS 'AES-256-GCM ciphertext (v1:iv:tag:ct).';

COMMENT ON COLUMN public.leads.pan_hash IS 'HMAC-SHA256 for duplicate detection / lookup. Not reversible.';

COMMENT ON COLUMN public.leads.ip_location IS 'Best-effort city/region/country resolved from client IP when the lead was saved.';

CREATE TABLE public.otp_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mobile_number character varying(10) NOT NULL,
    is_verified boolean DEFAULT false,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.pan_access_audit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid NOT NULL,
    action text NOT NULL,
    admin_id text,
    admin_email text,
    admin_role text,
    partner_id text,
    partner_name text,
    ip_address text,
    user_agent text,
    reason text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT pan_access_audit_action_check CHECK ((action = ANY (ARRAY['reveal'::text, 'partner_send'::text, 'create'::text, 'update'::text, 'decrypt_failed'::text])))
);

COMMENT ON TABLE public.pan_access_audit IS 'Immutable audit of PAN reveal and partner-send events.';

CREATE TABLE public.partner (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    service_id text NOT NULL,
    payout_type text NOT NULL,
    commission_value numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT partner_payout_type_check CHECK ((payout_type = ANY (ARRAY['PERCENTAGE'::text, 'FLAT'::text])))
);

COMMENT ON COLUMN public.partner.service_id IS 'Comma-separated services.sort_order, e.g. 2,5';

COMMENT ON COLUMN public.partner.payout_type IS 'PERCENTAGE or FLAT';

COMMENT ON COLUMN public.partner.commission_value IS 'e.g. 2.5 (%) or 1500 (Rs)';

CREATE TABLE public.payment_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    payment_type character varying(10) NOT NULL,
    upi_id character varying(255),
    bank_name character varying(255),
    ifsc_code character varying(20),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payment_accounts_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['upi'::character varying, 'bank'::character varying])::text[])))
);

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mobile_number character varying(10) NOT NULL,
    user_name character varying(255) DEFAULT 'User'::character varying NOT NULL,
    email character varying(255),
    mpin character varying(72),
    is_active boolean DEFAULT true,
    is_logged_in boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_login_at timestamp with time zone,
    referral_code character varying(12),
    CONSTRAINT check_mobile_format CHECK (((mobile_number)::text ~ '^[6-9][0-9]{9}$'::text))
);

CREATE TABLE public.wallet (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    earning numeric(15,2) DEFAULT 0 NOT NULL,
    redeem numeric(15,2) DEFAULT 0 NOT NULL,
    balance numeric(15,2) DEFAULT 0 NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT wallet_balance_check CHECK ((balance >= (0)::numeric)),
    CONSTRAINT wallet_earning_check CHECK ((earning >= (0)::numeric)),
    CONSTRAINT wallet_redeem_check CHECK ((redeem >= (0)::numeric))
);

COMMENT ON TABLE public.wallet IS 'User wallet: earning, redeem, balance in INR';

INSERT INTO public.auth (id, full_name, email, password, role, created_at) VALUES
  ('21259064-cb21-4aa2-b76c-aa70bda800d3', 'Site Admin', 'info@apnizaroorat.com', '$2b$10$Q5u2OtodPLtViOkCx2MgbOozGzdJS7x9K78kdn6Vql.8wTD6inSte', 'admin', '2026-05-11 16:53:41.121016+00');

INSERT INTO public.banners (id, image_url, title, description, category, display_order, action_url, action_type, is_active, created_at, updated_at) VALUES
  ('62e226ce-232f-4216-918a-d72b4eb54682', 'images/banner.jpg', '100% Digital Process', 'No paperwork required, instant approval', 'carousel', '2', NULL, 'none', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-20 05:51:07.33533+00'),
  ('327dbad2-3fbc-41a5-9ca5-4895130e8319', 'images/banner.jpg', 'Personal Loan Offer', 'Get instant personal loan up to ₹5 Lakh', 'carousel', '1', NULL, 'none', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-20 05:51:08.960856+00'),
  ('bd5b93ce-8895-4fd2-8001-00f97efa625a', 'images/banner.jpg', 'Quick Approval', 'Get approved in minutes', 'carousel', '3', NULL, 'none', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-20 05:51:11.154597+00'),
  ('bfb1245f-99a6-4c10-8c92-36631a974ca5', 'images/banner.jpg', 'Low Interest Rates', 'Competitive rates starting from 10.5%', 'carousel', '4', NULL, 'none', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-20 05:51:13.194194+00'),
  ('720085ef-b984-4e63-a0ff-04b21786a70d', 'images/banner.jpg', 'Referral Bonus', 'Earn ₹1000 per successful referral', 'promo', '2', NULL, 'url', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-19 19:35:31.74625+00'),
  ('883de783-d7f7-4e28-b154-f023db2978fb', 'images/banner.jpg', 'Festival Special', 'Special rates during festival season', 'offer', '1', NULL, 'url', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-19 19:35:34.891915+00'),
  ('9d2a2ae9-384c-4fed-9399-8bfb58e20145', 'images/banner.jpg', 'Complete Your KYC', 'Verify your profile to unlock all features', 'kyc', '1', NULL, 'screen', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-19 19:35:37.144794+00'),
  ('ad755e1b-2c07-4e69-926f-8126057d1e12', 'images/banner.jpg', 'Special Offer', 'Limited time offer - Apply now!', 'promo', '1', NULL, 'url', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-19 19:35:39.583923+00'),
  ('eb9d673c-1f95-4dc7-b2c8-92a4f09c01e9', 'images/banner.jpg', 'New Year Offer', 'Start the year with great rates', 'offer', '2', NULL, 'url', TRUE, '2026-02-14 05:35:59.889026+00', '2026-02-19 19:35:49.340573+00');

INSERT INTO public.lead_mobile_pan_slots (mobile_number, pan_hash, slot, created_at) VALUES
  ('7903659217', 'd46e958c52df15cd375bd0d40bcc3f671c08eca7fd02953fda17b6fc9c49ff7e', '1', '2026-09-19 10:39:46.998563+00'),
  ('9251283215', '6cfc295ff76cc61306135f3cdd00942bea8602f5839e087115a94158bd9ec3cf', '1', '2026-09-19 10:39:46.998563+00'),
  ('9251283215', 'a1646daa5823b72ce78f9c909ea93cf6732002125c33913e2c363212bd6c26af', '2', '2026-09-19 10:39:46.998563+00');

INSERT INTO public.leads (id, user_id, pan, mobile_number, full_name, email, pincode, required_amount, category, status, notes, is_active, created_at, updated_at, loan_amt, ins_type, pan_encrypted, pan_hash, employment_type, net_monthly_income, ip_location, ip, agent_id) VALUES
  ('a42b6b46-498a-40d5-b212-e71218cfd3bf', NULL, 'CUBPK****D', '7903659217', 'Ashish Kumar', NULL, '821115', '500000.00', 'personal_loan', 'pending', NULL, TRUE, '2026-09-13 07:09:09.615232+00', '2026-09-13 07:09:10.322762+00', NULL, NULL, 'v1:v6dJUeWLsELzBqqZ:wET4GlbxulqnBWPPGGD1ig:r8s5x6cMMdV8VQ', 'd46e958c52df15cd375bd0d40bcc3f671c08eca7fd02953fda17b6fc9c49ff7e', 'salaried', '50000', 'Kanpur, Uttar Pradesh, India', '152.59.179.236', NULL),
  ('754b3522-cc36-4786-a14d-5a8c4d7d6707', NULL, 'GGUPP****G', '9251283215', 'dog', NULL, '302016', '500000.00', 'personal_loan', 'pending', NULL, TRUE, '2026-09-15 08:37:35.899118+00', '2026-09-15 08:37:36.629623+00', NULL, NULL, 'v1:uPHkZ1Ux8X6bY2Ik:0j041GmVTzmQPUN1MZxznQ:WdEjw_DTmr1Odw', '6cfc295ff76cc61306135f3cdd00942bea8602f5839e087115a94158bd9ec3cf', 'salaried', '50000', 'Jaipur, Rajasthan, India', '157.33.18.84', 'ff7488d0-0ba7-459e-ad56-23594b0718b1'),
  ('de0a8a19-b73f-4b16-a38b-d77dcc297f4c', NULL, 'GGUPP****G', '9251283215', 'Grande', NULL, '302016', NULL, 'insurance', 'pending', NULL, TRUE, '2026-09-15 08:41:17.327991+00', '2026-09-15 08:41:17.574756+00', NULL, 'life_insurance', 'v1:zxEIR4SHfuZ2vIM_:9ia2RaScuayTsE9wjuZ67A:JGgYYSWLEp9tGQ', 'a1646daa5823b72ce78f9c909ea93cf6732002125c33913e2c363212bd6c26af', NULL, NULL, 'Jaipur, Rajasthan, India', '157.33.18.84', NULL);

INSERT INTO public.otp_sessions (id, mobile_number, is_verified, verified_at, created_at) VALUES
  ('a18a5db2-9a5c-4944-92c3-bf7cdbfc6d4b', '9251283215', TRUE, '2026-09-15 08:41:14.086+00', '2026-09-15 08:40:36.194195+00'),
  ('af135f5f-4042-44f1-b660-88cdc6973a7f', '9251283215', TRUE, '2026-09-15 08:41:19.007+00', '2026-09-15 08:41:19.376664+00');

INSERT INTO public.pan_access_audit (id, lead_id, action, admin_id, admin_email, admin_role, partner_id, partner_name, ip_address, user_agent, reason, metadata, created_at) VALUES
  ('3a9c2e58-1ae3-4c1c-8e45-08e08248515f', 'ea36f747-81b4-4926-9ef7-2402c22d18b5', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-04 13:25:52.507+00'),
  ('187df699-addd-434a-a873-fb917b7e29d5', '86621510-6353-4a19-8fdd-6c7ee5900fbe', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-05 10:45:04.46+00'),
  ('b6c0ee3e-ada2-43f7-952b-0757edbaf8cf', 'd62e5ef9-55cb-41b2-a224-a59fd2a6f5ee', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-05 11:12:58.966+00'),
  ('7a1545e9-eb53-4b96-b603-33003f59d254', '98d549e4-36af-479c-bc70-9b97b1986bf0', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-05 11:38:26.174+00'),
  ('44933140-e08a-4b98-b109-c0f9dbd47350', '39979ec3-8846-4f87-afbd-fe7c765aee9a', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-06 13:24:57.886+00'),
  ('0c225c37-42f3-44f2-b85c-fe8702e6ec5a', 'a42b6b46-498a-40d5-b212-e71218cfd3bf', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "CUBPK****D"}', '2026-09-13 07:09:09.752+00'),
  ('2d1a80d3-94f6-4cf3-9549-892cd0794f91', 'a42b6b46-498a-40d5-b212-e71218cfd3bf', 'reveal', '21259064-cb21-4aa2-b76c-aa70bda800d3', 'info@apnizaroorat.com', 'admin', NULL, NULL, NULL, NULL, 'admin_panel_reveal', '{"pan_masked": "CUBPK****D"}', '2026-09-13 07:13:08.256+00'),
  ('f3329eb5-159d-41ed-bb2a-303e9310cde3', '40e0b735-b311-4ecd-b152-7eb8edde161e', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-14 06:34:07.473+00'),
  ('d6982a25-bd2d-4f39-818f-cf81972155f5', 'fa4ac550-aa73-4fb6-87b2-39881bd0f7d6', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 06:41:38.928+00'),
  ('85eb921d-c78d-4801-806a-7766ca3c1a37', '2aa1b9f4-af39-4e91-8035-34861c7e443d', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 06:46:02.048+00'),
  ('25f8345c-74fd-4f2f-bc32-33515d076ca4', 'fac81ad4-af33-4280-823b-8901f3efa3c7', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 07:03:56.037+00'),
  ('9c96e76d-bc78-4617-9e35-dbcfbde76c91', '7eeab4b1-aa62-4743-b02e-2e6134002d89', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 07:05:25.931+00'),
  ('1ca55b78-6e20-4ab3-95f2-cd353f4682ff', '9c0923db-af6c-4b58-8f66-f31bd6414974', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 08:08:27.513+00'),
  ('c8ef93c2-4367-4302-85cf-f601fb6a6eeb', 'c81dd528-9cbf-4652-8568-82af286cdb82', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****F"}', '2026-09-15 08:12:50.161+00'),
  ('89fcb2ff-0e42-4c8e-bba1-8895db53e73d', '3baabb18-6ff7-46c5-be5e-d73c4c15e6f8', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 08:16:08.615+00'),
  ('8617c019-6170-4df4-b414-cb9dd745e26e', '754b3522-cc36-4786-a14d-5a8c4d7d6707', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 08:37:36.032+00'),
  ('aedeb2eb-c1e3-444f-a017-ab81f4f139c4', 'de0a8a19-b73f-4b16-a38b-d77dcc297f4c', 'create', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'public_apply', '{"pan_masked": "GGUPP****G"}', '2026-09-15 08:41:17.446+00');

INSERT INTO public.services (id, slug, title, description, image_url, sort_order, is_active, created_at, updated_at) VALUES
  ('3d887ea2-f276-4d3c-b93d-42d714a5701e', 'credit-card', 'Credit Card', 'Choose cards from all top banks', '/images/service/credit.png', '4', FALSE, '2026-04-05 18:05:20.388169+00', '2026-04-05 18:05:20.388169+00'),
  ('c16701c4-ba72-4cdc-9643-b824dfe0da24', 'home-loan', 'Home Loan', 'Instant approval at lowest interest rates', '/images/service/home.png', '1', FALSE, '2026-04-05 18:05:20.388169+00', '2026-04-05 18:05:20.388169+00'),
  ('6b5dbdbf-acc5-432f-a149-8eda67a935f0', 'personal-loan', 'Personal Loan', 'Earn Up to 4%', '/images/service/personal.png', '2', TRUE, '2026-04-05 18:05:20.388169+00', '2026-04-05 18:05:20.388169+00'),
  ('b299202a-d3f0-4220-8220-80f6b996ac18', 'insurance', 'Insurance', 'Earn Up to 2%', '/images/service/insurance.png', '5', TRUE, '2026-04-05 18:05:20.388169+00', '2026-04-05 18:05:20.388169+00'),
  ('c2871d5c-f36c-4e55-9069-0597aea107f5', 'business-loan', 'Business Loan', 'Fund your business with flexible tenure', '/images/service/business.png', '3', FALSE, '2026-04-05 18:05:20.388169+00', '2026-05-21 19:26:07.114+00');

INSERT INTO public.users (id, mobile_number, user_name, email, mpin, is_active, is_logged_in, created_at, updated_at, last_login_at, referral_code) VALUES
  ('ff7488d0-0ba7-459e-ad56-23594b0718b1', '9352984119', 'Gaurav Patel', 'incubers.gauravpatel@gmail.com', '$2b$10$6elpOQciWzvbv2A2awdxquSEOYwYzRfiZdvUHxVEzjeOCoj3V7Voa', TRUE, FALSE, '2026-09-15 08:36:07.285567+00', '2026-09-15 08:36:07.285567+00', NULL, 'A5SMRBXJ');

INSERT INTO public.wallet (id, user_id, earning, redeem, balance, currency, created_at, updated_at) VALUES
  ('efac0fb7-ac5f-45f8-b957-0a72b620c047', 'ff7488d0-0ba7-459e-ad56-23594b0718b1', '0.00', '0.00', '0.00', 'INR', '2026-09-15 08:36:07.285567+00', '2026-09-15 08:36:07.285567+00');

ALTER TABLE ONLY public.auth
    ADD CONSTRAINT auth_email_unique UNIQUE (email);

ALTER TABLE ONLY public.auth
    ADD CONSTRAINT auth_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.lead_mobile_pan_slots
    ADD CONSTRAINT lead_mobile_pan_slots_mobile_slot_key UNIQUE (mobile_number, slot);

ALTER TABLE ONLY public.lead_mobile_pan_slots
    ADD CONSTRAINT lead_mobile_pan_slots_pkey PRIMARY KEY (mobile_number, pan_hash);

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.otp_sessions
    ADD CONSTRAINT otp_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.pan_access_audit
    ADD CONSTRAINT pan_access_audit_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.partner
    ADD CONSTRAINT partner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_accounts
    ADD CONSTRAINT payment_accounts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_accounts
    ADD CONSTRAINT payment_accounts_user_id_payment_type_key UNIQUE (user_id, payment_type);

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_mobile_number_key UNIQUE (mobile_number);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wallet
    ADD CONSTRAINT wallet_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wallet
    ADD CONSTRAINT wallet_user_id_key UNIQUE (user_id);

CREATE INDEX IF NOT EXISTS chat_answers_gin_idx ON public.chat USING gin (answers);

CREATE INDEX IF NOT EXISTS chat_created_at_idx ON public.chat USING btree (created_at DESC);

CREATE INDEX IF NOT EXISTS chat_mobile_number_idx ON public.chat USING btree (mobile_number);

CREATE INDEX IF NOT EXISTS chat_status_idx ON public.chat USING btree (status);

CREATE INDEX IF NOT EXISTS idx_banners_active_category_order ON public.banners USING btree (is_active, category, display_order) WHERE (is_active = true);

CREATE INDEX IF NOT EXISTS idx_banners_category ON public.banners USING btree (category);

CREATE INDEX IF NOT EXISTS idx_banners_display_order ON public.banners USING btree (display_order);

CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners USING btree (is_active) WHERE (is_active = true);

CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON public.leads USING btree (agent_id) WHERE (agent_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads USING btree (category);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads USING btree (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_employment_type ON public.leads USING btree (employment_type);

CREATE INDEX IF NOT EXISTS idx_leads_ins_type ON public.leads USING btree (ins_type);

CREATE INDEX IF NOT EXISTS idx_leads_ip ON public.leads USING btree (ip);

CREATE INDEX IF NOT EXISTS idx_leads_loan_amt ON public.leads USING btree (loan_amt);

CREATE INDEX IF NOT EXISTS idx_leads_mobile_number ON public.leads USING btree (mobile_number);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads USING btree (status);

CREATE INDEX IF NOT EXISTS idx_leads_user_category ON public.leads USING btree (user_id, category);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_otp_is_verified ON public.otp_sessions USING btree (is_verified) WHERE (is_verified = false);

CREATE INDEX IF NOT EXISTS idx_otp_mobile_number ON public.otp_sessions USING btree (mobile_number);

CREATE INDEX IF NOT EXISTS idx_payment_accounts_user_id ON public.payment_accounts USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_payment_accounts_user_type ON public.payment_accounts USING btree (user_id, payment_type);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email) WHERE (email IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_users_mobile_number ON public.users USING btree (mobile_number);

CREATE INDEX IF NOT EXISTS idx_wallet_user_id ON public.wallet USING btree (user_id);

CREATE INDEX IF NOT EXISTS lead_mobile_pan_slots_mobile_idx ON public.lead_mobile_pan_slots USING btree (mobile_number);

CREATE UNIQUE INDEX IF NOT EXISTS leads_pan_hash_product_open_uidx ON public.leads USING btree (pan_hash, category, COALESCE(ins_type, ''::character varying)) WHERE ((is_active IS TRUE) AND (pan_hash IS NOT NULL) AND (pan_hash <> ''::text) AND (lower((COALESCE(status, 'pending'::character varying))::text) <> 'approved'::text));

CREATE INDEX IF NOT EXISTS pan_access_audit_admin_email_idx ON public.pan_access_audit USING btree (admin_email, created_at DESC);

CREATE INDEX IF NOT EXISTS pan_access_audit_lead_id_idx ON public.pan_access_audit USING btree (lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS partner_created_at_idx ON public.partner USING btree (created_at DESC);

CREATE INDEX IF NOT EXISTS partner_name_idx ON public.partner USING btree (name);

CREATE INDEX IF NOT EXISTS services_active_sort_idx ON public.services USING btree (is_active, sort_order);

CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_key ON public.users USING btree (referral_code) WHERE (referral_code IS NOT NULL);

DROP TRIGGER IF EXISTS on_auth_user_created_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_wallet AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

DROP TRIGGER IF EXISTS on_user_created_wallet ON public.users;
CREATE TRIGGER on_user_created_wallet AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_wallet_on_user_insert();

DROP TRIGGER IF EXISTS on_user_deleted_wallet ON public.users;
CREATE TRIGGER on_user_deleted_wallet BEFORE DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION public.delete_wallet_on_user_delete();

DROP TRIGGER IF EXISTS trg_leads_claim_mobile_pan_slot ON public.leads;
CREATE TRIGGER trg_leads_claim_mobile_pan_slot BEFORE INSERT OR UPDATE OF mobile_number, pan_hash, is_active ON public.leads FOR EACH ROW EXECUTE FUNCTION public.leads_claim_mobile_pan_slot();

DROP TRIGGER IF EXISTS update_banners_updated_at ON public.banners;
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_accounts_updated_at ON public.payment_accounts;
CREATE TRIGGER update_payment_accounts_updated_at BEFORE UPDATE ON public.payment_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS wallet_updated_at ON public.wallet;
CREATE TRIGGER wallet_updated_at BEFORE UPDATE ON public.wallet FOR EACH ROW EXECUTE FUNCTION public.update_wallet_updated_at();

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.payment_accounts
    ADD CONSTRAINT payment_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Allow all for otp" ON public.otp_sessions;
CREATE POLICY "Allow all for otp" ON public.otp_sessions USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for users" ON public.users;
CREATE POLICY "Allow all for users" ON public.users USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on payment_accounts" ON public.payment_accounts;
CREATE POLICY "Allow all on payment_accounts" ON public.payment_accounts USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;
CREATE POLICY "Anyone can view active banners" ON public.banners FOR SELECT USING ((is_active = true));

DROP POLICY IF EXISTS "Authenticated users can delete banners" ON public.banners;
CREATE POLICY "Authenticated users can delete banners" ON public.banners FOR DELETE USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert banners" ON public.banners;
CREATE POLICY "Authenticated users can insert banners" ON public.banners FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update banners" ON public.banners;
CREATE POLICY "Authenticated users can update banners" ON public.banners FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view all banners" ON public.banners;
CREATE POLICY "Authenticated users can view all banners" ON public.banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
CREATE POLICY "Users can insert own leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (true);

ALTER TABLE public.auth ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.chat ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.lead_mobile_pan_slots ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.otp_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.pan_access_audit ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.partner ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;

CREATE POLICY wallet_insert_own ON public.wallet FOR INSERT WITH CHECK (((auth.uid())::text = user_id));

CREATE POLICY wallet_select_own ON public.wallet FOR SELECT USING (((auth.uid())::text = user_id));

CREATE POLICY wallet_update_own ON public.wallet FOR UPDATE USING (((auth.uid())::text = user_id)) WITH CHECK (((auth.uid())::text = user_id));

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.reconcile_partner_wallet(text) TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.claim_mobile_pan_slot(text, text) TO postgres, service_role;

