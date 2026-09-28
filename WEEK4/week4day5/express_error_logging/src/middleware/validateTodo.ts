import { Request, Response, NextFunction } from "express";
import logger from "../logger.js";

const validateTodo = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    logger.warn("Invalid todo request");
    res.status(400).json({
      message: "Valid title is required",
    });
    return;
  }
  next();
};

export default validateTodo;
