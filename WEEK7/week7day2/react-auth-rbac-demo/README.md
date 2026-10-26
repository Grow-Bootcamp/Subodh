# Tiny Full-Stack Project: Login + Protected Admin Page

## Goal
A small React app that logs in to an Express API. A signed-in user can see the dashboard. Only an admin can open the admin page, and the backend independently checks the role too.

This is a learning demo, not a production auth system:
- Two demo accounts, JWT held in React memory (refresh = logged out).
- No database, refresh tokens, registration, or password-reset flow.
- Not suitable for deployment as-is.

## Structure

```
react-auth-rbac-demo/
├── .gitignore
├── README.md
├── docs/learning-log.md
├── frontend/
│   ├── .env.example            # public API base URL (real .env is gitignored)
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   └── src/
│       ├── AuthContext.tsx     # shared auth state via React Context
│       ├── RouteGuards.tsx     # RequireAuth, RequireRole route guards
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── AdminPage.tsx
│       ├── App.tsx             # client routes
│       ├── main.tsx
│       └── index.css
└── backend/
    ├── .env.example            # JWT_SECRET placeholder (real .env is gitignored)
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    └── src/index.ts            # JWT auth API with role middleware
```

## Run locally

```bash
# Backend (port defaults to 4000 via backend/.env.example)
cd backend
cp .env.example .env   # add JWT_SECRET
npm run dev

# Frontend (port defaults to 5173)
cd frontend
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. Demo credentials:

| Account | Username | Password |
|---------|----------|----------|
| Learner | learner  | user123  |
| Admin   | admin    | admin123 |

## What to test

- [ ] Open `/` while logged out → redirects to `/login`.
- [ ] Log in as `learner / user123` → dashboard appears, no admin link.
- [ ] Enter `/admin` as learner → frontend redirects to `/`.
- [ ] Log in as `admin / admin123` → dashboard shows admin link.
- [ ] Open `/admin` → backend confirms admin access.
- [ ] Log out → redirected to `/login`.
- [ ] `GET /api/auth/me` without a token → `401`.
- [ ] Learner token → `GET /api/admin` → `403` (backend enforces role).
- [ ] Admin token → `GET /api/admin` → `200`.
- [ ] `cd frontend && npm run build` succeeds.
- [ ] `cd backend && npm run build` succeeds.

## Why this matters

- Authentication = "who is signed in"; authorization = "what they may access".
- `AuthContext` exposes `user`, `token`, `login`, `logout` through `useAuth()`.
- `RequireAuth` protects routes from signed-out users; `RequireRole` restricts pages by role.
- Frontend guards are UX only — the backend independently enforces authorization on `/api/admin`.

## Git submission

```bash
git checkout -b week7day2
git add .
git commit -m "feat: practise React auth and role-based routes"
git push -u origin week7day2
# Then open a PR and post the PR link + learning-log link.
```
