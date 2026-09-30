# Week 5 Day 1 — Learning Log: MySQL, Relational Modelling & Normalization

> **Instructions for me:** work through `README.md`'s checklist, then fill every
> `TODO(you)` / `[ ]` slot below with what _I actually observed_. Theory
> summaries are pre-written; observations must come from my own runs.

---

## Topics Covered

### 1. SQL vs. NoSQL

- **SQL (relational):** fixed schema, tables, JOINs, standardised query language — MySQL, PostgreSQL
- **NoSQL (non-relational):** flexible schema, documents/key-value — MongoDB, Redis, Firestore
- SQL wins when: rich relationships, data integrity (money/inventory), ad-hoc queries, ACID transactions, stable structure
- NoSQL wins when: schema churn, nested data read together, massive horizontal write scale, caching/sessions
- Trade-off: SQL pays at _write time_ (validation via constraints); NoSQL pays at _read time_ (clean up duplication)
- Both were seen in this bootcamp: WEEK3 MongoDB (NoSQL) vs. WEEK4 PostgreSQL + WEEK5 MySQL (SQL)

### 2. MySQL — installation, structure, basic usage

- MySQL = RDBMS with two programs: **`mysqld` (server process, waits on :3306)** and **`mysql` (client CLI)**
- Installed today via **Docker** (`mysql:8.4` official image, `docker compose up -d`, healthcheck via `mysqladmin ping`)
- Hierarchy: **server → databases → tables → columns/rows** (+ views, indexes, routines)
- InnoDB is the default engine — required for FOREIGN KEYs and transactions
- Core commands: `SHOW DATABASES/SHOW TABLES`, `USE`, `DESCRIBE`, `SHOW CREATE TABLE`
- CRUD = `INSERT / SELECT / UPDATE / DELETE`; structure = `CREATE/ALTER/DROP` (DDL)
- Datatypes: `DECIMAL(10,2)` for money (never FLOAT), `VARCHAR(n)` text, `INT AUTO_INCREMENT` ids, `DATE/DATETIME`, `ENUM`, `TINYINT(1)` boolean

### 3. Relational modelling & normalization

- **Anomalies from redundancy:** update (patch N copies), insert (can't add standalone entity), delete (lose unrelated data)
- **1NF:** one value per cell — no comma-separated lists, no repeating groups
- **2NF:** 1NF + no _partial_ dependency — non-key columns depend on the whole key
- **3NF:** 2NF + no _transitive_ dependency — non-key columns depend only on the key
- Memory aid: _"the key, the whole key, and nothing but the key"_
- N:M relationships are modelled with a link table (`order_items`)
- 3NF is the default target; deliberate denormalisation (e.g. `order_items.unit_price` snapshot) is an accepted, documented exception
- Worked example: `sql/02_normalization_walkthrough.sql` (flat → 1NF → 2NF → 3NF)

### 4. Schema design & constraints

| Constraint    | Guarantee                     | Fails with                            |
| ------------- | ----------------------------- | ------------------------------------- |
| `PRIMARY KEY` | unique row id, never NULL     | `ER_DUP_ENTRY` (1062)                 |
| `FOREIGN KEY` | referenced row exists         | `ER_NO_REFERENCED_ROW_2` (1452)       |
| `UNIQUE`      | no duplicate values (NULL ok) | `ER_DUP_ENTRY` (1062)                 |
| `NOT NULL`    | value required                | `ER_BAD_NULL_ERROR` (1048)            |
| `CHECK`       | value passes expression       | `ER_CHECK_CONSTRAINT_VIOLATED` (3819) |

- PK vs UNIQUE: PK is one-per-table, implies NOT NULL, _identifies_ the row; UNIQUE allows NULLs and can exist many times
- FK actions: `CASCADE` (delete parent → children follow) vs. `RESTRICT` (block deletion)
- **The DB is the last line of defence** — app validation can be bypassed
- Sample schema (6 tables): `customers, addresses, categories, products, orders, order_items` in `sql/03_ecommerce_schema.sql`

---

## Key Findings (my observations)

- **[ ] Finding 1:** _after running TASK 1.1 — what did `SELECT @@hostname, @@port, version()` return? What does it prove about client vs server?_
- **[ ] Finding 2:** _after TASK 2.1 — how many duplicate rows did the flat table have, and how many rows needed updating for Ana's city change?_
- **[ ] Finding 3:** _after TASK 2.3 — how many UPDATEs were needed post-2NF?_
- **[ ] Finding 4:** \_after TASK 2.4 — rows to update for a price change: before (2NF) = **_ vs after (3NF) = _**?\_
- **[ ] Finding 5:** _after 04_constraints_demo — paste ONE full error message I got and explain why the DB rejected it_
- **[ ] Finding 6:** _TASK 4.7 — did deleting a customer WITH orders fail? Which error? Did the no-orders delete succeed?_
- **[ ] Finding 7:** \_something that surprised me / confused me today: ****\*\*****\_\_\_\_****\*\*****

---

## Code Snippets (from my own runs)

### Before normalization (the flat mess)

```sql
-- TODO(you): paste the CREATE TABLE / SELECT output that shows
-- comma-separated products ("Laptop,Mouse") from orders_flat
```

### After 3NF (the clean schema — PK/FK/UNIQUE/NOT NULL)

```sql
-- TODO(you): paste 5-10 lines of sql/03_ecommerce_schema.sql that
-- best show all four constraint types together
```

### Constraint violation proof

```sql
-- TODO(you): paste the statement that FAILED + the exact MySQL error
-- INSERT INTO ... ;
-- ERROR 1452 (23000): ...
```

### My best JOIN (from 05_queries.sql)

```sql
-- TODO(you): paste the query from TASK 5.3 or 5.8 and its result summary
```

---

## Reflections

- **Normal forms in my own words:**
  - 1NF: _todo_
  - 2NF: _todo_
  - 3NF: _todo_
- **Constraint matrix** (TASK 4.8):

  | Table       | PK                     | FK(s)                        | UNIQUE       | NOT NULL                     | CHECK        |
  | ----------- | ---------------------- | ---------------------------- | ------------ | ---------------------------- | ------------ |
  | customers   | customer_id            | —                            | email        | first_name, last_name, email | —            |
  | addresses   | address_id             | customer_id                  |              |                              |              |
  | categories  | category_id            | parent_id (self)             | name         |                              |              |
  | products    | product_id             | category_id                  | sku          |                              | price ≥ 0    |
  | orders      | order_id               | customer_id, ship_address_id |              |                              |              |
  | order_items | (order_id, product_id) | order_id, product_id         | (same as PK) |                              | quantity > 0 |

- **3 apps I use + guessed DB (Topic 1 reflection):** _todo_
- **SQL vs NoSQL — one sentence each:** _todo_

---

## Conclusion

_Pre-written skeleton — rewrite in my own voice once the tasks are done:_

Day 1 of Week 5 covered SQL vs. NoSQL, MySQL setup via Docker, relational
modelling, normalization through 3NF, and schema design with constraints.
The key shift was understanding that constraints make the _database_ the
guarantor of integrity rather than the application, and that normalization
trades stored redundancy for correctness — with JOINs paying the read-time
cost. _+ 2-3 sentences of what I actually found while running the tasks._

---

## Useful Commands Reference

```bash
docker compose up -d            # start MySQL
docker compose ps               # wait for healthy
docker compose exec mysql mysql -uroot -p'root_pw' shop_db   # CLI client
docker compose down             # stop (keep data)
docker compose down -v          # stop AND wipe data
```

## Task progress

- [ ] 01_create_database.sql (TASK 1.1–1.3)
- [ ] 02_normalization_walkthrough.sql (TASK 2.1–2.5)
- [ ] 03_ecommerce_schema.sql (TASK 3.1–3.2)
- [ ] 04_constraints_demo.sql (TASK 4.1–4.8)
- [ ] 05_queries.sql (TASK 5.1–5.9)
