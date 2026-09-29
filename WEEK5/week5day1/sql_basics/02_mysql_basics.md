# 02 — MySQL: installation, structure, basic usage

## What MySQL actually is

MySQL is a **relational database management system (RDBMS)**. Two programs matter:

```text
mysqld   ← the SERVER: a process that holds data and waits on port 3306
mysql    ← the CLIENT: a CLI you type SQL into; sends it to the server
```

This is the client/server model discussed earlier — they are separate
processes (possibly on separate machines) talking over a network socket.

## How we install it (today: Docker)

```bash
cd WEEK5/week5day1/sql_basics
docker compose up -d        # pulls mysql:8.4 from Docker Hub, starts it
docker compose ps           # STATUS should become "healthy (healthy)"
```

`docker-compose.yml` explains every line:

| Line | Purpose |
|---|---|
| `image: mysql:8.4` | official image, LTS release |
| `MYSQL_ROOT_PASSWORD` | root password baked in at first boot |
| `MYSQL_DATABASE: shop_db` | database auto-created on first boot |
| `ports: 127.0.0.1:3306:3306` | expose container port on localhost only |
| `volumes: mysql_data` | data survives `docker compose down` |
| `healthcheck` | container reports "healthy" only when `mysqld` answers ping |

**Native alternatives** (not used today, for awareness):
- Debian/Ubuntu: `apt install mysql-server`
- Arch: `pacman -S mariadb` then `mariadb-install-db` + enable service
- Any OS: download MySQL Community Server from dev.mysql.com

## MySQL's own structure

```text
MySQL Server (mysqld)
├── Database  (a namespace: shop_db)
│   ├── Table        (customers, orders, ...)
│   │   ├── Column   (name, type, constraints)
│   │   └── Row      (one record)
│   ├── View         (a saved SELECT -- virtual table)
│   ├── Index        (speeds up WHERE/JOIN lookups)
│   └── Stored routine (procedures / functions)
└── Engine: InnoDB (default; supports FKs & transactions)
```

Hierarchy in one phrase: **server → databases → tables → rows/columns**.

Commands to see it (`sql/01_create_database.sql` has the runnable versions):

```sql
SHOW DATABASES;               -- what databases exist
USE shop_db;                  -- pick the current one
SHOW TABLES;                  -- tables inside current DB
DESCRIBE customers;           -- columns, types, keys of one table
SHOW CREATE TABLE orders;     -- full DDL MySQL used to build it
SELECT version();             -- server version
```

## Basic usage — the CRUD of SQL

| Operation | Statement | Example |
|---|---|---|
| **C**reate | `INSERT` | `INSERT INTO customers (email) VALUES ('a@b.c');` |
| **R**ead | `SELECT` | `SELECT * FROM customers WHERE city = 'Pune';` |
| **U**pdate | `UPDATE` | `UPDATE customers SET city='Mumbai' WHERE id=1;` |
| **D**elete | `DELETE` | `DELETE FROM customers WHERE id=1;` |

Plus structure statements: `CREATE DATABASE/TABLE`, `ALTER TABLE`, `DROP TABLE`.

## Datatypes you need today

| Type | Use | Example |
|---|---|---|
| `INT` | whole numbers, ids | `quantity` |
| `VARCHAR(n)` | short text, max n chars | `email VARCHAR(120)` |
| `DECIMAL(10,2)` | **money** — exact, no float rounding | `price DECIMAL(10,2)` |
| `DATE` / `DATETIME` | dates / timestamps | `order_date DATE` |
| `TINYINT(1)` | boolean-ish (0/1) | `is_default` |
| `ENUM(...)` | fixed set of allowed values | `status ENUM('pending',...)` |
| `AUTO_INCREMENT` | server assigns next id | `customer_id INT ... AUTO_INCREMENT` |

> Never use `FLOAT` for money — `0.1 + 0.2 != 0.3` in binary floating point.
> `DECIMAL` stores exact base-10 digits.

## SQL syntax basics

- Case-insensitive for keywords (`select` == `SELECT`); convention = UPPERCASE keywords.
- Statements end with `;` — mandatory in the CLI.
- Comments: `-- like this` and `/* block */`.
- Strings use single quotes `'Ana'`; double quotes are identifiers in ANSI mode.

## Try this (your tasks)

1. Run `sql/01_create_database.sql` and answer its three TASK questions.
2. In VS Code or the CLI, run `SHOW TABLES; DESCRIBE demo;`.
3. Note in your log: what `SELECT DATABASE()` returned before/after `USE`.

## Checklist

- [ ] Can explain `mysqld` vs `mysql` (server vs client)
- [ ] Can state the hierarchy: server → database → table → row/column
- [ ] Can start the container and connect with the VS Code extension
- [ ] Know which datatypes to use for money, dates, ids, and short text
