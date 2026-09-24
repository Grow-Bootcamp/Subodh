# Support Ticket SLA Reminder System — Learning Scaffold

A **one-day** project to learn:

- MongoDB / Mongoose
- Mongoose `populate()`
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
   | assignedTo
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
│   │   └── db.ts                  <- you implement the connection
│   ├── models/
│   │   ├── User.ts                <- you create the schema
│   │   ├── Ticket.ts              <- you create the schema + User reference
│   │   └── Notification.ts        <- you create the schema + references
│   ├── routes/
│   │   ├── user.routes.ts         <- you implement POST /users
│   │   ├── ticket.routes.ts       <- you implement POST/GET /tickets + populate()
│   │   └── notification.routes.ts <- you implement GET /notifications/:userId
│   ├── jobs/
│   │   └── slaReminder.job.ts     <- you implement the CRON job
│   └── server.ts                  <- Express shell (configured)
│
├── .env                           <- paste your Atlas URI here
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
| `mongoose` | MongoDB ODM |
| `dotenv` | Load `.env` |
| `node-cron` | CRON scheduling |
| `typescript`, `tsx`, `@types/*` | TypeScript tooling |

Scripts:

```bash
npm run dev     # start with hot reload (tsx watch)
npm run build   # compile TypeScript to dist/
npm start       # run compiled output
```

---

## LEARNING NOTE: MongoDB Atlas

I already have a MongoDB Atlas cluster.

My task is to:

1. Get my Atlas connection string.
2. Put it into `.env` (`MONGODB_URI=`).
3. Implement the Mongoose connection myself in `src/config/db.ts`.
4. Verify that the application can connect.

**Do not hardcode the URI. Do not commit `.env`.**

---

## What I am responsible for learning and implementing

I am responsible for learning and implementing:

- MongoDB database/collection/document structure
- Mongoose schemas
- Mongoose models
- CRUD operations
- ObjectId
- references
- populate()
- Express route business logic
- CRON scheduling and callback logic
- overdue-ticket queries
- notification creation
- duplicate-reminder protection

**No completed MongoDB operations are provided. Only conceptual guidance.**

---

## populate() learning task

The Ticket document will contain a reference to User.

Conceptually:

```text
Ticket
  |
  | assignedTo
  v
User
```

Your job is to learn:

1. ObjectId references
2. `ref`
3. `populate()`
4. selecting populated fields
5. what happens before and after population

Conceptual comparison:

```text
Without populate:

assignedTo → ObjectId

With populate:

assignedTo → User document
```

Do NOT expect ready-made code — write the queries yourself.

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
3. Write the overdue-ticket query
4. Create notifications
5. Prevent duplicate reminders (e.g. `slaReminderSent` flag, overlap protection)

---

## Testing guide

Create this data manually once your routes work.

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
2. Connect to MongoDB Atlas yourself
3. Learn/create the User model
4. Learn/create the Ticket model
5. Create the User manually
6. Create the Ticket manually
7. Implement GET /tickets
8. Learn and implement populate()
9. Verify the populated result
10. Implement CRON
11. Detect overdue tickets
12. Create notifications
13. Prevent duplicate reminders
14. Test the complete workflow

---

## How to run

```bash
cd support-sla-learning

# 1. Put your Atlas URI in .env
# 2. Implement src/config/db.ts
# 3. Implement models, routes, CRON yourself

npm run dev
```

Then open `http://localhost:3000` (after you register routes).

---

## Intentionally NOT included

No auth, frontend, Docker, Redis, message queues, email/SMS, WebSockets, test framework, or controller/service/repository layers. Keep it small — finish in one day.
