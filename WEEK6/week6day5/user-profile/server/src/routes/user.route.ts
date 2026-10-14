import Router from "express";
import authenticate from "../middleware/authenticate.middleware.ts";
import authorize from "../middleware/authorize.middleware.ts";
import { Roles } from "../middleware/authorize.middleware.ts";
import { getProfile } from "../controller/user.controller.ts";

const router = Router();

router.get("/users/profile/user", authenticate, getProfile);

router.get(
  "/users/profile/admin",
  authenticate,
  authorize(Roles.ADMIN),
  getProfile,
);

export default router;
