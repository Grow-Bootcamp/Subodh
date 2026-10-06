-- 02_filter_sort_paginate.sql — WHERE, ORDER BY, LIMIT/OFFSET
-- Every control on the admin "Orders" screen maps to one clause below.
USE commerce_db;

-- TASK 2.1 — FILTERING (WHERE). Predict the row count before you run each one.
-- a) paid orders only
-- TODO(you):

-- b) products in Electronics or Sports under ₹400
--    hint: category_id IN (...)  — look up the ids: SELECT * FROM categories;
-- TODO(you):

-- c) customers whose city starts with 'B' (LIKE + wildcard)
-- TODO(you):

-- TASK 2.2 — SORTING (ORDER BY)
-- a) all active products, cheapest first
-- TODO(you):

-- b) price DESC, ties broken by name ASC (two sort keys, each with its own direction)
-- TODO(you):

-- c) does MySQL sort NULLs first or last in ASC order? Prove it with a LEFT JOIN
--    from orders to order_items (an order with no items gives you NULLs).
-- TODO(you): NULLs appear ____ in ASC, ____ in DESC.

-- TASK 2.3 — PAGINATION (LIMIT / OFFSET)
-- Page 1 of orders (10 per page):
-- TODO(you):

-- Page 2 (WHERE/ORDER BY stay identical, only OFFSET changes):
-- TODO(you):

-- Total rows so the UI can render page count — the classic pair:
--   SELECT COUNT(*) ... WHERE ...        (no ORDER BY / LIMIT here)
--   SELECT ...        WHERE ... ORDER BY ... LIMIT 10 OFFSET 10;
-- Count all 'paid' orders:
-- TODO(you):

-- TASK 2.4 — THE OFFSET TRAP
-- Run both and compare EXPLAIN:
EXPLAIN SELECT * FROM orders ORDER BY placed_at DESC LIMIT 10 OFFSET 0;
EXPLAIN SELECT * FROM orders ORDER BY placed_at DESC LIMIT 10 OFFSET 390;
--
-- At OFFSET 390 MySQL still walks and throws away 390 rows. Long lists switch
-- to KEYSET (cursor) pagination:
--   WHERE (placed_at, order_id) < (?, ?)   -- "10 rows BEFORE this point"
--   ORDER BY placed_at DESC, order_id DESC LIMIT 10;
-- TODO(you): rewrite your page 2 query from Task 2.3 as a keyset query
--            (cursor = page 1's last row's placed_at + order_id).
