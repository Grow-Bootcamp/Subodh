import type { JwtPayload } from 'jsonwebtoken';

/**
 * The user information you want to carry inside a JWT.
 * Keep this small: everything in here is readable by anyone who holds the token.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Shape of the decoded token produced by jwt.sign() and returned by jwt.verify().
 * Extends the library's JwtPayload so standard claims (iat, exp, iss, ...) are typed.
 */
export interface AppJwtPayload extends JwtPayload {
  user: AuthUser;
}

/**
 * Attach `user` to every request so controllers can read req.user
 * after the auth middleware has verified the token.
 *
 * TODO (learning): after implementing auth.middleware.ts, this is what makes
 * `req.user` type-safe instead of `any`.
 */
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}
