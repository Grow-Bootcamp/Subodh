import mongoose from "mongoose";
import User from "./models/User.js"; // Import the required model from models folder

connectToDB();

// CREATE
const createUser = async (user: object) => {
  const newUser = new User(user);
  await newUser.save();
};

// READ
const getAllUsers = async (skipCount: number, limitCount: number) => {
  /*
   Can be further optimized using interface as the parameter. That way you can skip some parameter. You should destructure the passed object for getting the property that you need. I see a lot of such complex cases in real app code.
  */
  return await User.find({})
    .sort({ createdAt: -1 })
    .skip(skipCount && skipCount > 0 ? skipCount : 0)
    .limit(limitCount && limitCount > 0 ? limitCount : 0)
    .lean();
};

const getUserById = async (id: string) => {
  return await User.findById(id);
};

// UPDATE
const updateUserWithId = async (id: string) => {
  let user = await getUserById(id);
  if (!user) return null;
};

// DELETE
const deleteUserWithId = async (id: string) => {
  let user = getUserById(id);
  if (!user) return "[ERROR] No user found";
};

async function connectToDB() {
  try {
    console.log("[DATABASE] Starting database connection....");
    await mongoose.connect(process.env.MONGODB_URI ?? "");
    console.log("[DATABASE] Connection to Database successful");
  } catch (error) {
    console.log(`[ERROR]: Database connection failed`, error);
    process.exit(1);
  }
}

export {
  getAllUsers,
  getUserById,
  deleteUserWithId,
  createUser,
  updateUserWithId,
};
