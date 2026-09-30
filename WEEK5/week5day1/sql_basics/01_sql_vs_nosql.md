# 01 — SQL vs. NoSQL: when does a relational database win?

## The two families

| | **SQL (relational)** | **NoSQL (non-relational)** |
|---|---|---|
| Data shape | Tables: rows + columns | Documents / key-value / graph / wide-column |
| Schema | **Fixed** — defined up front (DDL) | **Flexible** — fields can vary per record |
| Relationships | JOINs across tables | Usually embedded, or manual lookups |
| Query language | Standardised SQL | Vendor-specific API/queries |
| Scaling | **Vertical** (bigger machine); read replicas | **Horizontal** (add machines) by default |
| Examples | MySQL, PostgreSQL, SQL Server, Oracle | MongoDB, Firestore, Redis, Cassandra, DynamoDB |

You already met both sides: **WEEK3 = MongoDB (document)**, **WEEK4 = PostgreSQL (relational)**, **this week = MySQL (relational)**.

## Key mental model

```text
SQL   →  model the DATA once, rigorously;  integrity enforced by the DB
NoSQL →  model the QUERIES first;  duplicate data deliberately so reads are cheap
```

## Scenarios that favour a **relational** DB (SQL)

1. **Rich relationships** — orders↔customers↔products. JOINs answer questions
   NoSQL can only answer with many round-trips or pre-joined duplicates.
2. **Data integrity matters** — money, inventory, accounts. FK/UNIQUE/NOT NULL/CHECK
   mean illegal data physically cannot be stored.
3. **Ad-hoc queries** — business asks a question you never anticipated; SQL answers
   it in one line. NoSQL often needs a new aggregation pipeline or a new index.
4. **Transactional guarantees (ACID)** — a transfer must debit AND credit, or neither.
   Relational DBs are built for `BEGIN … COMMIT`.
5. **Clear, stable structure** — an e-commerce catalogue has an obvious shape.

## Scenarios that favour **NoSQL**

1. **Schema churn** — startup product where fields change weekly.
2. **Hierarchical/nested data stored and read together** — one document per user
   with nested settings; no JOIN needed at read time.
3. **Massive horizontal scale / high write throughput** — event logs, IoT telemetry.
4. **Hierarchical access patterns** — categories of categories could be a nested
   document instead of a self-referencing FK (see `sql/03_ecommerce_schema.sql`).
5. **Caching / sessions** — Redis key-value speed.

## The classic trap

"Flexible schema" becomes *"every document is slightly different and nobody
knows what `user.address` looks like anymore"*. Relational schemas are
**boring on purpose**: boring = predictable.

## The trade-off in one line

```text
SQL   : write code → enforce shape in DB → pay at write time (validation) → cheap later
NoSQL : store anything fast → pay at read time (clean up inconsistency yourself)
```

> **Today's use case — an e-commerce store — is textbook SQL**: strong entity
> relationships, money, stock, uniqueness of SKUs/emails, transactional orders.

## Try this (research, not code)

- List 3 apps you use daily and guess their DB (hint: banks/social graphs → SQL;
  chat message history / leaderboards → NoSQL).
- Note your answer in `LEARNING_LOG.md` → *Topic 1 reflection*.

## Checklist

- [ ] Can explain relational vs. non-relational in one sentence each
- [ ] Can name 3 scenarios where SQL wins, 3 where NoSQL wins
- [ ] Can explain why `money` pushes you to SQL
