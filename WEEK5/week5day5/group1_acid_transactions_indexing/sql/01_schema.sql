-- 01_schema.sql — a tiny bank ledger (run this FIRST, then `npm run schema`)
-- REAL WORLD: a payments service must never lose money. Every rupee moved is
-- written twice (debit one account, credit another) plus an audit row. If the
-- process dies halfway, the bank's books must still balance — that is exactly
-- what ACID + transactions are for.
USE bank_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions_log;
DROP TABLE IF EXISTS accounts;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE accounts (
  account_id   INT           NOT NULL AUTO_INCREMENT,
  owner_name   VARCHAR(80)   NOT NULL,
  balance      DECIMAL(12,2) NOT NULL DEFAULT 0.00,  -- DECIMAL, never FLOAT (money!)
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id),
  CONSTRAINT chk_accounts_balance CHECK (balance >= 0)  -- defence in depth: no negative balances
);


INSERT INTO accounts (owner_name, balance) VALUES
  ('Aditi Sharma',  250000.00),
  ('Rahul Mehta',    50000.00),
  ('Sara Khan',     900000.00),
  ('Vikram Iyer',       0.00),
  ('Neha Patil',    120000.00),
  ('Ops Suspense',       0.00);   -- a holding account, handy for ROLLBACK demos

-- ════ TASK 1.1 ═════════════════════════════════════════════════════════════
-- Look at the two tables. Which column is the PRIMARY KEY of each?
-- Which one is the FOREIGN KEY and where does it point?
-- Run:  SHOW CREATE TABLE transactions_log;  and find the constraint by name.
--
-- TODO(you): account PK = ______   log PK = ______   FK = ______ -> ______
CREATE TABLE transactions_log(
  log_id BIGINT NOT NULL AUTO_INCREMENT,
  account_id INT NOT NULL,
  txn_type ENUM('debit', 'credit') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  reason VARCHAR(120) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  KEY idx_txn_account_created (account_id, created_at),
  CONSTRAINT fk_txn_account FOREIGN KEY (account_id)
    REFERENCES accounts (account_id)
)