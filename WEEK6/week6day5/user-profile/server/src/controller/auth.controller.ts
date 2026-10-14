import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const sign = (payload: Record<string, any>) => {
  const secret = env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "1h";
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }
  try {
    const token = jwt.sign(payload, secret, {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    });
    return token;
  } catch (error) {
    console.error("Failed to sign JWT:", error);
    throw error;
  }
};

export const verify = (token: string) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    console.error("Failed to sign JWT:", error);
    throw error;
  }
};
