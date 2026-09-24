# Support Ticket SLA Reminder System — Learning Scaffold

A **one-day** project to learn:

- PostgreSQL (Aiven cloud)
- TypeORM (entities, relations, relation loading)
- CRON jobs (`node-cron`)
- Express
- TypeScript

> This repo is a **scaffold**, not a finished app. All real functionality is left for you to implement.

---

## What is an SLA?

**SLA = Service Level Agreement.** A support team promises to resolve tickets within a set time (e.g. high priority within 4 hours). Each ticket here has a `dueAt` deadline. When the deadline passes, the ticket is **overdue**. A background CRON job detects overdue tickets and creates a notification for the assigned agent — instead of anyone manually polling the database.

```text
Ticket
   |
   | assignedTo (relation)
   v
 User


CRON
  |
  v
Check overdue tickets
  |
  v
Find assigned agent
  |
  v
Create notification
```

---

## Project tree

```text
support-sla-learning/
│
├── src/
│   ├── config/
│   │   └── db.ts                  <- you implement the DataSource connection
│   ├── entities/
│   │   ├── User.ts                <- you create the entity
│   │   ├── Ticket.ts              <- you create the entity + User relation
│   │   └── Notification.ts        <- you create the entity + relations
│   ├── routes/
│   │   ├── user.routes.ts         <- you implement POST/GET /users
│   │   ├── ticket.routes.ts       <- you implement POST /tickets, GET /tickets, GET /tickets/:id + relation loading
│   │   └── notification.routes.ts <- you implement GET /notifications/:userId
│   ├── jobs/
│   │   └── slaReminder.job.ts     <- you implement the CRON job
│   └── server.ts                  <- Express shell (configured)
│
├── .env                           <- paste your Aiven connection string here
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup (already done for you)

Dependencies installed:

| Package | Purpose |
|---------|---------|
| `express` | HTTP server |
| `typeorm` | PostgreSQL ORM |
| `pg` | PostgreSQL driver |
| `reflect-metadata` | Required by TypeORM decorators |
| `dotenv` | Load `.env` |
| `node-cron` | CRON scheduling |
| `typescript`, `tsx`, `@types/*` | TypeScript tooling |

TypeScript is configured with `experimentalDecorators` and `emitDecoratorMetadata` for TypeORM.

Scripts:

```bash
npm run dev     # start with hot reload (tsx watch)
npm run build   # compile TypeScript to dist/
npm start       # run compiled output
```

---

## LEARNING NOTE: PostgreSQL (Aiven)

I already have an Aiven PostgreSQL database with a connection string (no application tables yet).

My task is to:

1. Get my Aiven connection string.
2. Put it into `.env` (`DATABASE_URL=`).
3. Implement the TypeORM `DataSource` connection myself in `src/config/db.ts`.
4. Decide how tables get created (`synchronize` vs migrations) and understand the tradeoff.
5. Verify that the application can connect.

**Do not hardcode the connection string. Do not commit `.env`.**

---

## What I am responsible for learning and implementing

I am responsible for learning and implementing:

- PostgreSQL database/table/row structure
- TypeORM entities (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
- TypeORM relations (`@ManyToOne` / `@OneToMany`)
- CRUD operations (repositories / QueryBuilder)
- Foreign keys / primary keys
- Relation loading (TypeORM's equivalent of Mongoose `populate()`)
- Express route business logic
- CRON scheduling and callback logic
- overdue-ticket queries
- notification creation
- duplicate-reminder protection

**No completed database operations are provided. Only conceptual guidance.**

---

## Relations learning task (TypeORM's populate equivalent)

The Ticket entity will contain a relation to User.

Conceptually:

```text
Ticket
  |
  | assignedTo
  v
User
```

Your job is to learn:

1. Primary keys and foreign keys
2. `@ManyToOne` / `@OneToMany`
3. Loading relations when querying
4. selecting specific related fields
5. what happens before and after relation loading

Conceptual comparison:

```text
Without relation loading:

assignedTo → id (foreign key only)

With relation loading:

assignedTo → full User entity
```

In code you will research things like:

```text
repository.find({ relations: { assignedTo: true } })
```

…or QueryBuilder `leftJoinAndSelect` — but **write the actual queries yourself**.

---

## CRON learning task

Open `src/jobs/slaReminder.job.ts`. It contains:

- The real-world motivation
- CRON field order reference (`minute hour day-of-month month day-of-week`)
- Examples (`* * * * *`, `*/5 * * * *`, `0 * * * *`, `0 8 * * *`)
- Questions about overlap / duplicate work
- The flow you must implement (overdue query → notification → mark reminded)

You must:

1. Learn the `node-cron` API yourself
2. Decide on schedule + timezone (`Asia/Kathmandu`)
3. Write the overdue-ticket SQL/query
4. Create notifications
5. Prevent duplicate reminders (e.g. `slaReminderSent` column, overlap protection)

---

## Common pitfalls (debugging checklist)

Read these when something "mysterious" happens:

### Database / DataSource
- Connection string hardcoded or missing from `.env` → always use `process.env.DATABASE_URL`.
- Express/CRON started before `initialize()` → "Connection not established".
- Aiven needs SSL — missing `sslmode`/SSL options → timeout or TLS errors.
- Entities not listed in `entities: []` → tables/relations never registered.
- `synchronize: true` in production → schema can change/drop data. Understand before enabling.

### Entities / relations
- `assignedTo` saved as a plain id column with no relation → you can't load the User in one query.
- Wrong `@ManyToOne` / `@OneToMany` sides → relation config errors or unusable inverse access.
- `dueAt` stored as a string → overdue comparisons become wrong (lexicographic, not chronological).
- `slaReminderSent` NULL instead of `false` → SQL `NULL = false` is unknown; filters misbehave.
- Inconsistent `status` casing (`Open` vs `open`) → CRON query misses rows.

### Routes
- Forgot `await` on repository calls → response is empty/`{}` or you call `.map` on a Promise.
- Expected full User on a ticket **without** loading relations → only id comes back (the TypeORM "forgot populate()" bug).
- Double path prefix (`app.use("/tickets")` + `"/tickets"` in router) → 404 on the path you test.
- Relative imports without `.js` under `NodeNext` → runtime `ERR_MODULE_NOT_FOUND`.
- No basic validation → invalid `dueAt`, missing `assignedTo`, duplicate emails.

### CRON
- Job never wired from `server.ts` → file exists but never runs.
- Filter only `dueAt < now` → endless duplicate reminders; also check `slaReminderSent` and status.
- Overlapping runs (slow job + short interval) → duplicate notifications; research overlap protection.
- Mark reminded **before** inserting the notification (or opposite order without thinking) → lost or duplicate reminders.
- UTC timestamps vs Asia/Kathmandu expectations → "overdue" off by hours.
- Zero logs inside the job → you can't tell if it fired.

### Server startup
- `reflect-metadata` must stay first import in `server.ts`.
- `app.listen` before DB + CRON setup → race on early requests/ticks.
- Forgetting to mount one of the three routers → that feature silently 404s.

---

## API overview

Convention for this project:

| Verb | Purpose | Data location |
|------|---------|----------------|
| **POST** | Create/mutate | JSON **body** (not query string) |
| **GET** | Read | Path/params only; response = non-sensitive fields |

| Method | Path | You implement |
|--------|------|----------------|
| POST | `/users` | Create agent |
| GET | `/users` | List agents (id, name, email, role) |
| POST | `/tickets` | Create ticket |
| GET | `/tickets` | List tickets + loaded `assignedTo` |
| GET | `/tickets/:id` | One ticket + loaded `assignedTo` (404 if missing) |
| GET | `/notifications/:userId` | Notifications for agent |

All handlers are TODOs — you write the logic. You must also **mount the routers** in `server.ts`.

---

## First-run checklist (empty Aiven database)

Your Aiven PostgreSQL has **no application tables yet**. There is **no seed script** — data is created only through **your POST APIs**.

1. Put your Aiven connection string in `.env` → `DATABASE_URL=`
2. Implement `src/config/db.ts` (DataSource + `initialize()`)
3. Implement the three entities (User, Ticket, Notification)
4. Decide how tables appear: `synchronize: true` (dev) vs migrations — your learning choice
5. Implement route handlers and mount routers in `server.ts`
6. `npm run dev`
7. Test with Postman (order below)

**POST will fail until tables exist** — connection + entities + table creation first.

---

## API testing guide (Postman)

**Base URL:** `http://localhost:3000`  
Optional Postman env var: `{{baseUrl}}` = `http://localhost:3000`  
**POST header:** `Content-Type: application/json`

Run requests in this order after `npm run dev`:

### 1. POST /users — create agent

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "role": "agent"
}
```

Expect: `201`/`200` + created user (including `id`).  
Save the `id` — you need it for tickets and notifications.

### 2. GET /users — verify agent

Expect: `200` array containing Alice (id, name, email, role only).

### 3. POST /tickets — overdue ticket

```json
{
  "title": "Customer cannot login",
  "description": "User locked out of account",
  "status": "open",
  "priority": "high",
  "dueAt": "<past ISO date, e.g. yesterday>",
  "assignedTo": <aliceId>,
  "slaReminderSent": false
}
```

### 4. POST /tickets — future ticket

```json
{
  "title": "Profile update issue",
  "description": "Cannot update display name",
  "status": "open",
  "priority": "low",
  "dueAt": "<future ISO date, e.g. tomorrow>",
  "assignedTo": <aliceId>,
  "slaReminderSent": false
}
```

Expect: `201`/`200` for each. Save ticket ids.

### 5. GET /tickets — list with relation

Expect: `200` array; each ticket’s `assignedTo` is a **User object** (id, name, …), not a bare id.

### 6. GET /tickets/:id — single ticket

Use one ticket id from step 3/4.

Expect: `200` + that ticket with `assignedTo` loaded.  
Unknown id → **404**.

### 7. Wait for CRON

Job should run about every minute while developing (once you implement it). Watch server logs.

### 8. GET /notifications/:userId

Use Alice’s id.

Expected eventual behavior:

```text
Overdue ticket
→ CRON detects it
→ notification created for Alice

Future ticket
→ CRON ignores it
```

Expect: `200`; notifications reference the overdue ticket, not the future one.

---

### Postman troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `404` on every path | Router not mounted in `server.ts`, or double prefix (`/tickets/tickets`) |
| `Cannot POST` / connection refused | Server not running (`npm run dev`) |
| `500` + “relation does not exist” | Tables not created yet (DataSource/entities/`synchronize` decision) |
| `assignedTo` is only an id | Forgot relation loading on that GET |
| Empty `GET /notifications` | CRON not wired, not overdue yet, or filter wrong — check server logs |
| `400`/`500` on POST | Validation/`await`/unique email — check handler error path |

---

## Manual test data reference

Same data as the Postman bodies above, if you prefer creating rows another way once routes exist.

### User

```text
Alice
alice@example.com
agent
```

### Overdue ticket

```text
Customer cannot login
status: open
priority: high
dueAt: past
assignedTo: Alice
slaReminderSent: false
```

### Future ticket

```text
Profile update issue
status: open
priority: low
dueAt: future
assignedTo: Alice
slaReminderSent: false
```

### Expected eventual behavior

```text
Overdue ticket
→ CRON should detect it
→ notification should eventually be created

Future ticket
→ CRON should ignore it
```

Verify with `GET /notifications/:userId`.

---

## DAY PLAN

1. Configure the project
2. Connect to PostgreSQL (Aiven) yourself
3. Learn/create the User entity
4. Learn/create the Ticket entity (+ relation)
5. Implement POST /users + GET /users → create Alice via Postman
6. Implement POST /tickets → create overdue + future tickets via Postman
7. Implement GET /tickets and GET /tickets/:id
8. Learn and implement relation loading
9. Verify the loaded result in Postman
10. Implement CRON
11. Detect overdue tickets
12. Create notifications
13. Prevent duplicate reminders
14. Test the complete workflow in Postman

---

## How to run

```bash
cd support-sla-learning

# 1. Put your Aiven connection string in .env
# 2. Implement src/config/db.ts (DataSource)
# 3. Implement entities, routes, CRON yourself

npm run dev
```

Then open `http://localhost:3000` (after you register routes).

---

## Intentionally NOT included

No auth, frontend, Docker, Redis, message queues, email/SMS, WebSockets, test framework, or controller/service/repository layers. Keep it small — finish in one day.
