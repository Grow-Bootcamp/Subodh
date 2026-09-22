import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
// import mongoose from "mongoose";
// import prisma from "./lib/prisma.js";
import { AppDataSource } from "./data-source.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// app.get("/", async (req: Request, res: Response) => {
//   try {
//     let users = await UserRepo.getAllUsers(0, 10);
//     console.log(users);
//     res.status(200).send(users);
//   } catch (error) {
//     console.log("[ERROR]", error);
//   }
// });

app.use("/api/", userRoute); // Just 'create fn' in the controller for POST req for now

// const startServer = async () => {
//   const conn = await mongoose.connect(process.env.MONGODB_URI ?? "");
//   // Wait for DB connection to complete
//   if (conn) {
//     app.listen(port, () => {
//       console.log(`[SERVER] Running on http://localhost:${port}`);
//     });
//   }
// };

// startServer();

// const startServer = async () => {
//   await prisma.$connect();
//   app.listen(port, () => {
//     console.log(`[SERVER] Running on http://localhost:${port}`);
//   });
// };

// startServer();

const startServer = async () => {
  await AppDataSource.initialize();
  console.log("[DB] MySQL connected via TypeORM");
  app.listen(port, () => {
    console.log(`[SERVER] Running on http://localhost:${port}`);
  });
};

startServer();
