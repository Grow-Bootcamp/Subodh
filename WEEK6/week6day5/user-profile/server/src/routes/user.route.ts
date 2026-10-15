import Router from "express";
import authenticate from "../middleware/authenticate.middleware.ts";
import { getProfile } from "../controller/user.controller.ts";
import { login } from "../controller/auth.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { loginSchema } from "../schemas/auth.schema.ts";

const router = Router();

router.get("/users/profile/user", authenticate, getProfile);

router.get("/users/profile/admin", authenticate, getProfile);

router.post("/users/login", validate(loginSchema), login);
// router.post("/users/register");  //Just have seeded data for this project

export default router;
