import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import accounts from "./routes/accounts.js";

const PORT = Number(process.env.PORT ?? 3001);

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    group: "Group 1 — ACID, Transactions & Indexing",
    endpoints: [
      "GET    /accounts/:id",
      "POST   /accounts/:id/transfer   (TODO: implement the transaction)",
      "GET    /accounts/search?q=name  (TODO: return EXPLAIN output)",
    ],
  });
});

app.use("/accounts", accounts);

// 404 — keep it before the error handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (Express picks it up by the 4-arg signature)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[SERVER] group1 listening on http://127.0.0.1:${PORT}`);
});
