import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

/**
 * Small error type used across the app so the error handler knows
 * which HTTP status to respond with.
 *
 * Usage: next(new ApiError(401, 'Invalid credentials'))
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Centralized error handler.
 * Express recognizes it by its 4 (err, req, res, next) signature.
 *
 * Structure:
 *  1. validation errors  (ZodError)      -> 400
 *  2. known errors       (ApiError)      -> its own statusCode (401, 403, 404, ...)
 *  3. unexpected errors  (anything else) -> 500
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 1. Validation errors coming from validate.middleware.ts
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.') || '(root)',
        message: issue.message,
      })),
    });
    return;
  }

  // 2. Errors we deliberately created (auth failures, 404, ...)
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
    return;
  }

  // TODO (learning): once you implement auth.middleware.ts, you may forward
  // jsonwebtoken errors directly (next(err)) instead of wrapping them.
  // Map them here to 401 so expired/invalid tokens never look like server errors:
  //
  //   import { TokenExpiredError, JsonWebTokenError, NotBeforeError } from 'jsonwebtoken';
  //   if (err instanceof TokenExpiredError) -> 401 'Token expired'
  //   if (err instanceof JsonWebTokenError) -> 401 'Invalid token'
  //   if (err instanceof NotBeforeError)    -> 401 'Token not active yet'

  // 3. Unexpected server errors — never leak internals to the client
  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'Internal server error',
  });
}

/** 404 handler: any request that never matched a route lands here. */
export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, 'Route not found', 'ROUTE_NOT_FOUND'));
}
