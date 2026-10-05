# Group 1 — ACID, Transactions & Indexing

A miniature **bank payment service**: move money between accounts without ever
losing a rupee, then make the "find my account" query fast at scale.

> SQL files are commented guides — **YOU** run them. Tasks are marked
> `═══ TASK x.y ═══` and answers go in the `TODO(you)` slots. The Express side
> mirrors the same ideas as HTTP endpoints.

## 1. Start MySQL + install

```bash
cd WEEK5/week5day5/group1_acid_transactions_indexing
npm install
npm run db:up && npm run db:ps     # wait until STATUS = healthy
npm run schema                     # runs sql/01_schema.sql
npm run dev                        # http://127.0.0.1:3001
```

| Setting  | Value             |
| -------- | ----------------- |
| Host     | `127.0.0.1`       |
| Port     | `3307`            |
| User     | `root`            |
| Password | `root_pw`         |
| Database | `bank_db`         |

CLI client (or use the VS Code MySQL extension):

```bash
docker compose exec mysql mysql -uroot -p'root_pw' bank_db
mysql> SHOW TABLES;
```

## 2. Concepts you will observe (before you touch anything)

| Principle | MySQL mechanism to look for |
| --- | --- |
| **Atomicity** | `START TRANSACTION` / `COMMIT` / `ROLLBACK` — all-or-nothing statement groups |
| **Consistency** | `CHECK` constraints + FKs: invalid states are rejected mid-transaction |
| **Isolation** | `SET TRANSACTION ISOLATION LEVEL`, row locks with `SELECT ... FOR UPDATE`, MVCC snapshots |
| **Durability** | committed rows survive `docker compose restart` (InnoDB redo log on disk) |

## 3. Run order & checklist

| # | File | What you do | ✓ |
| --- | --- | --- | --- |
| 1 | `sql/01_schema.sql` | Run all; TASK 1.1 (keys & FK) | ☐ |
| 2 | `sql/02_transactions.sql` | TASK 2.1 transfer, 2.2 failed transfer, 2.3 ROLLBACK, 2.4 conditional | ☐ |
| 3 | `sql/03_isolation_acid.sql` | Two terminals; TASK 3.1–3.5 (dirty read, repeatable read, phantom, lost update, ACID recap) | ☐ |
| 4 | `sql/04_indexing.sql` | Load 50k rows; TASK 4.1–4.6 (`EXPLAIN` before/after, composite index, timing, write cost) | ☐ |
| 5 | `src/routes/accounts.ts` | Implement `POST /:id/transfer` (atomic) | ☐ |
| 6 | `src/routes/accounts.ts` | Implement `GET /search?q=` (return `EXPLAIN`) | ☐ |

## 4. Verify the API

```bash
# worked example (should be 200)
curl http://127.0.0.1:3001/accounts/1

# your TODO routes (501 until you implement them)
curl -X POST http://127.0.0.1:3001/accounts/1/transfer \
  -H 'Content-Type: application/json' \
  -d '{"to":2,"amount":10000,"reason":"rent"}'
curl 'http://127.0.0.1:3001/accounts/search?q=Aditi'

# after implementing, prove atomicity: a huge amount must change NOTHING
curl -X POST http://127.0.0.1:3001/accounts/1/transfer \
  -H 'Content-Type: application/json' \
  -d '{"to":3,"amount":999999999}'
docker compose exec mysql mysql -uroot -p'root_pw' bank_db \
  -e 'SELECT * FROM accounts; SELECT * FROM transactions_log ORDER BY log_id DESC LIMIT 5;'
```

## 5. Real-world task (the point of this lab)

> **Spec:** `POST /accounts/:id/transfer` must debit, credit and write two audit
> rows — or do **none** of them. It must reject transfers that overdraw the
> sender, and it must be safe when two requests hit the same account at once.

Acceptance checks you run yourself:

- [ ] Happy path: balances move, `transactions_log` gains exactly 2 rows.
- [ ] Overdraw: `500` response, balances unchanged, **0** new log rows.
- [ ] Ctrl-C the API mid-transfer (or kill the container) → books still balance.
- [ ] Two parallel `curl` transfers from the same account → no lost update
      (use `SELECT ... FOR UPDATE`, then verify the final balance is correct).

## 6. Reset / troubleshoot

```bash
npm run db:reset     # WIPES bank_db — start over
npm run schema       # re-create + re-seed tables (keeps the container)
docker compose logs mysql | tail -30
```

| Symptom | Cause |
| --- | --- |
| `ER_DUP_ENTRY (1062)` | duplicate PK/UNIQUE |
| `ER_CHECK_CONSTRAINT_VIOLATED (3819)` | `balance >= 0` violated — your debit overshot |
| `Lock wait timeout exceeded (1205)` | another session holds the row lock (`FOR UPDATE`) |
| `ER_NO_DB_ERROR (1046)` | forgot `USE bank_db;` |
| `connect ECONNREFUSED 127.0.0.1:3307` | container not running, or you used the group-2 port |
