import { Router } from "express";

// ==========================================
// LEARNING TASK: NOTIFICATIONS (TypeORM)
// ==========================================
//
// LEARNING TASK:
//
// This endpoint will eventually let me verify
// that my CRON job created a notification.
//
// Query the Notification table for the
// requested User.
//
// Implement this yourself.
//
// ENDPOINT:
//
// GET /notifications/:userId
//
// HINTS:
// - Read userId from req.params
// - Query notifications where the user relation/id matches
// - Optionally load the ticket relation so the
//   response shows ticket details, not just a foreign key
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - req.params.userId is a string. Comparing it directly to a
//   numeric column without converting can yield wrong/empty
//   results (or a query error). Know your id type.
//
// - Valid user id but no notifications yet → return [] with 200,
//   not a crash on .map. Distinguish empty vs not found thoughtfully.
//
// - Loading notifications without the ticket/user relations →
//   you verify "a row exists" but can't see which ticket. Load
//   relations when verifying the CRON flow.
//
// - Filtering only by user and not understanding direction →
//   wrong foreign key side; double-check which entity owns the relation.
//
// IMPLEMENT THIS YOURSELF.

const router = Router();

// TODO: GET /:userId  (fetch notifications for a user)

export default router;
