-- 02_normalization_walkthrough.sql — flat table -> 1NF -> 2NF -> 3NF
USE shop_db;

-- STEP 0: denormalized mess
DROP TABLE IF EXISTS orders_flat;
CREATE TABLE orders_flat (
  order_id       INT,
  order_date     DATE,
  customer_name  VARCHAR(100),
  customer_email VARCHAR(100),
  customer_city  VARCHAR(60),
  products       VARCHAR(255),
  quantities     VARCHAR(50),
  prices         VARCHAR(50),
  order_total    DECIMAL(10,2)
);

INSERT INTO orders_flat VALUES
  (1, '2026-09-01', 'Ana Rao',  'ana@example.com', 'Pune',
   'Laptop,Mouse', '1,3', '900.00,20.00', 960.00),
  (1, '2026-09-01', 'Ana Rao',  'ana@example.com', 'Pune',
   'Laptop,Mouse', '1,3', '900.00,20.00', 960.00),
  (2, '2026-09-03', 'Ben Khan', 'ben@example.com', 'Delhi',
   'Keyboard', '2', '40.00', 80.00),
  (3, '2026-09-05', 'Ana Rao',  'ana@example.com', 'Pune',
   'Mouse,USB-C Hub', '1,1', '20.00,35.00', 55.00);

-- TASK 2.1: inspect duplicates, find orders containing 'Mouse' (LIKE),
--           count rows to update if Ana moves city
SELECT * FROM orders_flat;

SELECT order_id, COUNT(*) AS copies
FROM orders_flat
GROUP BY order_id
HAVING COUNT(*) > 1;

SELECT COUNT(*) AS rows_to_patch
FROM orders_flat
WHERE customer_email = 'ana@example.com';

-- STEP 1: 1NF — one value per cell, one product per row
DROP TABLE IF EXISTS orders_1nf;
CREATE TABLE orders_1nf (
  line_id        INT PRIMARY KEY AUTO_INCREMENT,
  order_id       INT,
  order_date     DATE,
  customer_name  VARCHAR(100),
  customer_email VARCHAR(100),
  customer_city  VARCHAR(60),
  product_name   VARCHAR(100),
  quantity       INT,
  price          DECIMAL(10,2)
);

INSERT INTO orders_1nf
  (order_id, order_date, customer_name, customer_email, customer_city, product_name, quantity, price)
VALUES
  (1, '2026-09-01', 'Ana Rao',  'ana@example.com', 'Pune',  'Laptop',    1, 900.00),
  (1, '2026-09-01', 'Ana Rao',  'ana@example.com', 'Pune',  'Mouse',     3,  20.00),
  (2, '2026-09-03', 'Ben Khan', 'ben@example.com', 'Delhi', 'Keyboard',  2,  40.00),
  (3, '2026-09-05', 'Ana Rao',  'ana@example.com', 'Pune',  'Mouse',     1,  20.00),
  (3, '2026-09-05', 'Ana Rao',  'ana@example.com', 'Pune',  'USB-C Hub', 1,  35.00);

-- TASK 2.2: Mouse query is easy now; customer data still repeats
SELECT DISTINCT order_id FROM orders_1nf WHERE product_name = 'Mouse';

SELECT customer_email, COUNT(*) AS repeated
FROM orders_1nf
GROUP BY customer_email
HAVING COUNT(*) > 1;

-- STEP 2: 2NF — remove partial dependency (customer facts pulled out)
DROP TABLE IF EXISTS customers_2nf;
CREATE TABLE customers_2nf (
  customer_id    INT PRIMARY KEY AUTO_INCREMENT,
  customer_name  VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL UNIQUE,
  customer_city  VARCHAR(60) NOT NULL
);

INSERT INTO customers_2nf (customer_name, customer_email, customer_city) VALUES
  ('Ana Rao',  'ana@example.com', 'Pune'),
  ('Ben Khan', 'ben@example.com', 'Delhi');

DROP TABLE IF EXISTS order_lines_2nf;
CREATE TABLE order_lines_2nf (
  line_id     INT PRIMARY KEY AUTO_INCREMENT,
  order_id    INT NOT NULL,
  order_date  DATE NOT NULL,
  customer_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity    INT NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_2nf_customer FOREIGN KEY (customer_id)
    REFERENCES customers_2nf(customer_id)
);

INSERT INTO order_lines_2nf (order_id, order_date, customer_id, product_name, quantity, price)
SELECT line_id, order_date, c.customer_id, product_name, quantity, price
FROM orders_1nf o
JOIN customers_2nf c ON c.customer_email = o.customer_email;

-- TASK 2.3: update Ana's city once (UPDATE customers_2nf ...), then verify via join
SELECT o.line_id, c.customer_name, c.customer_city, o.product_name
FROM order_lines_2nf o
JOIN customers_2nf c ON c.customer_id = o.customer_id;

-- STEP 3: 3NF — remove transitive dependency (price pulled out)
DROP TABLE IF EXISTS products_3nf;
CREATE TABLE products_3nf (
  product_id   INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL UNIQUE,
  price        DECIMAL(10,2) NOT NULL
);

INSERT INTO products_3nf (product_name, price) VALUES
  ('Laptop', 900.00), ('Mouse', 20.00),
  ('Keyboard', 40.00), ('USB-C Hub', 35.00);

DROP TABLE IF EXISTS order_lines_3nf;
CREATE TABLE order_lines_3nf (
  line_id     INT PRIMARY KEY AUTO_INCREMENT,
  order_id    INT NOT NULL,
  order_date  DATE NOT NULL,
  customer_id INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL,
  CONSTRAINT fk_3nf_customer FOREIGN KEY (customer_id)
    REFERENCES customers_2nf(customer_id),
  CONSTRAINT fk_3nf_product FOREIGN KEY (product_id)
    REFERENCES products_3nf(product_id)
);

INSERT INTO order_lines_3nf (order_id, order_date, customer_id, product_id, quantity)
SELECT o.order_id, o.order_date, o.customer_id, p.product_id, o.quantity
FROM order_lines_2nf o
JOIN products_3nf p ON p.product_name = o.product_name;

-- TASK 2.4: rebuild the flat view; price now lives in one place
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
