import mongoose from "mongoose";
import User from "../models/User.js"; // Import the required model from models folder

class UserRepo {
  // CREATE
  createUser = async (user: Record<string, unknown>) => {
    try {
      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      return new Error("[CONN]: User failed to create");
    }
  };

  createManyUsers = async (usersArray: Record<string, unknown>[]) => {
    return await User.insertMany(usersArray); // Returns an array of user documents
  };

  // READ
  getAllUsers = async (skipCount: number, limitCount: number) => {
    /*
   Can be further optimized using interface as the parameter. That way you can skip some parameter. You should destructure the passed object for getting the property that you need. I see a lot of such complex cases in real app code.
  */
    return await User.find({})
      .sort({ createdAt: -1 })
      .skip(skipCount && skipCount > 0 ? skipCount : 0)
      .limit(limitCount && limitCount > 0 ? limitCount : 0)
      .lean();
  };

  getUserById = async (id: string) => {
    return await User.findById(id);
  };

  // UPDATE
  updateUserWithId = async (id: string, update: Record<string, unknown>) => {
    let user = await this.getUserById(id);
    if (!user) return null;
    return await User.findByIdAndUpdate(id, update, { new: true });
  };

  // DELETE
  deleteUserWithId = async (id: string) => {
    let user = await this.getUserById(id);
    if (!user) return "[ERROR] No user found";
    return await User.findByIdAndDelete(id);
  };
}

export const userRepo = new UserRepo();
