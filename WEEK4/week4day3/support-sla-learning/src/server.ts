import "dotenv/config";
import express from "express";

// ==========================================
// EXPRESS APPLICATION SHELL
// ==========================================
//
// This file is intentionally minimal. Your job is to decide
// the correct STARTUP ORDER and wire everything together.
//
// LEARNING TASK:
//
// Before starting the server, think about the startup order:
//
// 1. Load environment variables          <- done (dotenv/config above)
// 2. Connect to MongoDB                  <- YOUR TASK (see src/config/db.ts)
// 3. Start any background jobs (CRON)    <- YOUR TASK (see src/jobs/slaReminder.job.ts)
// 4. Start Express                       <- below
//
// Decide how you want to structure this yourself.
//
// Questions:
// - What happens if Express starts before MongoDB is connected?
// - Should the CRON job start before or after the DB connection?
// - How will you handle a failed DB connection?

const app = express();
const PORT = process.env.PORT ?? 3000;

// Enable JSON body parsing for incoming requests.
app.use(express.json());

// ------------------------------------------
// ROUTE REGISTRATION (prepare locations)
// ------------------------------------------
//
// LEARNING TASK:
//
// Import your route files and mount them here.
// Research Express Router and app.use() path prefixes.
//
// TODO: register ticket routes     (src/routes/ticket.routes.ts)
// TODO: register user routes       (src/routes/user.routes.ts)
// TODO: register notification routes (src/routes/notification.routes.ts)
//
// Example shape (you write the actual imports):
//   import ticketRoutes from "./routes/ticket.routes.js";
//   app.use("/tickets", ticketRoutes);
//
// NOTE: with "module": "NodeNext", relative imports need the .js extension.

// ------------------------------------------
// APPLICATION STARTUP
// ------------------------------------------
//
// LEARNING TASK:
//
// You may keep a basic app.listen() here, but first implement
// your MongoDB connection and decide whether listening should
// only begin AFTER a successful connection.
//
// TODO: decide your startup flow and implement it.

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
