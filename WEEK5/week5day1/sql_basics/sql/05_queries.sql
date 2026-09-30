-- 05_queries.sql — hints only, write every query yourself
-- Tables: customers, addresses, categories, products, orders, order_items
USE shop_db;

-- TASK 5.1: accessories (category 'Accessories') name + price, cheapest first — JOIN categories, ORDER BY price

-- TASK 5.2: every order with customer full name + status — orders JOIN customers

-- TASK 5.3: per line: order_id, product, quantity, unit_price, line_total (= quantity * unit_price)

-- TASK 5.4: every customer + order count, incl. 0 orders — LEFT JOIN, COUNT + COALESCE, GROUP BY

-- TASK 5.5: products with total units > 2 — SUM(quantity), GROUP BY, HAVING

-- TASK 5.6: category + its parent name — self JOIN (categories LEFT JOIN categories parent)

-- TASK 5.7: customers who spent more than the average order total — subquery AVG(orders.total)

-- TASK 5.8: revenue by category — category_name | units_sold | revenue, ORDER BY revenue DESC

-- TASK 5.9: invent your own question and query it
