import express, { type Request, type Response } from "express";

type Product = {
  id: string;
  name: string;
  price: number;
};

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(express.json());

const products: Product[] = [
  { id: "book-1", name: "React Basics Book", price: 18 },
  { id: "book-2", name: "TypeScript Handbook", price: 24 },
  { id: "book-3", name: "Clean Code Notes", price: 12 },
];

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/products", (_req: Request, res: Response) => {
  res.json({ products });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "API route not found" });
});

app.listen(PORT, () => {
  console.log(`Book shop API running at http://localhost:${PORT}`);
});
