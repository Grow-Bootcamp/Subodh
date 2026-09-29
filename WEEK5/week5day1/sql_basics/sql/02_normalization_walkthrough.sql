-- ═══════════════════════════════════════════════════════════════
-- 02_normalization_walkthrough.sql
-- From a flat, denormalized table to 1NF → 2NF → 3NF
-- READ: 03_normalization.md first (theory), then RUN each section
-- and answer the TASK questions.
-- ═══════════════════════════════════════════════════════════════

USE shop_db;

-- ───────────────────────────────────────────────────────────────
-- STEP 0: THE ORIGINAL MESS (un-normalized)
-- One flat table holding everything about orders.
-- This is how a spreadsheet person would model it.
-- ───────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS orders_flat;
CREATE TABLE orders_flat (
  order_id     INT,
  order_date   DATE,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  customer_city  VARCHAR(60),
  products      VARCHAR(255),   -- "Laptop,Mouse"  ← multi-valued!
  quantities    VARCHAR(50),    -- "1,3"           ← repeated group!
  prices        VARCHAR(50),    -- "900,20"        ← repeated group!
  order_total   DECIMAL(10,2)
);

INSERT INTO orders_flat VALUES
  (1, '2026-09-01', 'Ana Rao',   'ana@example.com',  'Pune',
   'Laptop,Mouse', '1,3',  '900.00,20.00',  960.00),
  (1, '2026-09-01', 'Ana Rao',   'ana@example.com',  'Pune',
   'Laptop,Mouse', '1,3',  '900.00,20.00',  960.00),   -- same order, 2nd row
  (2, '2026-09-03', 'Ben Khan',  'ben@example.com',  'Delhi',
   'Keyboard',     '2',    '40.00',          80.00),
  (3, '2026-09-05', 'Ana Rao',   'ana@example.com',  'Pune',
   'Mouse,USB-C Hub', '1,1', '20.00,35.00', 55.00);

-- ═══════════════════════════════════════════════════════════════
-- TASK 2.1  ── smell the problems BEFORE normalizing
-- Run these, then answer in TODOs below.
-- ═══════════════════════════════════════════════════════════════
SELECT * FROM orders_flat;

-- (a) Find duplicated order rows:
SELECT order_id, COUNT(*) AS copies
FROM orders_flat
GROUP BY order_id
HAVING COUNT(*) > 1;

-- TODO(you): which order_id is duplicated? _______________________

-- (b) Try to find every order that contains 'Mouse':
-- TODO(you): write that query (HINT: LIKE / FIND_IN_SET on products)
--            _____________________________________________________
-- NOTE how ugly it is -- comma-separated values break SQL's power.

-- (c) Ana moved to Mumbai. How many rows must you UPDATE?
-- TODO(you): count them: _________________________________________
SELECT COUNT(*) AS rows_to_patch FROM orders_flat WHERE customer_email='ana@example.com';

-- ═══════════════════════════════════════════════════════════════
-- STEP 1: 1NF -- atomic values, no repeating groups
-- Rule: every cell holds ONE value; no comma-separated lists.
-- Fix: one row per product line; kill the multi-valued columns.
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS orders_1nf;
CREATE TABLE orders_1nf (
  line_id       INT PRIMARY KEY AUTO_INCREMENT,
  order_id      INT,
  order_date    DATE,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  customer_city VARCHAR(60),
  product_name  VARCHAR(100),   -- ONE product per row
  quantity      INT,            -- ONE quantity per row
  price         DECIMAL(10,2)   -- ONE price per row
);

INSERT INTO orders_1nf
  (order_id, order_date, customer_name, customer_email, customer_city, product_name, quantity, price)
VALUES
  (1, '2026-09-01', 'Ana Rao',  'ana@example.com', 'Pune',  'Laptop',   1, 900.00),
  (1, '2026-09-01', 'Ana Rao',  'ana@example.com', 'Pune',  'Mouse',    3,  20.00),
  (2, '2026-09-03', 'Ben Khan', 'ben@example.com', 'Delhi', 'Keyboard', 2,  40.00),
  (3, '2026-09-05', 'Ana Rao',  'ana@example.com', 'Pune',  'Mouse',    1,  20.00),
  (3, '2026-09-05', 'Ana Rao',  'ana@example.com', 'Pune',  'USB-C Hub',1,  35.00);

-- ═══════════════════════════════════════════════════════════════
-- TASK 2.2  ── 1NF achieved, but watch the NEW problem
-- Find orders containing 'Mouse' -- now trivial:
-- ═══════════════════════════════════════════════════════════════
SELECT DISTINCT order_id FROM orders_1nf WHERE product_name = 'Mouse';
-- TODO(you): what remains broken in 1NF? (HINT: count how many
--            rows repeat Ana's email) ____________________________
SELECT customer_email, COUNT(*) AS repeated
FROM orders_1nf GROUP BY customer_email HAVING COUNT(*) > 1;

-- ═══════════════════════════════════════════════════════════════
-- STEP 2: 2NF -- 1NF + no partial dependency
-- Rule: a non-key column must depend on the WHOLE primary key.
-- Problem in 1NF: line_id is the key, yet customer_city depends
-- only on customer_email (not on line_id). That is a PARTIAL
-- dependency -> data duplication (Ana's city stored 4 times).
-- Fix: pull customer data into its own table keyed by customer.
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS customers_2nf;
CREATE TABLE customers_2nf (
  customer_id   INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL UNIQUE,  -- email is UNIQUE!
  customer_city VARCHAR(60) NOT NULL
);

INSERT INTO customers_2nf (customer_name, customer_email, customer_city) VALUES
  ('Ana Rao',  'ana@example.com', 'Pune'),
  ('Ben Khan', 'ben@example.com', 'Delhi');

DROP TABLE IF EXISTS order_lines_2nf;
CREATE TABLE order_lines_2nf (
  line_id  INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  order_date DATE NOT NULL,
  customer_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_2nf_customer
    FOREIGN KEY (customer_id) REFERENCES customers_2nf(customer_id)
);

INSERT INTO order_lines_2nf (order_id, order_date, customer_id, product_name, quantity, price)
SELECT line_id, order_date, c.customer_id, product_name, quantity, price
FROM orders_1nf o
JOIN customers_2nf c ON c.customer_email = o.customer_email;

-- ═══════════════════════════════════════════════════════════════
-- TASK 2.3  ── Ana moves to Mumbai: ONE UPDATE now
-- TODO(you): write the UPDATE against customers_2nf, then verify
--            it propagated by selecting her order lines + join.
--            UPDATE _____________________________________________
-- ═══════════════════════════════════════════════════════════════
-- (write your UPDATE here, then run the join below)
SELECT o.line_id, c.customer_name, c.customer_city, o.product_name
FROM order_lines_2nf o
JOIN customers_2nf c ON c.customer_id = o.customer_id;

-- ═══════════════════════════════════════════════════════════════
-- STEP 3: 3NF -- 2NF + no transitive dependency
-- Rule: non-key columns must not depend on EACH OTHER.
-- Problem: price is a property of the PRODUCT, not of the line.
-- If 'Mouse' costs 20 everywhere, storing price per line is a
-- transitive dependency: line -> product_name -> price.
-- Fix: products live in their own table; the line stores a FK.
-- (If prices change over time you instead keep price as a
--  historical snapshot on the line -- a deliberate denormalization.)
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS products_3nf;
CREATE TABLE products_3nf (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL
);

INSERT INTO products_3nf (product_name, price) VALUES
  ('Laptop', 900.00), ('Mouse', 20.00),
  ('Keyboard', 40.00), ('USB-C Hub', 35.00);

DROP TABLE IF EXISTS order_lines_3nf;
CREATE TABLE order_lines_3nf (
  line_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  order_date DATE NOT NULL,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,          -- FK, not the name/price
  quantity INT NOT NULL,
  CONSTRAINT fk_3nf_customer FOREIGN KEY (customer_id)
    REFERENCES customers_2nf(customer_id),
  CONSTRAINT fk_3nf_product FOREIGN KEY (product_id)
    REFERENCES products_3nf(product_id)
);

INSERT INTO order_lines_3nf (order_id, order_date, customer_id, product_id, quantity)
SELECT o.order_id, o.order_date, o.customer_id, p.product_id, o.quantity
FROM order_lines_2nf o
JOIN products_3nf p ON p.product_name = o.product_name;

-- ═══════════════════════════════════════════════════════════════
-- TASK 2.4  ── prove 3NF: price now lives in ONE place
-- Run the join to rebuild the "flat" view on demand:
-- ═══════════════════════════════════════════════════════════════
SELECT
  ol.order_id,
  c.customer_name,
  p.product_name,
  ol.quantity,
  p.price,
  (ol.quantity * p.price) AS line_total
FROM order_lines_3nf ol
JOIN customers_2nf c ON c.customer_id = ol.customer_id
JOIN products_3nf  p ON p.product_id  = ol.product_id
ORDER BY ol.order_id;

-- TODO(you): how many places would you UPDATE if Mouse becomes 25?
--            (before = order_lines_2nf, after = products_3nf)
--            before: ______ rows   after: ______ rows

-- ═══════════════════════════════════════════════════════════════
-- TASK 2.5  ── summarise for your learning log
-- TODO(you): in one line each, define 1NF / 2NF / 3NF as YOU
--            now understand them (they go into LEARNING_LOG.md):
-- 1NF: ________________________________________________________
-- 2NF: ________________________________________________________
-- 3NF: ________________________________________________________
-- ═══════════════════════════════════════════════════════════════
