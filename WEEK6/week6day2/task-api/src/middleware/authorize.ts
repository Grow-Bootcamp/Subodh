import type { NextFunction, Request, Response } from "express";
import { UserRole } from "../types/auth.js";

/**
 * Role-based authorization middleware factory.
 *
 * Usage:
 *   authorize(UserRole.ADMIN)
 *   authorize(UserRole.ADMIN, UserRole.USER)
 *
 * TODO:
 * 1. Read `req.user` (set by `authenticate`); 401 if missing.
 * 2. Read `req.user.role`.
 * 3. Compare it against `allowedRoles`.
 * 4. Return 403 when the role is not allowed.
 * 5. Call `next()` when authorized.
 */
export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    void req;
    void allowedRoles;
    res.status(403).json({ error: "Not implemented: authorize middleware" });
  };
