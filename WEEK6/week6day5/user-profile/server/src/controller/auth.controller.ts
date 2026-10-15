import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../dummy_db/users.ts";
import { env } from "../config/env.ts";
import { type AppJwtPayload } from "../types/auth.ts";

export function login(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;
  const user = users.find(
    (u) => u.email === email && bcrypt.compare(password, u.passwordHash),
  );
  if (!user) {
    res.status(401).json({
      success: false,
      message: "User not found",
      code: "NOT_FOUND",
    });
    return;
  }

  const payload: AppJwtPayload = {
    id: user?.id?.toString(),
    role: user?.role,
  };

  try {
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
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
