import { Request, Response } from "express";
import { AppSource } from "../config/db.js";
import User from "../entities/User.js";

const userRepo = AppSource.getRepository(User);

const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  if (
    typeof user !== "object" ||
    user === null ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    typeof user.role !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
    });
  }

  const existingUser = await userRepo.findOneBy({ email: user.email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "A user with this identifier already exists",
      field: "email",
    });
  }

  const newUser = userRepo.create(user);
  if (newUser) await userRepo.save(newUser);
  return res.status(201).json({
    success: true,
    message: "User Created successfully",
    data: {
      newUser,
    },
  });
};

const getAllUsers = async (req: Request, res: Response) => {};

const getUserById = async (req: Request, res: Response) => {};

export { createUser, getAllUsers, getUserById };
