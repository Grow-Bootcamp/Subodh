-- ═══════════════════════════════════════════════════════════════
-- 01_create_database.sql
-- MySQL basics: server vs client, databases, selecting a DB
-- RUN ME FIRST (see README for how to connect)
-- ═══════════════════════════════════════════════════════════════

-- A MySQL server (mysqld process) can host many databases.
-- This is how you see them:
SHOW DATABASES;

-- The docker-compose.yml already creates shop_db via MYSQL_DATABASE,
-- but here is how you would create it yourself:
CREATE DATABASE IF NOT EXISTS shop_db;

-- Tell the client which database the following statements apply to.
-- Until you run this, every table statement below will fail with
-- "No database selected" (ER_NO_DB_ERROR).
USE shop_db;

-- After running 03_ecommerce_schema.sql, this is how you see your tables:
-- SHOW TABLES;

-- Peek at a table's structure (columns, types, keys, defaults):
-- DESCRIBE customers;

-- ═══════════════════════════════════════════════════════════════
-- TASK 1.1  ── server vs client, made concrete
-- Run:  SELECT @@hostname, @@port, version();
-- TODO(you): what does each value tell you? ______________________
-- ═══════════════════════════════════════════════════════════════
SELECT @@hostname, @@port, version();

-- ═══════════════════════════════════════════════════════════════
-- TASK 1.2  ── WHERE am I connected?
-- Run:  SELECT DATABASE();
-- TODO(you): paste result: _______________________________________
-- Expected: "shop_db" (NULL if you forgot USE shop_db; that is the
-- ER_NO_DB_ERROR scenario mentioned above)
-- ═══════════════════════════════════════════════════════════════
SELECT DATABASE();

-- ═══════════════════════════════════════════════════════════════
-- TASK 1.3  ── SQL statement anatomy
-- This SELECT has 4 clauses: SELECT (what), FROM (where from),
-- WHERE (filter), ORDER BY (sort).
-- Run it, then modify WHERE to only show age >= 25.
-- TODO(you): paste your modified query: ___________________________
-- ═══════════════════════════════════════════════════════════════
CREATE DATABASE IF NOT EXISTS scratch_pad;
USE scratch_pad;

CREATE TABLE demo (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  age  INT NOT NULL
);

INSERT INTO demo (name, age) VALUES ('Ada', 31), ('Linus', 24), ('Grace', 45);

SELECT name, age
FROM demo
WHERE age > 25
ORDER BY age DESC;

-- When done exploring, clean up the scratch database:
-- DROP DATABASE scratch_pad;
