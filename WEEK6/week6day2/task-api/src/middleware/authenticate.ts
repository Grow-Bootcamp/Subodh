import type { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../data/users.js";
import { ApiError } from "../errors/api-error.js";
import type { AccessTokenPayload } from "../types/auth.js";

const ACCESS_COOKIE = "access_token";

/**
 * Authentication middleware — cookie-based, not the Authorization header.
 *
 * Steps: read `access_token` from `req.cookies` → reject when missing →
 * verify the JWT with `JWT_ACCESS_SECRET` → ensure `type === "access"` →
 * build `{ id, email, role }` → attach to `req.user` → `next()`.
 * Any failure responds 401.
 */
export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[ACCESS_COOKIE] as string | undefined;

  if (!token) {
    return next(new ApiError(401, "Authentication required", "AUTH_REQUIRED"));
  }

  let payload: AccessTokenPayload;
  try {
    payload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as AccessTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new ApiError(401, "Access token expired", "TOKEN_EXPIRED"),
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, "Invalid access token", "INVALID_TOKEN"));
    }
    return next(error);
  }

  if (payload.type !== "access") {
    return next(
      new ApiError(401, "Wrong token type, access token required", "INVALID_TOKEN_TYPE"),
    );
  }

  const user = findUserById(Number(payload.sub));
  if (!user) {
    return next(new ApiError(401, "User no longer exists", "USER_NOT_FOUND"));
  }

  req.user = { id: user.id, email: user.email, role: user.role };
  return next();
};
