import jwt from "jsonwebtoken";

export interface AuthPayload {
  sub: string;
  role: "user" | "admin";
}

export const signToken = (payload: AuthPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  } as jwt.SignOptions);

export const verifyToken = (token: string): AuthPayload =>
  jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
