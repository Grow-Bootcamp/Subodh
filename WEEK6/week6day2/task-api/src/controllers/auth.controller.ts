import type { Request, Response } from "express";
import { loginSchema } from "../schemas/auth.schema.js";

/**
 * Cookie names for both tokens.
 *
 * TODO:
 * Use HttpOnly cookies so client-side JavaScript cannot directly
 * read the tokens. Use Secure in production and an appropriate
 * SameSite setting.
 */
const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

/**
 * POST /api/auth/login
 *
 * TODO:
 * 1. Validate the body with `loginSchema`.
 * 2. Find the user by email.
 * 3. Verify the password (plain-text demo data; compare it directly).
 * 4. Sign an access JWT (`type: "access"`, `JWT_ACCESS_EXPIRES_IN`).
 * 5. Sign a refresh JWT (`type: "refresh"`, `JWT_REFRESH_EXPIRES_IN`).
 * 6. Set both as HttpOnly cookies (`ACCESS_COOKIE`, `REFRESH_COOKIE`).
 * 7. Return safe user info `{ id, email, role }`.
 */
export const login = (req: Request, res: Response): void => {
  loginSchema.parse(req.body); // validation only; the rest is your TODO

  void ACCESS_COOKIE;
  void REFRESH_COOKIE;

  res.status(501).json({ error: "Not implemented: login" });
};

/**
 * POST /api/auth/refresh
 *
 * TODO:
 * 1. Read the `refresh_token` cookie.
 * 2. Verify it with `JWT_REFRESH_SECRET`.
 * 3. Check the payload `type === "refresh"`.
 * 4. Resolve the user from `sub`.
 * 5. Sign a new access token.
 * 6. Replace the `access_token` cookie.
 *
 * TODO NOTE:
 * Production systems may rotate refresh tokens and track them server-side
 * for stronger revocation/reuse protection. This project intentionally
 * omits that complexity.
 */
export const refresh = (_req: Request, res: Response): void => {
  res.status(501).json({ error: "Not implemented: refresh" });
};

/**
 * POST /api/auth/logout
 *
 * TODO:
 * Clear the `access_token` cookie.
 * Clear the `refresh_token` cookie.
 */
export const logout = (_req: Request, res: Response): void => {
  res.status(501).json({ error: "Not implemented: logout" });
};

/**
 * GET /api/auth/me
 * Protected by `authenticate`.
 *
 * TODO NOTE:
 * For production systems, server-side sessions/session stores can
 * also be used. This project uses short-lived JWT access tokens plus
 * a refresh token to practice token-based session management.
 */
export const getMe = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.status(200).json({ user: req.user });
};
