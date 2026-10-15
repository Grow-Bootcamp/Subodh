import { type Request, type Response, type NextFunction } from "express";
import { users } from "../dummy_db/users.ts"; // import pool

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication Required",
      code: "AUTH_REQUIRED",
    });
  }

  const userId = Number(req.user?.id);
  const userRole = req.user.role;
  try {
    const user = users.find((u) => u.id === userId && u.role === userRole); // DB call with await
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "NOT_FOUND",
      });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(`Failed to find user profile`);
    next(error);
  }
};

export const getAllProfile = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allUsers = [...users]; //Call db here in async manner
    if (!(allUsers.length > 0)) {
      return res
        .status(404)
        .json({ success: false, message: "No Users Found", code: "NOT_FOUND" });
    }
  } catch (error) {
    console.log(`Failed to find users profile`);
    next(error);
  }
};
