-- 01_create_database.sql — MySQL basics
SHOW DATABASES;

CREATE DATABASE IF NOT EXISTS shop_db;
USE shop_db;

-- TASK 1.1: server vs client
SELECT @@hostname, @@port, version();

-- TASK 1.2: current database (expect shop_db)
SELECT DATABASE();

-- TASK 1.3: SQL anatomy (SELECT/FROM/WHERE/ORDER BY) — change WHERE to age >= 25
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

-- DROP DATABASE scratch_pad;
