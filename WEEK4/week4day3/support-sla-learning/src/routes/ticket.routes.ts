import { Router } from "express";

// ==========================================
// LEARNING TASK: TICKETS
// ==========================================
//
// POST /tickets
//
// Implement ticket creation yourself.
//
// Think about:
// - request body
// - validation
// - assigning a User
// - dueAt
// - initial status
// - initial slaReminderSent value
//
// ------------------------------------------
//
// GET /tickets
//
// IMPORTANT MONGOOSE TASK:
//
// Retrieve tickets and use populate() so the
// assigned User information can be returned.
//
// Questions:
//
// 1. What does the Ticket document contain
//    before population?
//
// 2. What changes after populate()?
//
// 3. How can you populate only selected User fields?
//
// IMPLEMENT THE QUERIES YOURSELF.

const router = Router();

// TODO: POST /  (create a ticket)
// TODO: GET  /  (list tickets with populate on assignedTo)

export default router;
