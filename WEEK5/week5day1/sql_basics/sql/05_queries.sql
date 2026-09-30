-- 05_queries.sql — hints only, write every query yourself
-- Tables: customers, addresses, categories, products, orders, order_items
USE shop_db;

-- TASK 5.1: accessories (category 'Accessories') name + price, cheapest first — JOIN categories, ORDER BY price
SELECT c.name as category, p.name as product, p.price, p.stock, (p.price * p.stock) as total_amount 
FROM categories c JOIN products p 
ON c.category_id = p.category_id 
WHERE c.name="Electronics"
ORDER BY p.price; 


SELECT COUNT(c.name) as category_count, SUM(p.price) as total_category_amount
FROM categories c JOIN products p ON c.category_id=p.category_id 
GROUP BY c.category_id;

SELECT GROUP_CONCAT(c.name), GROUP_CONCAT(p.name)
FROM categories c JOIN products p ON c.category_id=p.category_id 
GROUP BY c.category_id;

SELECT * FROM products WHERE category_id IN (1, 2, 3);
SELECT * FROM products WHERE category_id IN (1, 2, 3) ORDER BY price DESC;
SELECT * FROM products WHERE category_id IN (1, 2, 3) ORDER BY category_id;
SELECT * FROM products WHERE category_id IN (1, 2, 3) ORDER BY category_id, price DESC, stock ;
SELECT * FROM products WHERE category_id IN (1, 2, 3) ORDER BY category_id, stock , price DESC;
SELECT * FROM products WHERE category_id IN (1, 2, 3) ORDER BY stock, category_id,  price DESC;

EXPLAIN SELECT * FROM products WHERE category_id IN (1, 2, 3) ORDER BY category_id, price DESC;
SELECT * FROM products WHERE category_id IN (1, 2, 3) ORDER BY category_id, price DESC;
EXPLAIN 
(SELECT * FROM products WHERE category_id= 1)
UNION
(SELECT * FROM products WHERE category_id= 2)
UNION
(SELECT * FROM products WHERE category_id= 3)
ORDER BY category_id, stock DESC;

(SELECT * FROM products WHERE category_id= 1)
UNION
(SELECT * FROM products WHERE category_id= 2)
UNION
(SELECT * FROM products WHERE category_id= 3)
ORDER BY category_id, stock DESC;


UPDATE products SET stock = 100 WHERE category_id = 1 AND sku = "SKU-ELE-005";

SELECT c.name as category, SUM(p.price) as total_stock_amount
FROM categories c JOIN products p 
ON c.category_id = p.category_id 
WHERE c.name="Electronics"
GROUP BY c.name;


SELECT * FROM categories;
SELECT * FROM products;

-- TASK 5.2: every order with customer full name + status — orders JOIN customers
SELECT o.order_id, o.status, CONCAT(c.first_name," ", c.last_name) as customer_name
FROM orders o JOIN customers c ON o.customer_id=c.customer_id;

SELECT  
CONCAT(c.first_name," ", c.last_name) as customer_name,
GROUP_CONCAT(o.order_id) as orders, 
GROUP_CONCAT(o.status) as status
FROM orders o JOIN customers c 
ON o.customer_id=c.customer_id 
GROUP BY CONCAT(c.first_name," ", c.last_name);

SELECT 
GROUP_CONCAT(CONCAT(c.first_name," ", c.last_name)) as customer_name,
GROUP_CONCAT(o.order_id) as order_id,
o.status
FROM customers c JOIN orders o ON c.customer_id=o.customer_id
GROUP BY o.status
;

INSERT INTO orders(customer_id, ship_address_id,status,total) VALUES(1, 3, "paid", 500.00);
INSERT INTO orders(customer_id, ship_address_id,status,total) VALUES(2, 1, "paid", 300.00);


-- TASK 5.3: per line: order_id, product, quantity, unit_price, line_total (= quantity * unit_price)

-- TASK 5.4: every customer + order count, incl. 0 orders — LEFT JOIN, COUNT + COALESCE, GROUP BY

-- TASK 5.5: products with total units > 2 — SUM(quantity), GROUP BY, HAVING

-- TASK 5.6: category + its parent name — self JOIN (categories LEFT JOIN categories parent)

-- TASK 5.7: customers who spent more than the average order total — subquery AVG(orders.total)

-- TASK 5.8: revenue by category — category_name | units_sold | revenue, ORDER BY revenue DESC

-- TASK 5.9: invent your own question and query it
