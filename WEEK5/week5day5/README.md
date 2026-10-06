# Week 5 Day 5 — Two groups, two independent labs

Each folder is a **standalone** Node + Express + MySQL project with its own
Docker container, database and port. Do one, stop it, do the other — they never
interfere.

| Folder | Topic | MySQL | Express | Container | Database |
| --- | --- | --- | --- | --- | --- |
| [`group1_acid_transactions_indexing`](./group1_acid_transactions_indexing) | ACID, transactions, indexing | `127.0.0.1:3307` | `3001` | `acid_mysql` | `bank_db` |
| [`group2_advanced_querying`](./group2_advanced_querying) | WHERE/ORDER BY/LIMIT, GROUP BY/HAVING, aggregates | `127.0.0.1:3308` | `3002` | `analytics_mysql` | `commerce_db` |

> `127.0.0.1:3306` is already used by `WEEK5/week5day1/sql_basics` — that is
> why these two use 3307/3308.

## How each lab works

1. **`sql/*.sql` — the theory, hands-on.** Commented real-world scenarios with
   `═══ TASK ═══` blocks and `TODO(you)` slots. Nothing runs automatically:
   you connect and execute.
2. **`src/routes/*.ts` — the same ideas in an API.** Each folder has one
   *worked* route you can copy from, and `TODO(you)` stubs that return `501`
   until you implement them.
3. Fill in the `TODO(you)` answers as you go (README checklists keep score).

## Quick start (either folder)

```bash
cd WEEK5/week5day5/group1_acid_transactions_indexing   # or group2_...
npm install
npm run db:up          # docker compose up -d (first run pulls mysql:8.4)
npm run db:ps          # wait for healthy
npm run schema         # creates + seeds the tables
npm run dev            # express on :3001 (group2 -> :3002)
```

Then open a SQL client against the port in the table above (credentials:
`root` / `root_pw`), and start the checklist in that folder's `README.md`.

```bash
npm run db:down        # stop (data kept)
npm run db:reset       # stop + DELETE the volume and start fresh
```

## Suggested order

1. Group 1: `sql/01_schema.sql` → `02_transactions.sql` → `03_isolation_acid.sql`
   → `04_indexing.sql`, then the two `TODO` routes in `src/routes/accounts.ts`.
2. Group 2: `sql/01_schema.sql` → `02_filter_sort_paginate.sql` →
   `03_groupby_aggregates.sql`, then the `TODO` routes in `src/routes/products.ts`
   and `src/routes/reports.ts`.

**Group 2 is also your weekly consolidation** — it reuses the schema/CRUD
skills from `WEEK5/week5day1/sql_basics`, so skim that folder's `README.md`
again if the shop schema looks unfamiliar.
