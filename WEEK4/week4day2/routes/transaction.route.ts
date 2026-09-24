// import { Router } from "express";
// import { handleTransfer } from "../controllers/transaction.contoller.js";
// const router = Router();

// router.post("/transaction", handleTransfer);

// export default router;

import { Router } from "express";
import { handleTransfer } from "../controllers/transaction.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/transaction", requireAuth, handleTransfer);

export default router;
