import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.ts";
import { env } from "../config/env.ts";
import { type AppJwtPayload } from "../types/auth.ts";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id, name, password_hash, role FROM users WHERE email = ?",
      [email],
    );
    const user = (rows as { id: number; password_hash: string; role: string }[])[0];

    const validPassword =
      user && (await bcrypt.compare(password, user.password_hash));

    if (!user || !validPassword) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    const payload: AppJwtPayload = {
      id: user.id.toString(),
      role: user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: (env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) ?? "1h",
    });

    res.status(201).json({
      success: true,
      token,
      message: "User login successfully",
      code: "LOGIN_SUCCESS",
    });
  } catch (error) {
    console.log(`Failed to login the user`);
    next(error);
  }
}
