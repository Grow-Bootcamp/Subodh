-- 01_schema.sql — e-commerce schema for the dashboard API (run FIRST)
-- Seeded with enough rows that GROUP BY and LIMIT behave like production.
USE commerce_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customers (
  customer_id INT NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(80) NOT NULL,
  email       VARCHAR(120) NOT NULL,
  city        VARCHAR(60)  NOT NULL,
  created_at  DATE NOT NULL,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uq_customers_email (email)
);

CREATE TABLE categories (
  category_id INT NOT NULL AUTO_INCREMENT,
  name        VARCHAR(60) NOT NULL,
  PRIMARY KEY (category_id),
  UNIQUE KEY uq_categories_name (name)
);

CREATE TABLE products (
  product_id  INT NOT NULL AUTO_INCREMENT,
  category_id INT NOT NULL,
  name        VARCHAR(120) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (product_id),
  KEY idx_products_category (category_id),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
);

CREATE TABLE orders (
  order_id    INT NOT NULL AUTO_INCREMENT,
  customer_id INT NOT NULL,
  status      ENUM('pending','paid','shipped','cancelled','refunded') NOT NULL,
  placed_at   DATETIME NOT NULL,
  PRIMARY KEY (order_id),
  KEY idx_orders_customer (customer_id),
  KEY idx_orders_placed_status (placed_at, status),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id)
    REFERENCES customers (customer_id)
);

CREATE TABLE order_items (
  order_item_id INT NOT NULL AUTO_INCREMENT,
  order_id      INT NOT NULL,
  product_id    INT NOT NULL,
  quantity      INT NOT NULL,
  unit_price    DECIMAL(10,2) NOT NULL,  -- price SNAPSHOT at sale time (denormalised on purpose)
  PRIMARY KEY (order_item_id),
  KEY idx_items_order (order_id),
  KEY idx_items_product (product_id),
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders (order_id),
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products (product_id),
  CONSTRAINT chk_items_quantity CHECK (quantity > 0)
);

INSERT INTO categories (name) VALUES
  ('Electronics'), ('Apparel'), ('Books'), ('Home'), ('Beauty'), ('Sports');

INSERT INTO customers (full_name, email, city, created_at)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 50)
SELECT
  CONCAT('Customer ', lpad(n, 3, '0')),
  CONCAT('cust', lpad(n, 3, '0'), '@example.com'),
  ELT(1 + (n MOD 6), 'Pune', 'Delhi', 'Bengaluru', 'Mumbai', 'Kolkata', 'Chennai'),
  DATE_ADD('2023-01-01', INTERVAL (n MOD 600) DAY)
FROM seq;

INSERT INTO products (category_id, name, price, stock, is_active)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 200)
SELECT
  1 + (n MOD 6),
  CONCAT('Product ', lpad(n, 3, '0')),
  ROUND(199 + 50 * (n MOD 17) + (n MOD 3) * 0.99, 2),
  5 + (n MOD 40),
  IF(n MOD 25 = 0, 0, 1)          -- every 25th product is discontinued
FROM seq;

INSERT INTO orders (customer_id, status, placed_at)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 400)
SELECT
  1 + (n MOD 50),
  ELT(1 + (n MOD 5), 'paid', 'shipped', 'pending', 'cancelled', 'refunded'),
  DATE_SUB(NOW(), INTERVAL (n MOD 400) DAY) - INTERVAL (n MOD 20) HOUR
FROM seq;

-- 1200 lines ≈ 3 items per order
SET SESSION cte_max_recursion_depth = 5000;   -- default is 1000; our CTE walks to 1200
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 1200)
SELECT
  1 + ((n - 1) DIV 3),
  1 + (n MOD 200),
  1 + (n MOD 3),
  (SELECT price FROM products WHERE product_id = 1 + (n MOD 200))
FROM seq;

SELECT
  (SELECT COUNT(*) FROM customers)  AS customers,
  (SELECT COUNT(*) FROM products)   AS products,
  (SELECT COUNT(*) FROM orders)     AS orders,
  (SELECT COUNT(*) FROM order_items) AS order_items;

-- TASK 1.1: why does order_items.unit_price exist when products.price does?
--           What breaks in a report if you always join products.price?
-- TODO(you):
