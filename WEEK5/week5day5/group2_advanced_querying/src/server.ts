import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import products from "./routes/products.js";
import reports from "./routes/reports.js";

const PORT = Number(process.env.PORT ?? 3002);

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    group: "Group 2 — Advanced SQL Querying & Weekly Consolidation",
    endpoints: [
      "GET  /products                              (worked example)",
      "GET  /products?category=&minPrice=&active=&sort=&page=&limit=   (TODO)",
      "GET  /reports/sales/summary?days=30                          (TODO)",
      "GET  /reports/top-products?limit=10                          (TODO)",
    ],
  });
});

app.use("/products", products);
app.use("/reports", reports);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[SERVER] group2 listening on http://127.0.0.1:${PORT}`);
});
