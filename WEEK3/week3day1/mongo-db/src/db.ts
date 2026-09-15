import { Document, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/practice_db";
const dbName: string = process.env.MONGODB_DB || "practice_db";

const client: MongoClient = new MongoClient(uri);
console.log("Connecting to Mongodb-Atlas client");

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const moviesCollection = db.collection("movies");
    console.log(`Connected to MongoDB database: ${dbName}`);
    let movie: Document | null = await moviesCollection.findOne({
      title: "XX",
    });
    console.log("Movie found:", movie);
    return movie;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}

export { connectToDatabase };
