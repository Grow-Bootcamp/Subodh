import { type Request, type Response, type NextFunction } from "express";
import { verify } from "../controller/auth.controller.ts";
import { type AuthUser, type AppJwtPayload } from "../types/auth.ts";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({
      success: false,
      message: "No Authorization header passed",
    });
  }
  const [authType, authToken] = authorizationHeader?.split(" ");
  if (authType !== "Bearer" || typeof authToken !== "string") {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization token",
    });
  }

  try {
    const payload = verify(authToken) as AppJwtPayload;
    req.user = {
      id: payload.user.id,
      email: payload.user.email,
      role: payload.user.role,
    } as AuthUser;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
