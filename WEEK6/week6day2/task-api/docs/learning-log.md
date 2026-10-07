# JWT Session + RBAC Learning Log

> Fill in each section yourself. Do not copy-paste answers you have not verified.

## Authentication vs Authorization

> TODO: In 2-3 sentences, define authentication ("who are you") and
> authorization ("what are you allowed to do") and point to one place in
> this codebase where each happens.

## JWT Structure

> TODO: Describe the three parts of a JWT (header, payload, signature) and
> why the payload is only encoded, not encrypted.

## Access Tokens

> TODO: Paste the conceptual access payload from `src/types/auth.ts` and
> explain what `sub`, `role` and `type` are used for.

## Refresh Tokens

> TODO: Explain why the refresh payload is smaller than the access payload,
> and where the refresh token is read from in this project.

## User Sessions

> TODO: Explain how a stateless JWT still represents a "session", and what
> the server no longer has to store.

## HttpOnly Cookies

> TODO: Explain what HttpOnly, Secure and SameSite each protect against,
> and how to verify in browser dev tools that a cookie is HttpOnly.

## Token Expiration

> TODO: Explain why the access token is short-lived (1m here) while the
> refresh token has a longer lifetime (30d here).

## Refresh Flow

> TODO: Draw the refresh sequence: expired access cookie → `POST
> /api/auth/refresh` → verified refresh token → new access cookie →
> protected route succeeds.

## Logout

> TODO: Explain why clearing cookies is the client-visible part of logout,
> and what a stateless JWT setup still cannot revoke on its own.

## Role-Based Access Control

> TODO: Compare role-based checks (`authorize(UserRole.ADMIN)`) with
> resource-level checks (owner of a task) using the routes in this project.

## Resource Ownership

> TODO: Using `GET /api/tasks/:id`, write the exact condition that decides
> between 200 and 403 for a USER.

## 401 vs 403

> TODO: Give one example request that should return 401 and one that
> should return 403, and explain the difference in one line each.

## Libraries Studied

### Passport.js

> TODO: What does Passport provide? List 2-3 common strategies
> (e.g. local, jwt, oauth2) and why this project does not install it.

### bcrypt

> TODO: What problem does password hashing solve? What is a salt, and why
> does this project's demo data skip hashing?

### express-jwt

> TODO: What does the `express-jwt` middleware do, and how does it compare
> to writing your own `authenticate` middleware?

### jsonwebtoken

> TODO: Note the two functions you will use (`sign`, `verify`), their main
> options (`expiresIn`, `algorithm`), and the error thrown on expiry.

## Important Findings

> TODO: 3-5 bullet points of things you discovered while implementing.

## Code Snippets

> TODO: Paste your own snippets: JWT signing, cookie setting, the
> authenticate middleware, the authorize factory, the ownership check.

## Problems Encountered

> TODO: What broke, how you diagnosed it (logs, curl, dev tools), and how
> you fixed it.

## Key Takeaways

> TODO: 3-5 sentences summarizing what you would do differently next time.
