import { Router } from "express";
import { handleTransfer } from "../controllers/transaction.contoller.js";
const router = Router();

router.post("/transaction", handleTransfer);

export default router;
