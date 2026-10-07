import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error.js";
import type { LoginInput } from "../schemas/auth.schema";
import type { AuthUser } from "../types/auth.types";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { AppJwtPayload } from "../types/auth.types";

/**
 * DEMO ONLY — in-memory user so you can practice the login flow.
 * No database, no password hashing (the learning goal here is JWT, not user storage).
 * Never ship a plain-text password like this in a real app.
 */
const DEMO_USER = {
  id: "1",
  name: "Demo User",
  email: "user@example.com",
  password: "password123",
  role: "user",
} as const;

/**
 * POST /api/auth/login
 *
 * Flow:
 *   Receive credentials
 *      |
 *   Validate request body        <- done by validate middleware (Zod)
 *      |
 *   Check sample user            <- done below
 *      |
 *   Generate JWT                 <- YOUR TODO
 *      |
 *   Return token
 */
export function login(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body as LoginInput;

  // Credential check against the demo user(should be with actual db).
  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    next(new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS"));
    return;
  }

  const user: AuthUser = {
    id: DEMO_USER.id,
    role: DEMO_USER.role,
  };

  const payload: AppJwtPayload = { user, iat: Math.floor(Date.now() / 1000) };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  if (!token) {
    next(
      new ApiError(500, "Failed to generate token", "TOKEN_GENERATION_FAILED"),
    );
    return;
  }

  res.status(200).json({ token, message: "Login successful" });
  return;
}

/**
 * GET /api/protected/profile
 *
 * Runs only after auth.middleware.ts verified the token
 * and attached the decoded user to req.user.
 */
export function getProfile(
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  res.status(200).json({
    user: {
      id: req.user?.id,
      name: req.user?.name,
      role: req.user?.role,
    },
  });
  return;
}
