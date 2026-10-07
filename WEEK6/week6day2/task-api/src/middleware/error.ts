import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { ZodError } from "zod";

/** 404 for any route that matched nothing. */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
};

/**
 * Centralized error handling: 400 / 401 / 403 / 404 / 500.
 * No custom error classes: handlers respond directly with `res.status(...)`,
 * and anything thrown with a `statusCode` (or a ZodError) is mapped here.
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      })),
    });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof (err as { statusCode: unknown }).statusCode === "number"
  ) {
    const { statusCode, message } = err as { statusCode: number; message?: string };
    res.status(statusCode).json({ error: message ?? "Request failed" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
