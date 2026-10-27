# React Auth and RBAC — Learning Log

Date: 2026-10-26

## Topics studied
- Authentication vs. authorization
- Express JWT login endpoint and role middleware
- Shared frontend auth state with React Context
- Protected routes with React Router's `Outlet` and `Navigate`
- Role-based route and UI checks

## What I implemented
- Backend: `POST /api/auth/login` verifies demo credentials and issues a signed JWT; `requireAuth` middleware returns `401` for missing/invalid tokens; `requireAdmin` middleware returns `403` for non-admin users; `/api/admin` combines both checks.
- Frontend: `AuthContext` holds `user`, `token`, `login`, `logout`; `RequireAuth` and `RequireRole` guard routes; login/dashboard/admin pages; conditional admin link in the dashboard.

## Key findings
- `requireAuth` checks that a caller is signed in (401 otherwise); `requireAdmin` additionally checks the role from the verified token (403 otherwise).
- `AuthContext` lets any component read shared auth state without prop drilling; `useAuth()` throws outside `AuthProvider`.
- Hiding the admin link in React is UX only — the backend still enforces the role on `/api/admin`, so frontend guards are not a security boundary.

## Tests performed
- Signed-out `/` redirects to `/login`.
- `learner / user123` → dashboard, no admin link; `/admin` → redirected to `/`.
- `admin / admin123` → dashboard with admin link; `/admin` → backend confirms access.
- `GET /api/auth/me` without token → 401; learner token → `/api/admin` → 403; admin token → `/api/admin` → 200.
- Frontend build and backend build both pass.

## Links
- Branch: week7day2
- Pull Request: (to be created)
