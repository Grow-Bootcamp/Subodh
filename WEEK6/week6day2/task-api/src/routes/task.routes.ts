import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { UserRole } from "../types/auth.js";

const router = Router();

router.get("/", authenticate, getTasks);
router.post("/", authenticate, createTask);
router.get("/:id", authenticate, getTaskById);
router.delete("/:id", authenticate, authorize(UserRole.ADMIN), deleteTask);

export default router;
