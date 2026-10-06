import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Anything with a parse() method works (Zod schemas do),
 * which keeps this middleware independent from a specific zod version.
 */
type Parser<T> = {
  parse: (data: unknown) => T;
};

/**
 * Reusable validation middleware.
 *
 * Usage in a route:
 *   router.post('/login', validate(loginSchema), controller)
 *
 * On success  -> req.body is replaced with the parsed/typed value, next() runs
 * On failure  -> the ZodError is forwarded to the centralized error handler (400)
 */
export function validate<T>(schema: Parser<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
