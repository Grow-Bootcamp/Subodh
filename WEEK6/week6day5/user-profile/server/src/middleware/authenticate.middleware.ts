import { type Request, type Response, type NextFunction } from "express";
import { verify } from "../controller/auth.controller.ts";
import { type AuthUser, type AppJwtPayload } from "../types/auth.ts";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid Authentication Header",
      code: "INVALID_AUTH",
    });
  }

  const authToken = authorizationHeader.split(" ")[1];

  try {
    const payload = verify(authToken) as AppJwtPayload;
    req.user = {
      id: payload.user.id,
      role: payload.user.role,
    } as AuthUser;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
