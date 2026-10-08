export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

/** Demo user record (plain-text password, in-memory only). */
export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
}

/** Safe subset of the user sent back to the client. */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

/** Access JWT payload: { sub: "2", email, role, type: "access" } */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: "access";
}

/** Refresh JWT payload: { sub: "2", type: "refresh" } */
export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
}

declare global {
  namespace Express {
    interface Request {
      /** Set by the `authenticate` middleware. */
      user?: AuthenticatedUser;
    }
  }
}
