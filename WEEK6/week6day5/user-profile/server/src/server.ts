import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

const users = [
  { id: 1, name: "Alice", role: "Engineer" },
  { id: 2, name: "Bob", role: "Designer" },
  { id: 3, name: "Carol", role: "Product Manager" },
];

app.get("/", (_req, res) => {
  res.status(200).send(`<h1>Server Listening on PORT ${PORT}</h1>`);
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: `User ${id} not found` });
    return;
  }

  res.status(200).json(user);
});

app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
});
