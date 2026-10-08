import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isProduction, env } from "../config/env.js";
import { findUserByEmail, findUserById } from "../data/users.js";
import { loginSchema } from "../schemas/auth.schema.js";
import type {
  AccessTokenPayload,
  AuthenticatedUser,
  RefreshTokenPayload,
} from "../types/auth.js";

/**
 * Cookie names for both tokens.
 *
 * TODO NOTE (done):
 * HttpOnly cookies are used so client-side JavaScript cannot directly
 * read the tokens. Secure is enabled in production and SameSite=Lax
 * blocks most cross-site request forgery.
 */
const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

/** Refresh cookie lifetime: 30 days, matching JWT_REFRESH_EXPIRES_IN. */
const REFRESH_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
} as const;

const toPublicUser = (user: {
  id: number;
  email: string;
  role: AuthenticatedUser["role"];
}): AuthenticatedUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

/**
 * POST /api/auth/login
 *
 * Steps: validate body → find user → compare password →
 * sign access + refresh JWTs → set HttpOnly cookies → return safe user.
 */
export const login = (req: Request, res: Response): void => {
  const { email, password } = loginSchema.parse(req.body);

  const user = findUserByEmail(email);
  // Same message for unknown email and wrong password: never reveal
  // whether an account exists.
  if (!user || user.password !== password) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }

  const accessTokenPayload: AccessTokenPayload = {
    sub: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  };

  const refreshTokenPayload: RefreshTokenPayload = {
    sub: user.id.toString(),
    type: "refresh",
  };

  const accessToken = jwt.sign(accessTokenPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign(refreshTokenPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  // Access cookie is a session cookie (no maxAge): it should die with the
  // browser session and is only kept alive by calling /api/auth/refresh.
  res.cookie(ACCESS_COOKIE, accessToken, baseCookieOptions);
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_MAX_AGE_MS,
  });

  res.status(200).json({ success: true, user: toPublicUser(user) });
};

/**
 * POST /api/auth/refresh
 *
 * Flow: refresh_token cookie → verify (refresh secret) → check type →
 * resolve user from sub → sign new access token → replace access_token
 * cookie. The new access token is never returned in the response body.
 *
 * TODO NOTE:
 * Production systems may rotate refresh tokens and track them server-side
 * for stronger revocation/reuse protection. This project intentionally
 * omits that complexity.
 */
export const refresh = (req: Request, res: Response): void => {
  const refreshToken = req.cookies[REFRESH_COOKIE] as string | undefined;

  if (!refreshToken) {
    res.status(401).json({ success: false, message: "Refresh token missing" });
    return;
  }

  let payload: RefreshTokenPayload;
  try {
    payload = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET,
    ) as RefreshTokenPayload;
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
    return;
  }

  if (payload.type !== "refresh") {
    res.status(401).json({ success: false, message: "Invalid token type" });
    return;
  }

  const user = findUserById(Number(payload.sub));
  if (!user) {
    res.status(401).json({ success: false, message: "User no longer exists" });
    return;
  }

  const accessTokenPayload: AccessTokenPayload = {
    sub: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  };

  const accessToken = jwt.sign(accessTokenPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  res.cookie(ACCESS_COOKIE, accessToken, baseCookieOptions);
  res.status(200).json({ success: true, user: toPublicUser(user) });
};

/**
 * POST /api/auth/logout
 *
 * Clears the `access_token` and `refresh_token` cookies.
 */
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(ACCESS_COOKIE, baseCookieOptions);
  res.clearCookie(REFRESH_COOKIE, baseCookieOptions);
  res.status(200).json({ success: true, message: "Logged out" });
};

/**
 * GET /api/auth/me
 * Protected by `authenticate`.
 *
 * TODO NOTE:
 * For production systems, server-side sessions/session stores can
 * also be used. This project uses short-lived JWT access tokens plus
 * a refresh token to practice token-based session management.
 */
export const getMe = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  res.status(200).json({ success: true, user: req.user });
};
