import type { NextFunction, Request, Response } from "express";

/**
 * Authentication middleware (cookie-based, not Authorization header).
 *
 * TODO:
 * 1. Read `access_token` from `req.cookies`.
 * 2. Reject with 401 when it is missing.
 * 3. Verify the JWT with `JWT_ACCESS_SECRET`.
 * 4. Ensure the payload `type === "access"`.
 * 5. Build `{ id, email, role }` from the payload (`sub` is a string id).
 * 6. Attach it to `req.user`.
 * 7. Call `next()`.
 * 8. Respond 401 for any verification failure (expired, bad signature, wrong type).
 */
export const authenticate = (
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(401).json({ error: "Not implemented: authenticate middleware" });
};
