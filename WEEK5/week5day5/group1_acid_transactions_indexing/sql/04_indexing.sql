-- 04_indexing.sql — indexes: why a query that used to take seconds returns instantly
--
-- REAL WORLD: the "find my account / search by email" endpoint was fine with
-- 100 rows. At 50,000 rows it times out. An index is a sorted lookup structure
-- (B+Tree) that lets InnoDB find a row WITHOUT scanning every page.
--
-- A: load this file whole:  docker compose exec -T mysql mysql -uroot -p'root_pw' bank_db < sql/04_indexing.sql
-- B: then work through the TASKs in a connected client.

USE bank_db;

DROP TABLE IF EXISTS customers_index_demo;
CREATE TABLE customers_index_demo (
  customer_id INT NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(80) NOT NULL,
  email       VARCHAR(120) NOT NULL,
  city        VARCHAR(60)  NOT NULL,
  signup_date DATE         NOT NULL,
  PRIMARY KEY (customer_id)          -- the PK is already an index (clustered)
);

-- 50,000 rows so EXPLAIN has real work to count.
SET SESSION cte_max_recursion_depth = 100000;
INSERT INTO customers_index_demo (full_name, email, city, signup_date)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50000
)
SELECT
  CONCAT('Customer ', lpad(n, 5, '0')),
  CONCAT('user', lpad(n, 5, '0'), '@example.com'),
  ELT(1 + (n MOD 5), 'Pune', 'Delhi', 'Bengaluru', 'Mumbai', 'Kolkata'),
  DATE_ADD('2023-01-01', INTERVAL (n MOD 900) DAY)
FROM seq;

SELECT COUNT(*) AS total_rows FROM customers_index_demo;

-- ════ TASK 4.1 ═════════════════════════════════════════════════════════════
-- BASELINE: run these three, save the output.
SELECT * FROM customers_index_demo WHERE email = 'user01234@example.com';
EXPLAIN SELECT * FROM customers_index_demo WHERE email = 'user01234@example.com';
SELECT * FROM customers_index_demo WHERE city = 'Pune' AND signup_date BETWEEN '2023-06-01' AND '2023-12-31';
EXPLAIN SELECT * FROM customers_index_demo WHERE city = 'Pune' AND signup_date BETWEEN '2023-06-01' AND '2023-12-31';
--
-- In EXPLAIN, read these columns: type, key, rows.
--   type = ALL   -> full table scan (worst)
--   key  = NULL  -> no index used
--   rows = 50000 -> every row examined
-- TODO(you): type=ALL key=(NULL) rows=49910 for the email query.

-- ════ TASK 4.2 ═════════════════════════════════════════════════════════════
-- ADD the index, then re-run Task 4.1's EXPLAINs.

CREATE INDEX idx_customers_email ON customers_index_demo (email);  -- duplicate index, MySQL ignores it

EXPLAIN SELECT * FROM customers_index_demo WHERE email = 'user01234@example.com';
--
-- TODO(you): type=ref key=idx_customers_email rows=1 .  What happened to "rows"?

-- ════ TASK 4.3 ═════════════════════════════════════════════════════════════
-- COMPOSITE index for the two-column filter. Order matters:
-- (city, signup_date) can serve a city-only filter AND city+date,
-- but NEVER signup_date alone (the leftmost prefix rule).
CREATE INDEX idx_full_name ON customers_index_demo (full_name);

EXPLAIN SELECT * FROM customers_index_demo WHERE city = 'Pune' AND signup_date BETWEEN '2023-06-01' AND '2023-12-31';
EXPLAIN SELECT * FROM customers_index_demo WHERE signup_date BETWEEN '2023-06-01' AND '2023-12-31';  -- leftmost prefix violated
--
-- TODO(you): first EXPLAIN key=idx_city_signup ; second EXPLAIN key=(NULL) (why?)


-- ════ TASK 4.4 ═════════════════════════════════════════════════════════════
-- INDEXES ARE NOT FREE. They slow down every INSERT/UPDATE/DELETE, because
-- each index must be maintained alongside the row.
--   INSERT INTO customers_index_demo (full_name, email, city, signup_date)
--   VALUES ('New User', 'new@example.com', 'Pune', '2024-01-01');
-- Then measure again with:  DROP INDEX idx_customers_email ON customers_index_demo;
--
INSERT INTO customers_index_demo (full_name, email, city, signup_date)
VALUES ('New User 1', 'new3@example.com', 'Pune', '2024-01-01');
DROP INDEX idx_customers_email ON customers_index_demo;
DROP INDEX idx_city_signup ON customers_index_demo;
-- Real-world rule of thumb: index what you WHERE / ORDER BY / JOIN on; never
-- blindly index every column.
-- TODO(you): list which tables you'd index in `bank_db` and for which query.

-- ════ TASK 4.6 ═════════════════════════════════════════════════════════════
-- CLEANUP when you're done:  DROP TABLE customers_index_demo;
DROP TABLE customers_index_demo;