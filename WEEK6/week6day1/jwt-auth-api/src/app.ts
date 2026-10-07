import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// JSON body parsing
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: "text/plain" }));

app.get("/", (req, res) => {
  res.send({
    message:
      "Welcome to the JWT Auth API. Please use the /api/auth and /api/protected endpoints.",
    routes: {
      auth: {
        login: "/api/auth/login",
      },
      protected: {
        getData: "/api/protected/data",
      },
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

// 404 for any unmatched route -> forwarded to the error handler
app.use(notFoundHandler);

// Centralized error handling (must stay last)
app.use(errorHandler);

export default app;
