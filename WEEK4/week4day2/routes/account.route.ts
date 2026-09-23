import { Router } from "express";
import { listAccounts } from "../controllers/account.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/accounts", requireAuth, listAccounts);

export default router;
