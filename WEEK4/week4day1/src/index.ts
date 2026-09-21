import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";
import connectToDB from "./db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    await connectToDB();
    res.send(
      `Hello, your requst is sent successfully from ${req.url} with ${req.method} Method`,
    );
  } catch (error) {
    console.log("[ERROR]", error);
  }
});
``;
app.listen(port, () => {
  console.log("[SERVER] Running...");
});
