// ==========================================
// LEARNING TASK: USERS (TypeORM)
// ==========================================
//
// LEARNING TASK:
//
// Create a simple endpoint for creating test users.
//
// I will use this endpoint to create a support agent
// that can later be referenced by a Ticket.
//
// Implement the request handling and database
// operation yourself.
//
// ENDPOINTS:
//
// POST /users   (create — payload in JSON body)
// GET  /users   (list — non-sensitive fields only)
//
// POST vs GET convention:
// - POST: create/mutate. Put data in the JSON body.
//   Never put sensitive fields in the query string
//   (they end up in logs/history). This project has no
//   auth/passwords — still build the habit.
// - GET: read. Return only fields safe to expose
//   (e.g. id, name, email, role — not internal flags
//   you may add later).
//
// ------------------------------------------
// POST /users — HINTS:
// - Read name / email / role from the request body
// - Save a new User entity with your repository
// - Return the created row (or a simple message)
//
// ------------------------------------------
// GET /users — LEARNING TASK:
//
// List all users/agents so you can verify POST /users
// worked and grab Alice's id for ticket assignment.
//
// HINTS:
// - Find all User rows with your repository
// - Return id, name, email, role (non-sensitive)
// - Empty table → return [] with 200, do not crash
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - req.body fields are whatever the client sent — types and
//   presence are not guaranteed. Validate before save.
//
// - Duplicate email with no unique constraint → two "Alice"
//   agents and confusing ticket assignment later.
//
// - Returning success even when save() throws → wrap in
//   try/catch and return a real error status so you can debug.
//
// - Forgetting await on the repository save/find call.
//
// - GET /users returning extra fields "just in case" →
//   practice least-privilege responses even without auth.
//
// IMPLEMENT THIS YOURSELF.
import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";

const router = Router();

// TODO: POST /  (create a user/agent)
router.post("/", createUser);
// TODO: GET  /  (list users — id, name, email, role)
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
