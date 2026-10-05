# Group 2 — Advanced SQL Querying & Weekly Consolidation

An **e-commerce admin dashboard API**: filter, sort, paginate and aggregate a
real dataset — the same four skills every reporting screen needs.

> SQL files are commented guides — **YOU** run them. Tasks are marked
> `═══ TASK x.y ═══` and answers go in the `TODO(you)` slots. The Express side
> turns the same queries into dashboard endpoints.

## 1. Start MySQL + install

```bash
cd WEEK5/week5day5/group2_advanced_querying
npm install
npm run db:up && npm run db:ps     # wait until STATUS = healthy
npm run schema                     # runs sql/01_schema.sql (50 customers, 200 products, 400 orders, 1200 lines)
npm run dev                        # http://127.0.0.1:3002
```

| Setting  | Value             |
| -------- | ----------------- |
| Host     | `127.0.0.1`       |
| Port     | `3308`            |
| User     | `root`            |
| Password | `root_pw`         |
| Database | `commerce_db`     |

CLI client (or the VS Code MySQL extension):

```bash
docker compose exec mysql mysql -uroot -p'root_pw' commerce_db
mysql> SHOW TABLES;
```

## 2. The query engine's order of evaluation

```
FROM / JOIN  ->  WHERE  ->  GROUP BY  ->  HAVING  ->  SELECT  ->  ORDER BY  ->  LIMIT
                (rows)      (groups)    (groups)              (sort)      (page)
```

`WHERE` can never see an aggregate; `HAVING` always can. Nearly every mistake
in this lab is "wrong clause, right expression".

| Real-world need | Clause / function |
| --- | --- |
| Toolbar filters | `WHERE ... AND/OR/IN/BETWEEN/LIKE` |
| Sort control | `ORDER BY col [ASC\|DESC], col2 ...` |
| Next/Prev page | `LIMIT ? OFFSET ?` + a separate `COUNT(*)` |
| KPI cards | `COUNT/SUM/AVG/MIN/MAX` |
| Per-group KPIs | `GROUP BY ... HAVING ...` |

## 3. Run order & checklist

| # | File | What you do | ✓ |
| --- | --- | --- | --- |
| 1 | `sql/01_schema.sql` | Run all; TASK 1.1 (why snapshot `unit_price`?) | ☐ |
| 2 | `sql/02_filter_sort_paginate.sql` | TASK 2.1 filters, 2.2 sorting, 2.3 paging, 2.4 OFFSET trap + keyset, 2.5 combined exercise | ☐ |
| 3 | `sql/03_groupby_aggregates.sql` | TASK 3.1 groups, 3.2 five aggregates, 3.3 WHERE vs HAVING, 3.4 multi-col + HAVING, 3.5 traps, 3.6 executive summary | ☐ |
| 4 | `src/routes/products.ts` | Implement `GET /products/search` (dynamic WHERE + sort whitelist + paging + COUNT) | ☐ |
| 5 | `src/routes/reports.ts` | Implement `GET /reports/sales/summary` (daily revenue) | ☐ |
| 6 | `src/routes/reports.ts` | Implement `GET /reports/top-products` (+ the "top cities" HAVING variant) | ☐ |

## 4. Verify the API

```bash
# worked example (200)
curl http://127.0.0.1:3002/products

# your TODO routes (501 until you implement them)
curl 'http://127.0.0.1:3002/products/search?category=Electronics&minPrice=200&sort=price_asc&page=2&limit=20'
curl 'http://127.0.0.1:3002/reports/sales/summary?days=30'
curl 'http://127.0.0.1:3002/reports/top-products?limit=10'

# a payload that must be REJECTED by your sort whitelist
curl 'http://127.0.0.1:3002/products/search?sort=%3B%20DROP%20TABLE%20products'
```

## 5. Real-world task (the point of this lab)

> **Spec:** a dashboard where the user filters by category + minimum price,
> picks a sort order, and pages through results — with a correct total count —
> and sees three KPI cards: daily revenue, top products, top cities.

Acceptance checks you run yourself:

- [ ] `page=1` and `page=2` never return the same row (with `ORDER BY` set).
- [ ] `total` from `COUNT(*)` matches `items.length` when `limit >= total`.
- [ ] Only whitelisted sort values reach SQL; anything else falls back to default.
- [ ] `HAVING` filters groups, `WHERE` filters rows — you can explain which is which for every clause you wrote.
- [ ] An invalid `limit` (e.g. `99999`) is clamped to your max.

## 6. Reset / troubleshoot

```bash
npm run db:reset     # WIPES commerce_db — start over
npm run schema       # re-create + re-seed (keeps the container)
docker compose logs mysql | tail -30
```

| Symptom | Cause |
| --- | --- |
| `ER_NO_DB_ERROR (1046)` | forgot `USE commerce_db;` |
| `Expression #1 of SELECT list is not in GROUP BY clause ... only_full_group_by` | selected a column that isn't grouped or aggregated |
| `Unknown column ... in 'group statement'` | grouped on an alias, or wrong join |
| `connect ECONNREFUSED 127.0.0.1:3308` | container not running, or you used the group-1 port |
| Rows repeat between pages | `ORDER BY` not deterministic — add a tiebreaker like `order_id` |
