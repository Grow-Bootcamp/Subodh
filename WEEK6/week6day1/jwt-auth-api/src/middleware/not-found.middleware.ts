import type { RequestHandler } from "express";
import { ApiError } from "../errors/api-error.js";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new ApiError(404, "Route not found", "ROUTE_NOT_FOUND"));
};
