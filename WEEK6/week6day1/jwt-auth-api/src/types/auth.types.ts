import type { JwtPayload } from "jsonwebtoken";

/**
 * The user information you want to carry inside a JWT.
 * Keep this small: everything in here is readable by anyone who holds the token.
 */
export interface AuthUser {
  id: string;
  role: string; // optional role for authorization (e.g., "admin", "user")
  email?: string;
  name?: string;
}

/**
 * Shape of the decoded token produced by jwt.sign() and returned by jwt.verify().
 * Extends the library's JwtPayload so standard claims (iat, exp, iss, ...) are typed.
 */
export interface AppJwtPayload extends JwtPayload {
  user: AuthUser;
  iat?: number; // issued at (seconds since epoch)
  exp?: number; // expiration time (seconds since epoch)
  iss?: string; // optional issuer claim for additional security
}

/**
 * Attach `user` to every request so controllers can read req.user
 * after the auth middleware has verified the token.
 *
 * TODO (learning): after implementing auth.middleware.ts, this is what makes
 * `req.user` type-safe instead of `any`.
 */
declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}
