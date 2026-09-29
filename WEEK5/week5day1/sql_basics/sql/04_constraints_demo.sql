-- 04_constraints_demo.sql — every "should fail" insert must fail
USE shop_db;

-- Section A: happy path (run first)
INSERT INTO customers (first_name, last_name, email, phone)
VALUES ('Ana', 'Rao', 'ana@example.com', '9876543210'),
       ('Ben', 'Khan', 'ben@example.com', NULL);

INSERT INTO addresses (customer_id, label, street, city, postal_code, is_default)
VALUES (1, 'home', '12 MG Road', 'Pune', '411001', 1),
       (1, 'office', '5 FC Road', 'Pune', '411004', 0),
       (2, 'home', '9 Connaught Pl', 'Delhi', '110001', 1);

INSERT INTO categories (name, parent_id) VALUES ('Electronics', NULL);
INSERT INTO categories (name, parent_id) VALUES ('Laptops', 1);
INSERT INTO categories (name, parent_id) VALUES ('Accessories', 1);

INSERT INTO products (category_id, sku, name, price, stock)
VALUES (2, 'SKU-LAP-001', 'AeroBook 14', 900.00, 10),
       (3, 'SKU-MSE-001', 'Glide Mouse',  20.00, 50),
       (3, 'SKU-KBD-001', 'TypePro KB',   40.00, 30);

INSERT INTO orders (customer_id, ship_address_id, status, total)
VALUES (1, 1, 'pending', 960.00),
       (2, 3, 'paid',    80.00);

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 1, 1, 900.00),
       (1, 2, 3,  20.00),
       (2, 3, 2,  40.00);

-- TASK 4.1: UNIQUE — run twice, 2nd must fail (ER_DUP_ENTRY, uq_customers_email)
INSERT INTO customers (first_name, last_name, email)
VALUES ('Ana', 'Rao', 'ana@example.com');

-- TASK 4.2: PRIMARY KEY — duplicate customer_id (ER_DUP_ENTRY on PRIMARY)
INSERT INTO customers (customer_id, first_name, last_name, email)
VALUES (1, 'Ghost', 'User', 'ghost@example.com');

-- TASK 4.3: FK orphan order — order 999 doesn't exist (ER_NO_REFERENCED_ROW_2)
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (999, 1, 1, 900.00);

-- TASK 4.4: FK orphan product — product 777 doesn't exist
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 777, 1, 5.00);

-- TASK 4.5: NOT NULL — email omitted (ER_BAD_NULL_ERROR / ER_NO_DEFAULT_FOR_FIELD)
INSERT INTO customers (first_name, last_name)
VALUES ('NoEmail', 'Person');

-- TASK 4.6: CHECK — quantity must be > 0 (ER_CHECK_CONSTRAINT_VIOLATED)
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 1, 0, 900.00);

-- TASK 4.7: FK protection — deleting a customer with orders must fail (ER_ROW_IS_REFERENCED_2)
DELETE FROM customers WHERE customer_id = 2;

-- then a customer with no orders must delete fine
INSERT INTO customers (first_name, last_name, email)
VALUES ('Temp', 'User', 'temp@example.com');
DELETE FROM customers WHERE email = 'temp@example.com';
