import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  deleteUserWithId,
  createUser,
  updateUserWithId,
} from "./db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    let users = await getAllUsers(0, 10);
    console.log(users);
    res.send(
      `Hello, your requst is sent successfully from ${req.url} with ${req.method} Method`,
    );
  } catch (error) {
    console.log("[ERROR]", error);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    // Dummy user instead of getting from front-end
    let user = {};
  } catch (err) {}
});

// app.get("/users/:id", async (req: Request, res: Response) => {
//   try {
//   } catch (error) {}
// });

app.listen(port, () => {
  console.log("[SERVER] Running...");
});
