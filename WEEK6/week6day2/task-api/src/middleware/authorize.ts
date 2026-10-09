import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error.js";
import { UserRole } from "../types/auth.js";

/**
 * Role-based authorization middleware factory.
 *
 * Usage:
 *   authorize(UserRole.ADMIN)
 *   authorize(UserRole.ADMIN, UserRole.USER)
 *
 * Runs after `authenticate`, so `req.user` should already be set.
 * Missing user → 401, role not allowed → 403, otherwise `next()`.
 *
 * NOTE: role checks are always enforced on the server. Client-side
 * checks are only a UX shortcut, never a security boundary.
 */
export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        new ApiError(401, "Authentication required", "AUTH_REQUIRED"),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden", "FORBIDDEN"));
    }

    return next();
  };
