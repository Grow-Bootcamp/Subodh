# sql_basics — Week 5 Day 1

Hands-on introduction to **MySQL**: relational modelling, normalization
(1NF/2NF/3NF), and schema design with constraints (PK, FK, UNIQUE, NOT NULL).

> **How this folder works:** the SQL files are *commented guides with tasks*.
> Nothing runs automatically — **YOU** start the server, connect, and execute
> each statement yourself. Tasks are marked `═══ TASK x.y ═══` and your answers
> go into the `TODO(you)` slots (and then into `LEARNING_LOG.md`).

---

## 1. Start MySQL (Docker)

```bash
cd WEEK5/week5day1/sql_basics
docker compose up -d        # first run also pulls mysql:8.4 from Docker Hub (~250MB)
docker compose ps           # wait until STATUS = "healthy (healthy)"
```

Connection details (from `docker-compose.yml`):

| Setting | Value |
|---|---|
| Host | `127.0.0.1` |
| Port | `3306` |
| User | `root` |
| Password | `root_pw` |
| Database | `shop_db` (auto-created) |

## 2. Connect with the VS Code extension (recommended)

1. Install **"MySQL" by Weijan Chen** (`weijan.vscode-mysql-client`) from the
   Extensions sidebar — or **SQLTools** (`mtxr.sqltools`) + its MySQL driver.
2. Open the extension's **Connections → + Create Connection** and enter:
   ```text
   Host:      127.0.0.1
   Port:      3306
   Username:  root
   Password:  root_pw
   Database:  shop_db
   ```
3. Save, then expand the sidebar tree: `shop_db → Tables → customers → Columns`.
   This is where you **see the tables being created** — right-click a table →
   "Show Table Design"/"Select Top 1000" for a quick view.
4. Open a new SQL file, pick your connection, and **Run** (▶) statements one
   block at a time.

**CLI alternative** (same client concept, just terminal-based):

```bash
docker compose exec mysql mysql -uroot -p'root_pw' shop_db
mysql> SHOW TABLES;
mysql> DESCRIBE customers;
mysql> exit
```

## 3. Run order & task checklist

| # | File | What you do | ✓ |
|---|---|---|---|
| 0 | `01_sql_vs_nosql.md` | Read: when relational wins | ☐ |
| 1 | `sql/01_create_database.sql` | Run all; answer TASK 1.1–1.3 | ☐ |
| 2 | `02_mysql_basics.md` | Read: server vs client, datatypes, CRUD | ☐ |
| 3 | `03_normalization.md` | Read: 1NF/2NF/3NF theory | ☐ |
| 4 | `sql/02_normalization_walkthrough.sql` | Run each STEP; TASK 2.1–2.5 | ☐ |
| 5 | `04_schema_design_and_constraints.md` | Read: constraints + design method | ☐ |
| 6 | `sql/03_ecommerce_schema.sql` | Run; view tables in sidebar; TASK 3.1–3.2 | ☐ |
| 7 | `sql/04_constraints_demo.sql` | Section A first, then break it on purpose; TASK 4.1–4.8 | ☐ |
| 8 | `sql/05_queries.sql` | **Write your own** queries from hints; TASK 5.1–5.9 | ☐ |
| 9 | `LEARNING_LOG.md` | Fill in every `TODO(you)` slot | ☐ |

## 4. Reset / troubleshoot

```bash
# restart the server (data persists on the mysql_data volume)
docker compose restart

# destroy everything and start over (WIPES your work!)
docker compose down -v

# check logs if it won't become healthy
docker compose logs mysql | tail -30

# re-run the schema from scratch
docker compose exec -T mysql mysql -uroot -p'root_pw' shop_db < sql/03_ecommerce_schema.sql
```

Common errors you will hit (on purpose):

| Error | Cause |
|---|---|
| `ER_NO_DB_ERROR (1046)` | forgot `USE shop_db;` |
| `ER_DUP_ENTRY (1062)` | UNIQUE/PK violation |
| `ER_NO_REFERENCED_ROW_2 (1452)` | FK points at a row that doesn't exist |
| `ER_ROW_IS_REFERENCED_2 (1451)` | tried to delete a parent that still has children |
| `ER_BAD_NULL_ERROR (1048)` | NOT NULL column omitted |
| `ER_CHECK_CONSTRAINT_VIOLATED (3819)` | CHECK failed (e.g. quantity ≤ 0) |

## 5. Done? (your follow-ups)

1. Commit your filled-in logs/queries, push the branch, and raise a PR to `main`.
2. Post the PR link + `LEARNING_LOG.md` link in the Zoho task comment and the
   Microsoft Teams thread for mentor review.
