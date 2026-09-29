-- ═══════════════════════════════════════════════════════════════
-- 03_ecommerce_schema.sql
-- The FINAL normalized schema for the sample use case:
--   an e-commerce store (shop_db)
-- Constraints demonstrated: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL
-- This file is ready to run as-is (after 01 and 02).
-- ═══════════════════════════════════════════════════════════════

USE shop_db;

-- Clean slate so the file is re-runnable.
-- Order matters for FKs: children (many-side) are dropped first.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;

-- ───────────────────────────────────────────────────────────────
-- 1. customers  (the "1" side of customer -> orders)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE customers (
  customer_id INT          NOT NULL AUTO_INCREMENT,
  first_name  VARCHAR(50)  NOT NULL,             -- NOT NULL: can't sign up nameless
  last_name   VARCHAR(50)  NOT NULL,
  email       VARCHAR(120) NOT NULL,             -- NOT NULL: login identity
  phone       VARCHAR(20)           DEFAULT NULL, -- optional -> nullable allowed
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),                      -- PK: unique row identifier
  UNIQUE KEY uq_customers_email (email)           -- UNIQUE: no two accounts, one email
) ENGINE=InnoDB;

-- ───────────────────────────────────────────────────────────────
-- 2. addresses  (a customer may have many addresses: 1:N)
-- The FK makes this a relational link, not a copied column.
-- ───────────────────────────────────────────────────────────────
CREATE TABLE addresses (
  address_id   INT         NOT NULL AUTO_INCREMENT,
  customer_id  INT         NOT NULL,             -- NOT NULL: every address has an owner
  label        VARCHAR(30) NOT NULL DEFAULT 'home',
  street       VARCHAR(120) NOT NULL,
  city         VARCHAR(60)  NOT NULL,
  postal_code  VARCHAR(10)  NOT NULL,
  is_default   TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (address_id),
  CONSTRAINT fk_addresses_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE                            -- deleting customer removes their addresses
) ENGINE=InnoDB;

-- ───────────────────────────────────────────────────────────────
-- 3. categories  (self-referencing FK: a category can have a parent)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE categories (
  category_id   INT         NOT NULL AUTO_INCREMENT,
  name          VARCHAR(60) NOT NULL,
  parent_id     INT                  DEFAULT NULL, -- NULL = top-level category
  PRIMARY KEY (category_id),
  UNIQUE KEY uq_categories_name (name),
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(category_id)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────────────────────────
-- 4. products  (many products : one category)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE products (
  product_id  INT           NOT NULL AUTO_INCREMENT,
  category_id INT           NOT NULL,            -- NOT NULL: unclassified product rejected
  sku         VARCHAR(40)   NOT NULL,            -- stock code: business key
  name        VARCHAR(120)  NOT NULL,
  price       DECIMAL(10,2) NOT NULL,            -- DECIMAL not FLOAT: money!
  stock       INT           NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id),
  UNIQUE KEY uq_products_sku (sku),              -- UNIQUE: one row per SKU
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
  CONSTRAINT chk_products_price CHECK (price >= 0)  -- bonus: CHECK constraint
) ENGINE=InnoDB;

-- ───────────────────────────────────────────────────────────────
-- 5. orders  (one customer : many orders)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE orders (
  order_id    INT           NOT NULL AUTO_INCREMENT,
  customer_id INT           NOT NULL,            -- NOT NULL: anonymous orders rejected
  ship_address_id INT                DEFAULT NULL,
  order_date  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status      ENUM('pending','paid','shipped','cancelled') NOT NULL DEFAULT 'pending',
  total       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (order_id),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_orders_address
    FOREIGN KEY (ship_address_id) REFERENCES addresses(address_id)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────────────────────────
-- 6. order_items  (the LINKING table: many orders x many products)
-- Composite UNIQUE stops the same product being added twice to
-- one order; quantity lives here, price is the historical snapshot.
-- ───────────────────────────────────────────────────────────────
CREATE TABLE order_items (
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL,             -- NOT NULL: qty 0 makes no sense
  unit_price DECIMAL(10,2) NOT NULL,             -- snapshot at purchase time
  PRIMARY KEY (order_id, product_id),            -- composite PK (surrogate-free)
  UNIQUE KEY uq_order_items (order_id, product_id),
  CONSTRAINT fk_items_order
    FOREIGN KEY (order_id)   REFERENCES orders(order_id)   ON DELETE CASCADE,
  CONSTRAINT fk_items_product
    FOREIGN KEY (product_id) REFERENCES products(product_id),
  CONSTRAINT chk_items_quantity CHECK (quantity > 0)
) ENGINE=InnoDB;

-- ═══════════════════════════════════════════════════════════════
-- SEE what you just created (do these in VS Code's SQL editor):
--   SHOW TABLES;                 -- 6 tables under shop_db
--   DESCRIBE order_items;        -- types + keys per column
--   SHOW CREATE TABLE orders;    -- the exact DDL, incl. constraint names
--
-- TASK 3.1  ── map constraint -> table
-- For EACH table, list which columns are PK / FK / UNIQUE / NOT NULL.
-- TODO(you): fill this into LEARNING_LOG.md's constraint matrix.
--
-- TASK 3.2  ── ER diagram
-- In VS Code's sidebar, expand every table and view its columns.
-- TODO(you): sketch (or screenshot) the ER relationship diagram:
--   customers 1 ──< addresses N
--   customers 1 ──< orders N ──< order_items N >── products N >──(1) categories
-- ═══════════════════════════════════════════════════════════════
