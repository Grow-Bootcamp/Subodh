import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import transactionRouter from "./routes/transaction.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(
    `<p style="height: 100vh;
        align-items: center;
        display: flex;
        justify-content: center;
        background-color: black;
        color: white;
        font-size: 44px;
        font-weight: bolder;"> [ACID]: Transactions using Mongoose
    </p>`,
  );
});
app.use("/api", transactionRouter);

const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "");
    if (!conn) throw new Error("[DB]: Database connection failed");
    app.listen(port, () => {
      console.log(`[SERVER]: Server is listening on port ${port}`);
    });
  } catch (error: any) {
    console.error(`[Server] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
