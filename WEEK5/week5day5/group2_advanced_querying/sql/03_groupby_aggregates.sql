-- 03_groupby_aggregates.sql — GROUP BY, HAVING, COUNT/SUM/AVG/MIN/MAX
-- REAL WORLD: every dashboard widget is one of these: revenue this month,
-- top category, average order value, active users. Learn to read a business
-- question and turn it into GROUP BY + HAVING.
USE commerce_db;

-- ════ TASK 3.1 — SINGLE-COLUMN GROUP BY ═════════════════════════════════════
-- a) order count per status
-- TODO(you):

-- b) number of customers per city, busiest city first
-- TODO(you):

-- c) product count per category (join categories for the name)
-- TODO(you):

-- ════ TASK 3.2 — THE FIVE AGGREGATES ════════════════════════════════════════
-- One query over products: total, average, cheapest, dearest, and how many
-- rows were counted.
--   SELECT COUNT(*), SUM(price), AVG(price), MIN(price), MAX(price) FROM products;
-- TODO(you):

-- Then: same five numbers, but grouped by category_id, with the category name.
-- TODO(you):

-- ════ TASK 3.3 — WHERE vs HAVING ════════════════════════════════════════════
-- Evaluation order: FROM -> WHERE (filters ROWS) -> GROUP BY -> HAVING
-- (filters GROUPS) -> SELECT -> ORDER BY -> LIMIT.
--
-- a) revenue per product (SUM(quantity * unit_price)), only for products that
--    actually sold — HAVING revenue > 0 — sorted by revenue DESC, top 10.
-- TODO(you):

-- b) customers who placed MORE THAN 5 orders.
--    First write it with WHERE COUNT(*) > 5  -> it FAILS.
--    Then fix it with HAVING. Why does the first one fail?
-- TODO(you): the error was ____________________
--
-- c) categories whose AVERAGE product price is above ₹400.
-- TODO(you):

-- d) a filter that must go in WHERE, not HAVING: only products with
--    price > 500, grouped by category.
-- TODO(you): why WHERE and not HAVING? ____________________

-- ════ TASK 3.4 — MULTI-COLUMN GROUP BY + HAVING + ORDER BY ══════════════════
-- Daily revenue for the last 30 days, revenue > 0, highest first:
--   hints: DATE(placed_at) as the day; join order_items to get money;
--          orders.status IN ('paid','shipped') count as revenue
-- TODO(you):

-- Average order value (AOV) per customer, customers with >= 3 orders, top 10:
--   AOV = SUM(item money) / COUNT(DISTINCT order_id)
-- TODO(you):

-- ════ TASK 3.5 — TRAPS ══════════════════════════════════════════════════════
-- a) COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column):
--    orders: COUNT(*) counts rows; COUNT(customer_id) counts non-NULL;
--    COUNT(DISTINCT customer_id) counts unique buyers.
--    Which number is "how many customers bought at least once"?
-- TODO(you): __________
--
-- b) AVG over order_items averages LINE values; customers think in ORDER
--    values. Explain the difference in one sentence.
-- TODO(you): __________
--
-- c) Running this WITHOUT GROUP BY aggregates the whole table into ONE row:
--      SELECT status, COUNT(*) FROM orders;
--    MySQL 8 with ONLY_FULL_GROUP_BY (the default) rejects it. Copy the error
--    into your notes — it is a feature, not a nuisance.
-- TODO(you): error = ____________________

-- ════ TASK 3.6 — PUT IT TOGETHER ════════════════════════════════════════════
-- The "executive summary" query: per category, how many products, how many
-- units sold, total revenue, average unit price — only categories with
-- revenue above ₹10,000, ordered by revenue DESC.
-- TODO(you):
