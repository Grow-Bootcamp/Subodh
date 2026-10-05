-- 02_filter_sort_paginate.sql — WHERE, ORDER BY, LIMIT/OFFSET
-- REAL WORLD: the admin "Orders" screen. The user picks a status, a date range
-- and a sort order, then clicks Next/Prev. Every one of those UI controls maps
-- to one clause below.
USE commerce_db;

-- ════ TASK 2.1 — FILTERING (WHERE) ══════════════════════════════════════════
-- Write each one, then predict the row count before you run it.

-- a) paid orders only
-- TODO(you):

-- b) orders placed in the last 30 days that are NOT cancelled
--    hint: WHERE placed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND status <> 'cancelled'
-- TODO(you):

-- c) products in Electronics or Sports under ₹400
--    hint: category_id IN (...)  — look up the ids: SELECT * FROM categories;
-- TODO(you):

-- d) customers whose city starts with 'B' (use LIKE and a wildcard)
-- TODO(you):

-- e) orders in a status list AND a date window, sorted by newest first
--    hint: WHERE status IN ('paid','shipped') AND placed_at BETWEEN '...' AND '...'
-- TODO(you):

-- ════ TASK 2.2 — SORTING (ORDER BY) ═════════════════════════════════════════
-- a) all active products, cheapest first
-- TODO(you):

-- b) products by price DESC, and for equal prices by name ASC (two sort keys,
--    each with its own direction)
-- TODO(you):

-- c) the 10 most recent orders
-- TODO(you):

-- d) NULLs: does MySQL sort NULLs first or last in ASC order? Prove it.
--    (table with NULLs: ALTER/add a column, or use orders with a LEFT JOIN
--     on order_items — a cancelled order with no items will give you NULLs)
-- TODO(you): NULLs appear ____ in ASC, ____ in DESC.

-- ════ TASK 2.3 — PAGINATION (LIMIT / OFFSET) ════════════════════════════════
-- Page 1 of orders (10 per page):
-- TODO(you):

-- Page 2 (note WHERE/ORDER BY stay identical, only OFFSET changes):
-- TODO(you):

-- Total rows for a list, so the UI can render page count — the classic pair:
--   SELECT COUNT(*) ... WHERE ...        (no ORDER BY / LIMIT here)
--   SELECT ...        WHERE ... ORDER BY ... LIMIT 10 OFFSET 10;
-- Count all 'paid' orders:
-- TODO(you):

-- Pages needed for 10 per page (integer division):
--   SELECT CEILING(COUNT(*) / 10) AS pages FROM orders WHERE status = 'paid';
-- TODO(you):

-- ════ TASK 2.4 — THE OFFSET TRAP ════════════════════════════════════════════
-- Run both and compare EXPLAIN + elapsed time:
EXPLAIN SELECT * FROM orders ORDER BY placed_at DESC LIMIT 10 OFFSET 0;
EXPLAIN SELECT * FROM orders ORDER BY placed_at DESC LIMIT 10 OFFSET 390;
--
-- With OFFSET 390 MySQL still walks and throws away 390 rows. Real systems
-- switch to KEYSET (cursor) pagination once lists get long:
--   WHERE (placed_at, order_id) < (?, ?)   -- "give me 10 rows BEFORE this point"
--   ORDER BY placed_at DESC, order_id DESC LIMIT 10;
-- TODO(you): rewrite the "page 2" query from Task 2.3 as a keyset query
--            (you need page 1's last row's placed_at + order_id as the cursor).

-- ════ TASK 2.5 — PRACTICAL EXERCISE ═════════════════════════════════════════
-- One query: all 'shipped' orders from the last 90 days, newest first,
-- 25 per page, page 1 — plus the matching COUNT(*) query.
-- TODO(you):
