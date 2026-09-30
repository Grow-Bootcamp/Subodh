# 04 — Schema design & constraints (PK, FK, UNIQUE, NOT NULL)

A **schema** is the blueprint: tables, columns, types, and the *rules* the
database promises to enforce. Those rules are **constraints**.

## The four constraints (plus one bonus)

| Constraint | Guarantees | MySQL syntax | Fails with |
|---|---|---|---|
| **PRIMARY KEY** | row is uniquely identifiable; never NULL | `PRIMARY KEY (id)` | `ER_DUP_ENTRY` (1062) |
| **FOREIGN KEY** | referenced row actually exists (referential integrity) | `FOREIGN KEY (c_id) REFERENCES t(id)` | `ER_NO_REFERENCED_ROW_2` (1452) |
| **UNIQUE** | no two rows share this value; NULLs usually allowed | `UNIQUE KEY uq_email (email)` | `ER_DUP_ENTRY` (1062) |
| **NOT NULL** | column cannot be omitted/empty | `email VARCHAR(120) NOT NULL` | `ER_BAD_NULL_ERROR` (1048) |
| **CHECK** (bonus) | value passes an expression | `CHECK (quantity > 0)` | `ER_CHECK_CONSTRAINT_VIOLATED` (3819) |

### PK vs UNIQUE — the difference that trips people up

```text
PRIMARY KEY : one per table · NOT NULL implied · identifies the row
UNIQUE      : many per table · NULLs allowed    · prevents duplicates in a column
```
`email UNIQUE` but `customer_id PRIMARY KEY` — both prevent duplicates, but
only the PK *identifies* the row and only the PK can't be NULL.

### FK behaviour options

```sql
ON DELETE CASCADE    -- delete parent → children auto-deleted
ON DELETE SET NULL   -- delete parent → child's FK becomes NULL
ON DELETE RESTRICT   -- (default-ish) block deletion if children exist
```
Our schema deliberately mixes them: `addresses` cascade with the customer,
`orders` are protected (deleting a customer with orders must fail).

### Constraints are enforced by the DATABASE, not your app

Application validation can be bypassed (bug, migration, another client, a
direct CLI session). The DB is the last line of defence — that's why
`sql/04_constraints_demo.sql` is full of inserts that are *supposed to fail*.

## Designing a schema (method)

1. **Entities** → tables (`customers`, `products`, `orders`).
2. **Attributes** → columns with the right datatypes (`DECIMAL` for money!).
3. **Primary key** per table — usually a surrogate `INT AUTO_INCREMENT`,
   or a natural composite key when the pair itself is unique
   (`order_items` = `order_id + product_id`).
4. **Foreign keys** on the many side of each relationship.
5. **UNIQUE** on business keys: `email`, `sku`, `category name`.
6. **NOT NULL** on anything required; `DEFAULT` for sensible fallbacks.
7. **CHECK** for value rules the ENUM/type system can't express.
8. **Indexes**: FK columns are auto-indexed by InnoDB; add more for hot filters.

## The schema we built

```text
customers 1 ──< addresses N          customers 1 ──< orders N ──< order_items N >── products N >──(1) categories
                                                              (order_items is the N:M link table)
categories self-ref: parent_id → categories.category_id       (hierarchy)
```

Full annotated DDL: `sql/03_ecommerce_schema.sql`.
Constraint-by-constraint exercises: `sql/04_constraints_demo.sql`.
Then prove you can read it: write your own JOINs in `sql/05_queries.sql`.

## DDL vs DML

| Kind | Statements | Example |
|---|---|---|
| **DDL** (structure) | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` | `CREATE TABLE orders (...)` |
| **DML** (data) | `INSERT`, `SELECT`, `UPDATE`, `DELETE` | `INSERT INTO orders ...` |
| **DCL** (permissions) | `GRANT`, `REVOKE` | (not covered today) |

## Naming & style conventions used in this repo

```text
tables        plural, snake_case      customers, order_items
columns       snake_case               ship_address_id
PK            <table_singular>_id      customer_id
FK            references the parent    customer_id in addresses
indexes       uq_ / ix_ prefix         uq_customers_email
constraints   fk_<child>_<parent>      fk_addresses_customer
keywords      UPPERCASE                CREATE TABLE, NOT NULL
```

## Try this (your tasks)

1. Run `sql/04_constraints_demo.sql` section by section; every "should fail"
   insert must actually fail — paste each error into the TODO slots.
2. Fill the **constraint matrix** (TASK 4.8) into your learning log.
3. Answer TASK 3.1/3.2 (map constraints per table, sketch the ER diagram).

## Checklist

- [ ] Can state what each of PK / FK / UNIQUE / NOT NULL guarantees
- [ ] Can explain PK vs. UNIQUE difference
- [ ] Can predict which `ER_*` error a bad statement will raise
- [ ] Can design a normalized schema for a new use case given step-by-step method
- [ ] Know why money is `DECIMAL` and why FKs need `InnoDB`
