import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      })),
    });
  }

  // Expected application errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.code && {
        code: err.code,
      }),
    });
  }

  // Unexpected errors
  console.error(err);

  return res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};
