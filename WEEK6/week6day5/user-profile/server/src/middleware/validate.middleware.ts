import type { NextFunction, Request, RequestHandler, Response } from "express";

type Parser<T> = {
  parse: (data: unknown) => T;
};

export function validate<T>(schema: Parser<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
