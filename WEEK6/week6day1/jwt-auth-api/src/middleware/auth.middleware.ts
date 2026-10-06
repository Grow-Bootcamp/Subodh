import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { env } from '../config/env';
import { ApiError } from './error.middleware';

/**
 * JWT authentication middleware.
 *
 * Flow:
 *   Authorization: Bearer <token>
 *        |
 *   Extract token
 *        |
 *   Verify JWT (signature + exp + optional issuer)
 *        |
 *   Attach decoded user data to req.user
 *        |
 *   next() -> controller runs
 *
 * Status codes:
 *   401 Unauthorized -> missing / invalid / expired token
 *   403 Forbidden    -> token is valid but the user lacks permission (reserve for later)
 */
export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // ---------------------------------------------------------------------
  // TODO 1: Read the Authorization header
  //   const header = req.get('authorization') ?? req.headers.authorization;
  //   If missing -> next(new ApiError(401, 'Missing Authorization header'))
  //
  // TODO 2: Check for the Bearer scheme
  //   Header format: "Bearer <token>"
  //   Split on the first space, compare scheme case-insensitively.
  //   If it is not Bearer -> next(new ApiError(401, 'Authorization header must use the Bearer scheme'))
  //
  // TODO 3: Extract the token
  //   const token = parts[1];
  //   If empty -> next(new ApiError(401, 'No token provided'))
  //
  // TODO 4: Verify the JWT
  //   import jwt from 'jsonwebtoken';
  //   import type { AppJwtPayload } from '../types/auth.types';
  //   const decoded = jwt.verify(token, env.JWT_SECRET, {
  //     issuer: env.JWT_ISSUER, // only pass this if JWT_ISSUER is set
  //   }) as AppJwtPayload;      // jwt.verify returns string | JwtPayload
  //
  // TODO 5: Handle expired / invalid tokens
  //   Wrap the verify call in try/catch:
  //     - TokenExpiredError  -> next(new ApiError(401, 'Token expired', 'TOKEN_EXPIRED'))
  //     - JsonWebTokenError  -> next(new ApiError(401, 'Invalid token', 'INVALID_TOKEN'))
  //   Never respond 500 for a bad token: that is a client problem (401).
  //
  // TODO 6: Attach the decoded user information to the request
  //   req.user = decoded.user;                 // typed via src/types/auth.types.ts
  //   (or res.locals.user = decoded.user; if you prefer that style)
  //
  // TODO 7: Call next() so the request continues to the controller.
  //   ---------------------------------------------------------------------

  // TEMPORARY: fail closed until the TODOs above are implemented.
  // Requests never reach the controller unauthenticated.
  // DELETE this line and finish TODOs 1-7 to let verified tokens through.
  next(
    new ApiError(
      401,
      'Authentication not implemented yet - see TODOs in src/middleware/auth.middleware.ts',
      'AUTH_NOT_IMPLEMENTED',
    ),
  );
};
