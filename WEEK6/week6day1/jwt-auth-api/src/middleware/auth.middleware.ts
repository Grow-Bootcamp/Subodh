import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../errors/api-error.js";
import type { AppJwtPayload } from "../types/auth.types.js";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return next(new ApiError(401, "Authentication required", "AUTH_REQUIRED"));
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new ApiError(401, "Invalid authorization header", "INVALID_AUTH_HEADER"),
    );
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, env.JWT_SECRET) as AppJwtPayload;

    if (!decoded.user) {
      return next(new ApiError(401, "Invalid token", "INVALID_TOKEN"));
    }

    req.user = decoded.user;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, "Token has expired", "TOKEN_EXPIRED"));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, "Invalid token", "INVALID_TOKEN"));
    }

    return next(error);
  }
};
