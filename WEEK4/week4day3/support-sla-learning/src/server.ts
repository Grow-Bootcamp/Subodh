import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { AppSource } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/notifications", notificationRoutes);

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
