import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
} from "../controllers/ticket.controller.js";

// ==========================================
// LEARNING TASK: TICKETS (TypeORM)
// ==========================================
//
// POST /tickets
//
// Implement ticket creation yourself.
//
// Think about:
// - request body
// - validation
// - assigning a User (assignedTo id or relation)
// - dueAt
// - initial status
// - initial slaReminderSent value
//
// HINT: use your TypeORM repository / DataSource
// to save a new Ticket row.
//
// ------------------------------------------
//
// GET /tickets
//
// IMPORTANT TYPEORM TASK:
//
// Retrieve tickets and load the assigned User
// so the response returns user details, not just an id.
//
// This is TypeORM's equivalent of Mongoose populate().
//
// Questions:
//
// 1. What does the Ticket entity contain
//    BEFORE relation loading?
//
// 2. What changes AFTER you load the relation?
//
//    Without relation loading:
//      ticket.assignedTo → id
//
//    With relation loading:
//      ticket.assignedTo → User entity
//
// 3. How can you load only selected User fields?
//    (Research: query builder `leftJoinAndSelect`,
//     or selecting specific columns)
//
// ------------------------------------------
//
// GET /tickets/:id
//
// Fetch ONE ticket by id and load its assigned User.
// Same relation-loading goal as GET /tickets, but
// scoped to a single row.
//
// Think about:
// - id from req.params (it is a string — know your id type)
// - not found → 404, not a crash or empty 200
// - load assignedTo so the response includes the user
//   (without relation loading → id only)
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - Forgetting await on repository/QueryBuilder calls →
//   res.json receives a Promise (or undefined path) and the
//   client gets {} / crashes on .map. Always await async DB ops.
//
// - Expecting assignedTo as a full object without relations /
//   leftJoinAndSelect → user comes back as id only. This is
//   the classic "populate forgot" bug in TypeORM.
//
// - Mounting twice: app.use("/tickets", router) AND router.post("/tickets")
//   → actual path becomes /tickets/tickets. Pick one convention.
//
// - Relative imports without .js under "module": "NodeNext" →
//   TypeScript may compile but Node ESM runtime fails with
//   ERR_MODULE_NOT_FOUND.
//
// - Saving request body directly without validation → empty
//   titles, invalid dueAt, assignedTo pointing at missing user.
//   Minimal checks are still your job.
//
// - After save, returning the entity before reloading relations
//   → created response looks "empty" for assignedTo. That's OK;
//   document it or re-find with relations.
//
// - GET /:id without a not-found branch → null/undefined
//   serialized awkwardly or 200 with empty body. Return 404.
//
// - Using findOneBy with a string id when your PK is numeric
//   without converting (or vice versa) → no match / type error.
//
// IMPLEMENT THE QUERIES YOURSELF.

const router = Router();

router.post("/", createTicket);
router.get("/", getAllTickets);
router.get("/:id", getTicketById);

// TODO: POST /     (create a ticket)
// TODO: GET  /     (list tickets with assignedTo relation loaded)
// TODO: GET  /:id  (single ticket + assignedTo relation; 404 if missing)

export default router;
