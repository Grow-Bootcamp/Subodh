import "reflect-metadata"; // Required for TypeORM decorators — keep this first
import "dotenv/config";
import express from "express";
import { AppSource } from "./config/db.js";
import userRoute from "./routes/user.route.js";
import ticketRoute from "./routes/ticket.route.js";
import notificationRoute from "./routes/notification.route.js";

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
// 2. Connect to PostgreSQL (DataSource)  <- YOUR TASK (see src/config/db.ts)
// 3. Start any background jobs (CRON)    <- YOUR TASK (see src/jobs/slaReminder.job.ts)
// 4. Start Express                       <- below
//
// Decide how you want to structure this yourself.
//
// Questions:
// - What happens if Express starts before the DataSource is initialized?
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
// your DataSource connection and decide whether listening should
// only begin AFTER a successful initialize().
//
// TODO: decide your startup flow and implement it.
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - Moving/removing import "reflect-metadata" so it is NOT
//   the first side-effect import → TypeORM decorator metadata
//   can break in confusing ways. Keep it first.
//
// - app.listen() runs before DB connect + CRON start → early
//   requests or job ticks hit an uninitialized DataSource.
//   Gate listen on successful initialize (your choice of structure).
//
// - Forgetting to register routes at all → 404 everywhere even
//   though your router files look done.
//
// - Mount path + router path both including the prefix
//   (e.g. /tickets + "/tickets") → routes live at /tickets/tickets.
//
// - Relative import missing .js (NodeNext ESM) → runtime
//   ERR_MODULE_NOT_FOUND after tsc/tsx build.
//
// - process.env.PORT is a string; that's fine for listen(),
//   but don't do math on it without converting.

app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);
app.use("/app/notifications", notificationRoute);

const startServer = async (): Promise<void> => {
  try {
    if (!AppSource.isInitialized) await AppSource.initialize();
    console.log("[DB]: Connected to PostgreSQL");
    app.listen(PORT, () => {
      console.log(`[SERVER]: Server is listening on port ${PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      process.exit(1);
    } else {
      console.error("Unknown error:", error);
      process.exit(1);
    }
  }
};

startServer();
