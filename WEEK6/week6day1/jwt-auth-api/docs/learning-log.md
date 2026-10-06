# JWT Authentication Learning Log

> Fill in each section as you study. The prompts are hints, not answers — write your own words.

## Topics Studied

- What I researched (articles, docs, videos):
- Terms I had to look up:

## JWT Structure

- Header:
- Payload:
- Signature:
- Which parts are base64url-encoded? Are they encrypted?
- Diagram of a token:

## Signing

- What does `jwt.sign()` do step by step?
- Which secret/config came from where (`env.ts`)?
- What `expiresIn` produced in the decoded payload:
- What `issuer` is for:

## Verification

- What does `jwt.verify()` check, and in what order?
- What happens when the signature is wrong:
- What happens when the token is expired (`TokenExpiredError`):
- Why verification must never happen on the client only:

## Authentication Middleware

- The 7 steps I implemented in `auth.middleware.ts`:
- Where I attached the decoded user (`req.user` vs `res.locals`) and why:
- Why the middleware fails closed (401) instead of calling `next()`:

## Protected Routes

- Which route uses the middleware, and where is it registered:
- What changes in the controller once `req.user` exists:

## Authorization Header

- Exact header format:
- Difference between 401 and 403:

## Important Findings

- Surprising or useful things I discovered:

## Code Snippets

Paste the snippets you wrote or adapted (sign call, verify call, middleware excerpt):

```ts
// jwt.sign ...
```

```ts
// jwt.verify ...
```

## Problems Encountered

- Errors I hit (TypeScript, runtime, curl) and how I fixed them:

## Key Takeaways

- What I would tell someone else learning JWT auth:
