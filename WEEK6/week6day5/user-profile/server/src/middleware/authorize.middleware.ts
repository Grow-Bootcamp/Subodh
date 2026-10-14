import { type Request, type Response, type NextFunction } from "express";
const authorize = (...roles: []) => {
  return (req: Request, res: Response, next: NextFunction) => {};
};

export default authorize;
