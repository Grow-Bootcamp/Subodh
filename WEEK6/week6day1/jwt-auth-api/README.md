# JWT Auth API

A minimal **Node.js + Express + TypeScript** REST API starter for practicing **JWT authentication**.

> **Note:** JWT generation, JWT verification, and the authentication middleware logic are **intentionally left as `TODO` comments** for learning. Everything else (routing, validation, config, error handling) is complete so the project runs immediately after installation.

## Prerequisites

- Node.js 18+ (Node 20/22+ recommended)
- npm

## Installation

```bash
npm install
```

## Environment setup

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=3000
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

`JWT_SECRET` must be at least 16 characters. The app **exits on startup** if required variables are missing or invalid.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run typecheck` | Type-check without emitting files |

## Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Validates credentials against a demo user, returns a token (`null` until you implement `jwt.sign`) |
| `GET` | `/api/protected/profile` | JWT | Returns the authenticated user's profile |

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Success (200):

```json
{
  "token": null,
  "user": { "id": "1", "name": "Demo User", "email": "user@example.com" }
}
```

`token` is `null` until you complete the `jwt.sign` TODO in `src/controllers/auth.controller.ts`.

### Protected route

```http
GET /api/protected/profile
Authorization: Bearer <JWT>
```

Until you implement the verification TODOs in `src/middleware/auth.middleware.ts`, this route responds **401** (`Authentication not implemented yet`) — requests never pass through unauthenticated.

## Project structure

```text
jwt-auth-api/
├── src/
│   ├── config/
│   │   └── env.ts              # Zod-validated environment configuration
│   ├── controllers/
│   │   └── auth.controller.ts  # login + profile handlers
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT auth middleware (TODOs)
│   │   ├── error.middleware.ts # ApiError + centralized error handler
│   │   └── validate.middleware.ts # reusable Zod validation
│   ├── routes/
│   │   ├── auth.routes.ts      # /api/auth
│   │   └── protected.routes.ts # /api/protected
│   ├── schemas/
│   │   └── auth.schema.ts      # login Zod schema
│   ├── types/
│   │   └── auth.types.ts       # AuthUser, AppJwtPayload, req.user typing
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # startup
├── docs/
│   └── learning-log.md
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## JWT TODOs to implement

1. `src/controllers/auth.controller.ts` — sign the token with `jwt.sign()` using `env.JWT_SECRET` and `env.JWT_EXPIRES_IN`.
2. `src/middleware/auth.middleware.ts` — read the `Authorization` header (7 numbered TODOs: header → `Bearer` scheme → extract → `jwt.verify` → expired/invalid handling → attach `req.user` → `next()`).
3. Optional: map `TokenExpiredError` / `JsonWebTokenError` to 401 in `src/middleware/error.middleware.ts`.
4. Document what you learned in `docs/learning-log.md`.
