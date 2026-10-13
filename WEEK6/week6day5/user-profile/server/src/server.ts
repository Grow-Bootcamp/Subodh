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

//Stored in Database
const users = [
  {
    id: 1,
    name: "Subodh",
    email: "subodhshah@gmail.com",
    password: "adminsubodh",
    role: "admin",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@gmail.com",
    password: "userbob",
    role: "user",
  },
  {
    id: 3,
    name: "Carol",
    email: "carol@gmail.com",
    password: "usercarol",
    role: "user",
  },
];

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
