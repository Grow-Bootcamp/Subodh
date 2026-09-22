import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();
router.post("/users", userController.createMultipleUsers);
router.get("/users", userController.getAllUsers);

export default router;
