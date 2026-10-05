-- 02_transactions.sql — START TRANSACTION / COMMIT / ROLLBACK
-- REAL WORLD: POST /transfer moves money between two accounts. MySQL runs your
-- statements one at a time — without a transaction, a crash after the debit but
-- before the credit makes money vanish. A transaction groups statements into
-- ONE indivisible unit (Atomicity).
USE bank_db;

-- Always see what the books look like BEFORE you touch them:
SELECT account_id, owner_name, balance FROM accounts ORDER BY account_id;

-- ════ TASK 2.1 ═════════════════════════════════════════════════════════════
-- TRANSFER ₹10,000 from Aditi (account 1) to Rahul (account 2).
-- Write it yourself as a single transaction: 3 statements, then COMMIT.
--   hint: UPDATE accounts SET balance = balance - 10000 WHERE account_id = 1;
--         UPDATE accounts SET balance = balance + 10000 WHERE account_id = 2;
--         INSERT INTO transactions_log ... (two rows: debit + credit)
--
-- TODO(you): write the whole block below, run it, then SELECT the balances.

START TRANSACTION;

-- ... your statements here ...

COMMIT;

SELECT account_id, owner_name, balance FROM accounts ORDER BY account_id;
SELECT * FROM transactions_log ORDER BY log_id;   -- audit rows must match the balance change

-- ════ TASK 2.2 ═════════════════════════════════════════════════════════════
-- FAILED TRANSFER: try to move ₹999,999 from Rahul (account 2, ~₹60,000) to
-- Sara (account 3). The CHECK constraint on balance should reject the debit.
-- Do it inside a transaction: START ... debit/credit/2 log rows ... COMMIT.
-- Watch the error, then prove NOTHING was written.
--
-- Questions:
--   a) Which statement errored, and why? (CHK constraint vs "insufficient funds")
--   b) Run: SHOW ENGINE INNODB STATUS\G   and read the "TRANSACTIONS" section —
--      is your transaction still open, or was it auto-rolled back?
--   c) SELECT the balances and the log. Anything change?
--
-- TODO(you): answers a/b/c + the failing block below

START TRANSACTION;
-- ... your statements ...
-- COMMIT;   <-- you should end up NOT committing. Why does a rollback happen?

SELECT account_id, owner_name, balance FROM accounts ORDER BY account_id;

-- ════ TASK 2.3 ═════════════════════════════════════════════════════════════
-- EXPLICIT ROLLBACK on purpose: open a transaction, move ₹5,000 from
-- 'Ops Suspense' (6) to Aditi (1), then decide the request is fraudulent and
-- run ROLLBACK instead of COMMIT. Prove the balances are untouched.
--
-- TODO(you): the block + proof query

START TRANSACTION;
-- ...
ROLLBACK;

SELECT account_id, owner_name, balance FROM accounts ORDER BY account_id;

-- ════ TASK 2.4 ═════════════════════════════════════════════════════════════
-- CONDITIONAL rollback (the pattern every payment API uses):
--   1. START TRANSACTION
--   2. SELECT balance INTO @b FROM accounts WHERE account_id = 2 FOR UPDATE
--      (FOR UPDATE takes a row lock — a concurrent transfer must wait for us)
--   3. IF @b < 50000 THEN ROLLBACK; SELECT 'declined' AS result;
--      ELSE UPDATE ... ; UPDATE ... ; INSERT log rows; COMMIT; SELECT 'ok';
--      END IF;
-- Try it with amount = 100000 (should decline) and amount = 1000 (should go).
--
-- TODO(you): paste the working IF/ELSE version here

-- ... your statements ...

-- ════ TASK 2.5 ═════════════════════════════════════════════════════════════
-- Reset the demo data whenever you want a clean slate:
--   docker compose exec -T mysql mysql -uroot -p'root_pw' bank_db < sql/01_schema.sql
