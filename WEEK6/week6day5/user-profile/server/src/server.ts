import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { pool } from "./config/db.ts";
import userRoute from "./routes/user.route.js";

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

app.use("/api", userRoute);

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log(`Successfully connected to MySQL Database`);
    app.listen(PORT, () => {
      console.log(`Server Listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(`Failed to connect to MySQL Database`, error);
    await pool.end();
    process.exitCode = 1;
  }
}

startServer();
