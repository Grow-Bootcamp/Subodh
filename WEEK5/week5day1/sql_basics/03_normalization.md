# 03 — Relational modelling & normalization (1NF, 2NF, 3NF)

## Why normalize?

Because of **anomalies** — bad things that happen when data is duplicated:

| Anomaly | What goes wrong | Example (flat `orders_flat` table) |
|---|---|---|
| **Update** | change repeated data in N places, miss one | Ana moves city → UPDATE 4 rows |
| **Insert** | can't store data without other data | Can't add a customer who hasn't ordered |
| **Delete** | deleting removes data you still need | Cancel last order → lose the customer |

> Normalization = **eliminate redundancy by giving each fact ONE home**,
> then re-deriving the rest with JOINs when needed.

## Entities, attributes, relationships

```text
entity      = a thing you store     (customer, product, order)
attribute   = a property of it      (email, price, order_date)
relationship= how entities link     (a customer PLACES orders)
```

Cardinality shorthand used everywhere:

```text
customers 1 ────< orders N      one customer has many orders
products  N >──── order_items N ────< orders N    many-to-many (via link table)
```

A **foreign key** is the physical implementation of that line.

## The normal forms

### 1NF — atomic values, no repeating groups
**Rule:** every column holds a single indivisible value; no comma-separated
lists, no multi-valued columns, and each row is unique.

```text
❌ products = "Laptop,Mouse"      ✅ one row per product line
❌ quantities = "1,3"             ✅ quantity = 1  |  quantity = 3
```

### 2NF — 1NF + no partial dependency
**Rule:** every non-key column must depend on the **whole** primary key.
(Only matters when the PK is composite.)

```text
With PK = (order_id, product_id):
❌ customer_city  depends on customer only   → partial dependency
✅ quantity       depends on the whole PK    → fine
```
Fix: move customer data into a `customers` table keyed by `customer_id`.

### 3NF — 2NF + no transitive dependency
**Rule:** non-key columns must not depend on **each other**.

```text
line → product_name → price     (price is really a property of the product)
❌ store price on every line     ✅ price lives on products; line stores FK
```
Fix: `products(product_id, name, price)` + `order_items(..., product_id FK, qty)`.

### One-line summaries (memorise these for your log)

```text
1NF: no repeating groups — one value per cell, one fact per row
2NF: no partial dependency — non-key columns depend on the WHOLE key
3NF: no transitive dependency — non-key columns depend only on the key, not on each other
```

Memory aid: **"The key, the whole key, and nothing but the key — so help me Codd."**

## Worked example in this repo

`sql/02_normalization_walkthrough.sql` does the full journey on purpose:

```text
orders_flat   (0NF: comma-separated lists, duplicates)
   ↓ split into lines            → orders_1nf        (1NF)
   ↓ pull out customer            → customers_2nf
                                    order_lines_2nf   (2NF)
   ↓ pull out product+price       → products_3nf
                                    order_lines_3nf   (3NF)
```

Each step has a TASK: run the query, observe the anomaly disappear,
record what you saw.

## When is "enough" reached?

Industry practice: **3NF is the default target for transactional systems**.
You may deliberately **de-normalise** (accept redundancy) when:

- reading speed matters more than storage (reporting/data warehouses),
- you need a historical snapshot — note `order_items.unit_price` in our schema
  keeps the price *at purchase time* even if the product's price changes later.

That is a **deliberate, documented** exception — not a modelling mistake.

## Relational modelling process (use for any use case)

1. List the **nouns** (entities): customer, address, product, category, order.
2. List the **verbs** (relationships): customer *has* address, order *contains* item.
3. Decide cardinality: 1:1, 1:N, N:M (N:M → link table).
4. Give each entity a **primary key**; add **foreign keys** on the N side.
5. Apply 1NF → 2NF → 3NF tests.
6. Add constraints (next doc) and only then write queries.

## Try this (research)

- Take the flat table at the top of `sql/02_...sql` and draw its ER diagram
  *before* normalization, then after. What disappeared?
- Answer TASK 2.5 (define 1NF/2NF/3NF in your own words) for your log.

## Checklist

- [ ] Can name all three anomalies and give an example of each
- [ ] Can state 1NF/2NF/3NF rules in one sentence each
- [ ] Can spot a partial vs. transitive dependency in a table
- [ ] Can explain why `order_items.unit_price` is an accepted exception
