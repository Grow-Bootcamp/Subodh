-- ═══════════════════════════════════════════════════════════════
-- 05_queries.sql
-- HINTS ONLY. You write every query yourself.
-- Run after 03_ecommerce_schema.sql + Section A of 04.
-- Rules: write in the blank space under each task, run it, then
--        paste your result summary into LEARNING_LOG.md.
-- ═══════════════════════════════════════════════════════════════

USE shop_db;

-- Quick reminder of the schema you are querying:
--   customers   (customer_id PK, email UNIQUE, ...)
--   addresses   (address_id PK, customer_id FK → customers)
--   categories  (category_id PK, name UNIQUE, parent_id FK → categories)
--   products    (product_id PK, sku UNIQUE, category_id FK → categories)
--   orders      (order_id PK, customer_id FK → customers, ship_address_id FK → addresses)
--   order_items (order_id+product_id composite PK, FKs → orders, products)

-- ═══════════════════════════════════════════════════════════════
-- TASK 5.1  ── basic SELECT / WHERE / ORDER BY
-- Requirement: show product name + price for accessories
--             (category 'Accessories'), cheapest first.
-- HINTS: WHERE on a subquery or JOIN to categories;
--        ORDER BY price ASC.
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.2  ── INNER JOIN, 2 tables
-- Requirement: list every order with the customer's full name
--             and the order status.
-- HINTS: orders JOIN customers ON orders.customer_id = customers.customer_id
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.3  ── multi-join (3 tables) + computed column
-- Requirement: for each order line show order_id, product name,
--             quantity, unit_price, and line_total.
-- HINTS: order_items JOIN products JOIN orders;
--        line_total = quantity * unit_price (alias it).
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.4  ── LEFT JOIN (find what's MISSING)
-- Requirement: list every customer and their order count,
--             INCLUDING customers with zero orders (count 0).
-- HINTS: customers LEFT JOIN orders ... GROUP BY customer_id;
--        use COUNT(order_id) so missing orders count as 0, not NULL;
--        wrap COUNT in COALESCE if you see NULL.
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.5  ── GROUP BY + HAVING (aggregate filter)
-- Requirement: which products sold MORE than 2 units in total?
-- HINTS: SUM(quantity) over order_items ... GROUP BY product_id
--        ... HAVING SUM(quantity) > 2 (WHERE would filter rows
--        BEFORE grouping; HAVING filters the grouped result).
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.6  ── self-join on the tree (categories)
-- Requirement: show each category and, as a column, its parent
--             category name (top-level rows should show NULL or
--             'none').
-- HINTS: categories LEFT JOIN categories AS parent ON
--        categories.parent_id = parent.category_id
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.7  ── subquery
-- Requirement: find customers who spent more than the average
--             order total.
-- HINTS: inner subquery computes AVG(total) from orders;
--        outer query filters customers' SUM or compares their
--        orders' total.
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.8  ── a small report (all skills at once)
-- Requirement: revenue by category:
--   category_name | units_sold | revenue
-- HINTS: products JOIN categories JOIN order_items;
--        revenue = SUM(order_items.quantity * unit_price);
--        GROUP BY category name; ORDER BY revenue DESC.
-- ── write your query below ─────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
-- TASK 5.9  ── design your own
-- Requirement: invent ONE question this schema could answer
--             (e.g. "which city has the most orders?"), write
--             the query, and note the answer in your log.
-- ── your question: _____________________________________________
-- ── write your query below ─────────────────────────────────────
