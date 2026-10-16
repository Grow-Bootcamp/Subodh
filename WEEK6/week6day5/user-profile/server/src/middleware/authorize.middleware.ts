import { type Request, type Response, type NextFunction } from "express";

const Roles = {
  ADMIN: "admin",
  USER: "user",
} as const;

type Role = (typeof Roles)[keyof typeof Roles]; // same as Role = "admin" | "user" for now as Roles just have those values but will scale if values increase

const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication Required",
        code: "AUTH_REQUIRED",
      });
    }

    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        code: "FORBIDDEN",
      });
    }

    next();
  };
};

export { Roles };
export default authorize;
