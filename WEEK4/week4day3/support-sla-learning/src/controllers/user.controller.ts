import { Request, Response } from "express";
import { AppSource } from "../config/db.js";
import User, { UserRole } from "../entities/User.js";

const userRepo = AppSource.getRepository(User);

//Data Transfer Object - DTO
const userResponse = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (
      typeof data !== "object" ||
      data === null ||
      typeof data.name !== "string" ||
      typeof data.email !== "string" ||
      !Object.values(UserRole).includes(data.role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const existingUser = await userRepo.findOneBy({ email: data.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this identifier already exists",
        field: "email",
      });
    }

    const newUser = userRepo.create({
      name: data.name,
      email: data.email,
      role: data.role,
    });
    const savedUser = await userRepo.save(newUser);
    return res.status(201).json({
      success: true,
      message: "User Created successfully",
      data: userResponse(savedUser),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: `Error while creating user: [${error.message}]`,
      });
    }

    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error while creating user: [${error}]`,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepo.find();

    return res.status(200).json({
      success: true,
      data: users.map((user) => userResponse(user)),
      message: users.length ? "Users successfully found" : "No users yet",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: `Error while fetching all users: [${error.message}]`,
      });
    }

    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error while fetching all users: [${error}]`,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User successfully found",
      data: userResponse(user),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: `Error while fetching user with id: [${error.message}]`,
      });
    }

    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error while fetching user with id: [${error}]`,
    });
  }
};

export { createUser, getAllUsers, getUserById };
