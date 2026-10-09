# task-api

Minimal Express + TypeScript Task Management REST API scaffold for learning
JWT authentication, HttpOnly cookie sessions, and Role-Based Access Control.

**Scaffold status:** routes, validation, types, and demo data exist.
All authentication/authorization logic is left as `TODO` for you to implement.

## Setup

```bash
npm install
cp .env.example .env   # a dev .env is already provided in this workspace
```

## Environment variables

| Key | Purpose |
| --- | --- |
| `PORT` | Server port (3000) |
| `JWT_ACCESS_SECRET` | Secret used to sign/verify access tokens |
| `JWT_REFRESH_SECRET` | Secret used to sign/verify refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (`1m` for testing) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (max `30d`) |
| `NODE_ENV` | `development` \| `production` \| `test` |

Validated with Zod in `src/config/env.ts`. Never hard-code secrets.

## Run

```bash
npm run dev        # tsx watch src/server.ts
npm run build      # tsc
npm start          # node dist/server.js
npm run typecheck  # tsc --noEmit
```

## Demo users (in-memory, no database, no hashing)

| Role | Email | Password |
| --- | --- | --- |
| admin | admin@example.com | password123 |
| user | user@example.com | password123 |

Demo tasks live in `src/data/tasks.ts` (ownerId 1 = admin, 2 = user).

## API routes

| Method | Route | Middleware | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | — | returns access + refresh cookies |
| POST | `/api/auth/refresh` | — | renews the access cookie |
| POST | `/api/auth/logout` | — | clears both cookies |
| GET | `/api/auth/me` | `authenticate` | current user |
| GET | `/api/tasks` | `authenticate` | user → own tasks, admin → all |
| POST | `/api/tasks` | `authenticate` | authenticated action |
| GET | `/api/tasks/:id` | `authenticate` | resource ownership check |
| DELETE | `/api/tasks/:id` | `authenticate`, `authorize(ADMIN)` | role-based check |

### Why these routes

```text
GET    /tasks     → filtering by ownership/role
POST   /tasks     → authenticated action
GET    /tasks/:id → resource ownership authorization
DELETE /tasks/:id → role-based authorization
```

## Session / token flow

```text
Login
  ↓
Access JWT (1m) + Refresh JWT (30d)
  ↓
HttpOnly cookies: access_token, refresh_token
  ↓
Protected route
  ↓
authenticate  → verifies access_token, attaches req.user
  ↓
authorize(role) → 403 when the role is not allowed
  ↓
controller → ownership decision (if any) → response
```

Access token expires after ~1 minute; call `POST /api/auth/refresh` to get a
new one. Refresh token lasts up to 30 days.

## Cookie-based authentication

Both tokens are stored in HttpOnly cookies, so client-side JavaScript cannot
read them. Set `Secure` in production and choose an appropriate `SameSite`
value — see the TODO in `src/controllers/auth.controller.ts`.

This project deliberately uses short-lived JWTs + a refresh token instead of
server-side session stores (no Redis, no session-store package).

## RBAC rules

| Action | USER | ADMIN |
| --- | --- | --- |
| list tasks | own tasks only | all tasks |
| create task | yes | yes |
| view task by id | own task only | any task |
| delete task | 403 Forbidden | yes |

## Task ownership rules

Every task has an `ownerId`. `GET /api/tasks/:id` must return **403** when a
USER asks for another user's task, and **200** when an ADMIN asks for it.

## Manual testing scenarios

| # | Request | Expected (after your implementation) |
| --- | --- | --- |
| 1 | `POST /api/auth/login` | `access_token` + `refresh_token` cookies set |
| 2 | `GET /api/auth/me` | authenticated user object |
| 3 | `POST /api/tasks` | authenticated user can create |
| 4 | `GET /api/tasks` | user → own tasks, admin → all tasks |
| 5 | USER → `GET /api/tasks/:id` (someone else's) | 403 Forbidden |
| 6 | ADMIN → `GET /api/tasks/:id` (someone else's) | 200 OK |
| 7 | USER → `DELETE /api/tasks/:id` | 403 Forbidden |
| 8 | ADMIN → `DELETE /api/tasks/:id` | 200 OK |
| 9 | wait ~1 min, request a protected route | 401 access token expired, then `POST /api/auth/refresh` → new `access_token` |
| 10 | `POST /api/auth/logout` | both cookies cleared |

## Project structure

```text
task-api/
├── src/
│   ├── config/env.ts
│   ├── controllers/auth.controller.ts
│   ├── controllers/task.controller.ts
│   ├── middleware/authenticate.ts
│   ├── middleware/authorize.ts
│   ├── middleware/error.ts
│   ├── routes/auth.routes.ts
│   ├── routes/task.routes.ts
│   ├── data/users.ts
│   ├── data/tasks.ts
│   ├── schemas/auth.schema.ts
│   ├── schemas/task.schema.ts
│   ├── types/auth.ts
│   ├── types/task.ts
│   ├── app.ts
│   └── server.ts
├── docs/learning-log.md
├── .env.example
├── package.json
└── tsconfig.json
```

## Intentionally not included

Registration, password reset, email verification, OAuth, database/ORM, Redis,
session store, refresh-token rotation, token blacklist, Passport.js, bcrypt,
express-jwt, frontend, Docker.
