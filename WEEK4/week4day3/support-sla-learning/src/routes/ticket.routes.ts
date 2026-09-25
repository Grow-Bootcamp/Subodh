import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
} from "../controllers/ticket.controller.js";

const router = Router();

router.post("/", createTicket);
router.get("/", getAllTickets);
router.get("/:id", getTicketById);

export default router;
