-- ═══════════════════════════════════════════════════════════════
-- 04_constraints_demo.sql
-- CONSTRAINTS ARE THE POINT OF THIS FILE -- and the DB, not your
-- app, is the last line of defence.
-- YOU run these. Each TASK tells you what should happen.
-- Paste your observed errors into the TODO slots.
-- ═══════════════════════════════════════════════════════════════

USE shop_db;

-- ═══════════════════════════════════════════════════════════════
-- ── SECTION A: happy path -- these MUST all succeed ──────────
-- Run SECTION A as a block first, so later sections have data.
-- ═══════════════════════════════════════════════════════════════
INSERT INTO customers (first_name, last_name, email, phone)
VALUES ('Ana', 'Rao', 'ana@example.com', '9876543210'),
       ('Ben', 'Khan', 'ben@example.com', NULL);   -- phone NULL is allowed

INSERT INTO addresses (customer_id, label, street, city, postal_code, is_default)
VALUES (1, 'home', '12 MG Road', 'Pune', '411001', 1),
       (1, 'office', '5 FC Road', 'Pune', '411004', 0),
       (2, 'home', '9 Connaught Pl', 'Delhi', '110001', 1);

INSERT INTO categories (name, parent_id) VALUES ('Electronics', NULL);
INSERT INTO categories (name, parent_id) VALUES ('Laptops', 1);
INSERT INTO categories (name, parent_id) VALUES ('Accessories', 1);

INSERT INTO products (category_id, sku, name, price, stock)
VALUES (2, 'SKU-LAP-001', 'AeroBook 14',  900.00, 10),
       (3, 'SKU-MSE-001', 'Glide Mouse',   20.00, 50),
       (3, 'SKU-KBD-001', 'TypePro KB',    40.00, 30);

INSERT INTO orders (customer_id, ship_address_id, status, total)
VALUES (1, 1, 'pending', 960.00),
       (2, 3, 'paid',    80.00);

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 1, 1, 900.00),
       (1, 2, 3,  20.00),
       (2, 3, 2,  40.00);

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.1 (UNIQUE)  ── duplicate email
-- Run the insert TWICE. EXPECTED: 1st succeeds, 2nd fails with
-- ER_DUP_ENTRY (error 1062), citing key 'uq_customers_email'.
-- TODO(you): paste your exact error: ____________________________
-- ═══════════════════════════════════════════════════════════════
INSERT INTO customers (first_name, last_name, email)
VALUES ('Ana', 'Rao', 'ana@example.com');
-- run me again → should fail:
INSERT INTO customers (first_name, last_name, email)
VALUES ('Ana2', 'Rao2', 'ana@example.com');

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.2 (PRIMARY KEY)  ── duplicate PK
-- EXPECTED: ER_DUP_ENTRY on 'PRIMARY' (customer_id 1 already exists
-- because AUTO_INCREMENT wants to reuse it after our manual inserts).
-- TODO(you): paste your exact error: ____________________________
-- ═══════════════════════════════════════════════════════════════
INSERT INTO customers (customer_id, first_name, last_name, email)
VALUES (1, 'Ghost', 'User', 'ghost@example.com');

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.3 (FOREIGN KEY -- orphan row)  ── parent that doesn't exist
-- order_id 999 has no parent row in orders.
-- EXPECTED: ER_NO_REFERENCED_ROW_2 (1452): cannot add/update child,
-- a foreign key constraint fails.
-- TODO(you): paste your exact error: ____________________________
-- ═══════════════════════════════════════════════════════════════
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (999, 1, 1, 900.00);

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.4 (FOREIGN KEY -- invalid parent column)  ── product 777
-- EXPECTED: same ER_NO_REFERENCED_ROW_2, key 'fk_items_product'.
-- TODO(you): paste your exact error: ____________________________
-- ═══════════════════════════════════════════════════════════════
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 777, 1, 5.00);

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.5 (NOT NULL)  ── omit a required column
-- email is NOT NULL and has no DEFAULT.
-- EXPECTED: ER_BAD_NULL_ERROR (1048) or ER_NO_DEFAULT_FOR_FIELD (1364)
-- depending on SQL mode.
-- TODO(you): paste your exact error: ____________________________
-- ═══════════════════════════════════════════════════════════════
INSERT INTO customers (first_name, last_name)
VALUES ('NoEmail', 'Person');

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.6 (CHECK)  ── break a business rule
-- quantity > 0 is a CHECK constraint.
-- EXPECTED: ER_CHECK_CONSTRAINT_VIOLATED (3819).
-- TODO(you): paste your exact error: ____________________________
-- ═══════════════════════════════════════════════════════════════
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 1, 0, 900.00);

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.7 (ON DELETE CASCADE)  ── watch FKs clean up
-- Delete customer Ben (id 2) then check his rows are gone.
-- EXPECTED: his orders (via default behaviour) ... actually orders
-- use plain FK (RESTRICT/NO ACTION) so deleting a customer WITH
-- orders should FAIL with ER_ROW_IS_REFERENCED_2 (1451).
-- That's the difference: CASCADE cleans children, plain FK protects.
-- TODO(you): paste your exact error: ____________________________
-- ═══════════════════════════════════════════════════════════════
DELETE FROM customers WHERE customer_id = 2;

-- Now try a customer with NO orders -- insert one, delete it:
INSERT INTO customers (first_name, last_name, email)
VALUES ('Temp', 'User', 'temp@example.com');
DELETE FROM customers WHERE email = 'temp@example.com';
-- TODO(you): did this second delete succeed? ____________________

-- ═══════════════════════════════════════════════════════════════
-- TASK 4.8  ── CONSTRAINT MATRIX (goes in LEARNING_LOG.md)
-- TODO(you): fill one row per table:
--   | table | PK | FK(s) | UNIQUE | NOT NULL | CHECK |
--   |-------|----|-------|--------|----------|-------|
--   | customers | customer_id | -- | email | first_name,last_name,email | -- |
--   | addresses | ... | ... | ... | ... | ... |
--   | categories | ... | ... | ... | ... | ... |
--   | products   | ... | ... | ... | ... | ... |
--   | orders     | ... | ... | ... | ... | ... |
--   | order_items| ... | ... | ... | ... | ... |
-- ═══════════════════════════════════════════════════════════════

-- Reset any test damage when you are done (optional):
-- DELETE FROM customers WHERE email = 'temp@example.com';
-- FLUSH TABLES;  -- not needed, just showing another command
