import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/practice";
const dbName = process.env.MONGODB_DB || "sample_mflix";

app.use(express.json());

const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`Connected to MongoDB — database: ${db.databaseName}`);

    app.get("/", (_req, res) => {
      res.json({ message: "MongoDB + Express + TypeScript is running" });
    });

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
