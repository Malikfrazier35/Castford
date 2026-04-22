-- supabase/migrations/20260423_dashboard_engine_foundation.sql
-- Session 2A: foundation for config-driven dashboard engine + standalone CFO Hub path

-- ────────────────────────────────────────────────────────────────────────
-- 1. Organization tier + acquisition_path
-- ────────────────────────────────────────────────────────────────────────
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'business'
    CHECK (tier IN ('starter', 'growth', 'business', 'enterprise')),
  ADD COLUMN IF NOT EXISTS acquisition_path TEXT DEFAULT 'native'
    CHECK (acquisition_path IN ('native', 'hub_standalone', 'enterprise'));

COMMENT ON COLUMN organizations.tier IS 'Stripe-tier-derived; controls dashboard access + AI query budget + max users';
COMMENT ON COLUMN organizations.acquisition_path IS 'native = full Castford with QB/Stripe/Plaid sync; hub_standalone = external system POSTs canonical data via /v1/ingest; enterprise = custom';

-- ────────────────────────────────────────────────────────────────────────
-- 2. dashboard_cache for hub_standalone customers
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dashboard_cache (
  org_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  data_source TEXT DEFAULT 'castford_native'
    CHECK (data_source IN ('castford_native', 'external_api', 'seeded_demo')),
  refreshed_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE dashboard_cache IS 'For hub_standalone orgs: canonical data shape POSTed via /v1/ingest. Native orgs query gl_transactions live; this table is unused for them.';

-- ────────────────────────────────────────────────────────────────────────
-- 3. gl_accounts.subtype for AR/AP proxy (Controller dashboard)
-- ────────────────────────────────────────────────────────────────────────
ALTER TABLE gl_accounts
  ADD COLUMN IF NOT EXISTS subtype TEXT
    CHECK (subtype IN ('ar', 'ap', 'cash', 'inventory') OR subtype IS NULL);

CREATE INDEX IF NOT EXISTS idx_gl_accounts_subtype
  ON gl_accounts(org_id, subtype) WHERE subtype IS NOT NULL;

-- Auto-tag based on account name + type heuristics
-- AR: asset accounts containing "receivable" or "a/r"
UPDATE gl_accounts SET subtype = 'ar'
  WHERE subtype IS NULL
    AND account_type = 'asset'
    AND (
      LOWER(name) LIKE '%receivable%'
      OR LOWER(name) ~ '\ba/r\b'
      OR LOWER(name) LIKE 'ar %'
      OR LOWER(name) LIKE '%accounts receivable%'
    );

-- AP: liability accounts containing "payable" or "a/p"
UPDATE gl_accounts SET subtype = 'ap'
  WHERE subtype IS NULL
    AND account_type = 'liability'
    AND (
      LOWER(name) LIKE '%payable%'
      OR LOWER(name) ~ '\ba/p\b'
      OR LOWER(name) LIKE 'ap %'
      OR LOWER(name) LIKE '%accounts payable%'
    );

-- Cash: asset accounts that look like bank/cash
UPDATE gl_accounts SET subtype = 'cash'
  WHERE subtype IS NULL
    AND account_type = 'asset'
    AND (
      LOWER(name) LIKE '%cash%'
      OR LOWER(name) LIKE '%checking%'
      OR LOWER(name) LIKE '%savings%'
      OR LOWER(name) LIKE '%bank%'
      OR LOWER(name) LIKE '%money market%'
      OR LOWER(name) LIKE '%treasury%'
    );

-- Inventory: asset accounts containing "inventory" or "stock"
UPDATE gl_accounts SET subtype = 'inventory'
  WHERE subtype IS NULL
    AND account_type = 'asset'
    AND (
      LOWER(name) LIKE '%inventory%'
      OR LOWER(name) LIKE '%stock on hand%'
    );

COMMENT ON COLUMN gl_accounts.subtype IS 'Used for Controller AR/AP aging proxy + Cash dashboard segmentation. Manually editable in /controller/setup. Auto-tagged on import via heuristics.';

-- ────────────────────────────────────────────────────────────────────────
-- 4. AI query log + monthly usage view (tier enforcement, billing)
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_query_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query_type TEXT NOT NULL,
    -- 'narrate' = AI Layer panel narrations
    -- 'copilot' = chat copilot queries
    -- 'export' = AI-generated narratives in board exports
  context TEXT,
    -- the panel/zone the query was for, e.g. 'cash_position', 'variance_top'
  tokens_used INT DEFAULT 0,
  cost_cents NUMERIC(10,4) DEFAULT 0,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_query_log_org_month
  ON ai_query_log(org_id, created_at DESC);

COMMENT ON TABLE ai_query_log IS 'Every AI inference logged for: (1) tier limit enforcement, (2) per-org cost tracking, (3) usage analytics';

-- ────────────────────────────────────────────────────────────────────────
-- 5. Extend dashboard_role to include treasurer (maps to controller config in v1)
-- ────────────────────────────────────────────────────────────────────────
-- The users.dashboard_role column already exists (cfo, ceo, controller, fpa, standard, cashflow)
-- Add treasurer as a recognized value. v1 routes treasurer → controller config.
-- v2 will add a dedicated treasurer.json config.
DO $$
BEGIN
  -- Drop any existing CHECK constraint and re-add with treasurer
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'users' AND column_name = 'dashboard_role'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_dashboard_role_check;
  END IF;

  ALTER TABLE users ADD CONSTRAINT users_dashboard_role_check
    CHECK (dashboard_role IN ('cfo', 'ceo', 'controller', 'treasurer', 'fpa', 'standard', 'cashflow') OR dashboard_role IS NULL);
END $$;

-- ────────────────────────────────────────────────────────────────────────
-- 6. Set Malik's org to 'business' tier (CFO Hub access for testing)
-- ────────────────────────────────────────────────────────────────────────
UPDATE organizations
  SET tier = 'business', acquisition_path = 'native'
  WHERE id = 'd8afc85d-dfeb-4289-824c-400d14dc8029';

-- ────────────────────────────────────────────────────────────────────────
-- 7. RLS for new tables
-- ────────────────────────────────────────────────────────────────────────
ALTER TABLE dashboard_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_query_log ENABLE ROW LEVEL SECURITY;

-- Service role can do anything (used by edge functions)
CREATE POLICY "Service role full access on dashboard_cache"
  ON dashboard_cache FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on ai_query_log"
  ON ai_query_log FOR ALL TO service_role USING (true);

-- Authenticated users can read their own org's data
CREATE POLICY "Users read own org dashboard_cache"
  ON dashboard_cache FOR SELECT TO authenticated
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users read own org ai_query_log"
  ON ai_query_log FOR SELECT TO authenticated
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- ────────────────────────────────────────────────────────────────────────
-- 8. Verification queries (run manually after migration)
-- ────────────────────────────────────────────────────────────────────────
-- SELECT count(*), subtype FROM gl_accounts GROUP BY subtype;
-- SELECT id, name, tier, acquisition_path FROM organizations;
-- SELECT count(*) FROM ai_query_log;
