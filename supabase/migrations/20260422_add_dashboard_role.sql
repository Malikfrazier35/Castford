-- 20260422_add_dashboard_role.sql
-- Adds users.dashboard_role for UI routing (orthogonal to users.role for permissions).

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS dashboard_role TEXT
  CHECK (dashboard_role IN ('cfo','ceo','controller','fpa','standard','cashflow'))
  DEFAULT 'standard';

-- Index for fast lookup during login redirect
CREATE INDEX IF NOT EXISTS idx_users_dashboard_role ON users(dashboard_role);

-- Documentation on the column
COMMENT ON COLUMN users.dashboard_role IS
  'UI routing only: which command center the user lands on post-login. Orthogonal to `role` which controls permissions. Values: cfo, ceo, controller, fpa, standard, cashflow.';

-- Seed Malik's account as cfo so the CFO command center has a tester
UPDATE users SET dashboard_role = 'cfo'
WHERE email = 'malik@vaultline.app' AND dashboard_role = 'standard';
