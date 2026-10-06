import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../middleware/error.middleware';
import type { LoginInput } from '../schemas/auth.schema';
import type { AuthUser } from '../types/auth.types';

/**
 * DEMO ONLY — in-memory user so you can practice the login flow.
 * No database, no password hashing (the learning goal here is JWT, not user storage).
 * Never ship a plain-text password like this in a real app.
 */
const DEMO_USER = {
  id: '1',
  name: 'Demo User',
  email: 'user@example.com',
  password: 'password123',
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

  // Credential check against the demo user.
  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    next(new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS'));
    return;
  }

  const user: AuthUser = {
    id: DEMO_USER.id,
    name: DEMO_USER.name,
    email: DEMO_USER.email,
  };

  // ---------------------------------------------------------------------
  // TODO: Generate the JWT with jsonwebtoken.
  //
  //   import jwt from 'jsonwebtoken';
  //   import { env } from '../config/env';
  //   import type { AppJwtPayload } from '../types/auth.types';
  //
  //   const payload: AppJwtPayload = { user };
  //   const token = jwt.sign(payload, env.JWT_SECRET, {
  //     expiresIn: env.JWT_EXPIRES_IN,   // e.g. '1h' from .env
  //     issuer: env.JWT_ISSUER,          // only if JWT_ISSUER is set
  //   });
  //
  // Notes:
  //   - The secret MUST come from env.ts, never hard-coded.
  //   - If TypeScript rejects `string` for `expiresIn`, cast it:
  //       expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  //   - Replace `const token = null` below with your signed token.
  // ---------------------------------------------------------------------
  const token = null;

  res.status(200).json({ token, user });
}

/**
 * GET /api/protected/profile
 *
 * Runs only after auth.middleware.ts verified the token
 * and attached the decoded user to req.user.
 */
export function getProfile(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    // Defensive: should be unreachable once the auth middleware is implemented.
    next(new ApiError(401, 'Not authenticated', 'NOT_AUTHENTICATED'));
    return;
  }

  res.status(200).json({ user: req.user });
}
