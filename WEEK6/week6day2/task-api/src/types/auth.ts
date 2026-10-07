export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
}

/** Safe subset of the user that is sent back to the client. */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

/** Conceptual shape of the access JWT payload. */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: "access";
}

/** Conceptual shape of the refresh JWT payload. */
export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
}

declare global {
  namespace Express {
    interface Request {
      /** Set by the `authenticate` middleware once you implement it. */
      user?: AuthenticatedUser;
    }
  }
}
