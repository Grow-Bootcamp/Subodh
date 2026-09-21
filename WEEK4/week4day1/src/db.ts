import mongoose from "mongoose";

async function connectToDB() {
  try {
    console.log("[DATABASE] Starting database connection....");
    await mongoose.connect(process.env.MONGODB_URI ?? "");
    console.log("[DATABASE] Connection to Database successful");
  } catch (error) {
    return error;
  }
}

export default connectToDB;
