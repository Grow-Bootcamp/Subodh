/**
 * Small error type used across the app so the error handler knows
 * which HTTP status to respond with.
 *
 * Usage: next(new ApiError(401, 'Invalid credentials'))
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
