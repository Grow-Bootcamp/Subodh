import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

// Define a type interface for the user object
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/users", (req: Request, res: Response) => {
  res.json({ success: true, data: users });
});

app.get("/api/users/:id", (req: Request, res: Response) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ success: false, error: "Not found" });
  }

  res.json({ success: true, data: user });
});

export default app;
