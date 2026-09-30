-- 03_ecommerce_schema.sql — shop schema with PK / FK / UNIQUE / NOT NULL
USE shop_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customers (
  customer_id INT          NOT NULL AUTO_INCREMENT,
  first_name  VARCHAR(50)  NOT NULL,
  last_name   VARCHAR(50)  NOT NULL,
  email       VARCHAR(120) NOT NULL,
  phone       VARCHAR(20)           DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uq_customers_email (email)
);

CREATE TABLE addresses (
  address_id  INT         NOT NULL AUTO_INCREMENT,
  customer_id INT         NOT NULL,
  label       VARCHAR(30) NOT NULL DEFAULT 'home',
  street      VARCHAR(120) NOT NULL,
  city        VARCHAR(60)  NOT NULL,
  postal_code VARCHAR(10)  NOT NULL,
  is_default  TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (address_id),
  CONSTRAINT fk_addresses_customer FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE categories (
  category_id INT         NOT NULL AUTO_INCREMENT,
  name        VARCHAR(60) NOT NULL,
  parent_id   INT                  DEFAULT NULL,
  PRIMARY KEY (category_id),
  UNIQUE KEY uq_categories_name (name),
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id)
    REFERENCES categories(category_id)
);

CREATE TABLE products (
  product_id  INT           NOT NULL AUTO_INCREMENT,
  category_id INT           NOT NULL,
  sku         VARCHAR(40)   NOT NULL,
  name        VARCHAR(120)  NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INT           NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id),
  UNIQUE KEY uq_products_sku (sku),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES categories(category_id),
  CONSTRAINT chk_products_price CHECK (price >= 0)
);

CREATE TABLE orders (
  order_id        INT           NOT NULL AUTO_INCREMENT,
  customer_id     INT           NOT NULL,
  ship_address_id INT                    DEFAULT NULL,
  order_date      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status          ENUM('pending','paid','shipped','cancelled') NOT NULL DEFAULT 'pending',
  total           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (order_id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id),
  CONSTRAINT fk_orders_address FOREIGN KEY (ship_address_id)
    REFERENCES addresses(address_id)
);

CREATE TABLE order_items (
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  UNIQUE KEY uq_order_items (order_id, product_id),
  CONSTRAINT fk_items_order FOREIGN KEY (order_id)
    REFERENCES orders(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id)
    REFERENCES products(product_id),
  CONSTRAINT chk_items_quantity CHECK (quantity > 0)
);

-- TASK 3.1: SHOW TABLES / DESCRIBE each table, map PK / FK / UNIQUE / NOT NULL
-- TASK 3.2: sketch the ER diagram from the sidebar column tree
