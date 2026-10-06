-- 03_groupby_aggregates.sql — GROUP BY, HAVING, COUNT/SUM/AVG/MIN/MAX
-- Every dashboard widget is one of these: revenue, top category, AOV, counts.
USE commerce_db;

-- TASK 3.1 — SINGLE-COLUMN GROUP BY
-- a) order count per status
-- TODO(you):

-- b) product count per category (join categories for the name)
-- TODO(you):

-- TASK 3.2 — THE FIVE AGGREGATES
-- One query over products: total, average, cheapest, dearest, rows counted.
--   SELECT COUNT(*), SUM(price), AVG(price), MIN(price), MAX(price) FROM products;
-- TODO(you):

-- Then: the same five numbers grouped by category, with the category name.
-- TODO(you):

-- TASK 3.3 — WHERE vs HAVING
-- Order of evaluation: FROM -> WHERE (filters ROWS) -> GROUP BY -> HAVING
-- (filters GROUPS) -> SELECT -> ORDER BY -> LIMIT.
--
-- a) customers who placed MORE THAN 5 orders.
--    First write it with WHERE COUNT(*) > 5  -> it FAILS.
--    Then fix it with HAVING. Why does the first one fail?
-- TODO(you): the error was ____________________
--
-- b) a filter that must go in WHERE, not HAVING: only products with
--    price > 500, grouped by category.
-- TODO(you): why WHERE and not HAVING? ____________________

-- TASK 3.4 — MULTI-COLUMN GROUP BY + HAVING + ORDER BY
-- Average order value (AOV) per customer, customers with >= 3 orders, top 10:
--   AOV = SUM(item money) / COUNT(DISTINCT order_id)
-- TODO(you):

-- TASK 3.5 — TRAPS
-- a) COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column) over orders:
--    rows / non-NULL / unique buyers. Which number answers
--    "how many customers bought at least once"?
-- TODO(you): __________
--
-- b) run this WITHOUT GROUP BY — it aggregates the whole table into ONE row:
--      SELECT status, COUNT(*) FROM orders;
--    MySQL 8 with ONLY_FULL_GROUP_BY (the default) rejects it. Copy the error.
-- TODO(you): error = ____________________

-- TASK 3.6 — PUT IT TOGETHER
-- The "executive summary": per category, product count, units sold, total
-- revenue, average unit price — only categories with revenue above ₹10,000,
-- ordered by revenue DESC.
-- TODO(you):
