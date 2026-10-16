import { type Request, type Response, type NextFunction } from "express";
import { pool } from "../config/db.ts";

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

  const userId = Number(req.user.id);
  try {
    const [rows] = await pool.query(
      "SELECT id, name, role FROM users WHERE id = ?",
      [userId],
    );
    const user = (rows as { id: number; name: string; role: string }[])[0];
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
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users LIMIT 10",
    );
    const allUsers = rows as {
      id: number;
      name: string;
      email: string;
      role: string;
    }[];
    if (!(allUsers.length > 0)) {
      return res
        .status(404)
        .json({ success: false, message: "No Users Found", code: "NOT_FOUND" });
    }
    res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
    console.log(`Failed to find users profile`);
    next(error);
  }
};
