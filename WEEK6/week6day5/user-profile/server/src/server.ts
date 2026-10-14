import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { users } from "./dummy_db/users.ts";

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).send(`<h1>Server Listening on PORT ${PORT}</h1>`);
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/users/:id", (req, res) => {
  const email = req.body.email;
  const user = users.find((u) => u.email === email); // Query from Database

  if (!user) {
    res.status(404).json({ error: `User with email ${email} not found` });
    return;
  }

  res.status(200).json({
    id: user.id,
    name: user.name,
  });
});

app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
});
