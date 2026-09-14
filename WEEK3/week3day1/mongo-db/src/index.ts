import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./db.js";

dotenv.config();

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || "3000");

app.use(express.json());
//Middleware to parse JSON bodies

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/movies", async (req: express.Request, res: express.Response) => {
  try {
    const movie = await connectToDatabase();
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie).status(200);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
