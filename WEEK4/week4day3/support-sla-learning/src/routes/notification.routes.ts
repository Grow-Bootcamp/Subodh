import { Router } from "express";

// ==========================================
// LEARNING TASK: NOTIFICATIONS
// ==========================================
//
// LEARNING TASK:
//
// This endpoint will eventually let me verify
// that my CRON job created a notification.
//
// Query the Notification collection for the
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
// - Query notifications where the user field matches
// - Optionally populate() the ticket reference so the
//   response shows ticket details, not just an ObjectId
//
// IMPLEMENT THIS YOURSELF.

const router = Router();

// TODO: GET /:userId  (fetch notifications for a user)

export default router;
