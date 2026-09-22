// import mongoose from "mongoose";
// import User from "../models/User.js"; // Import the required model from models folder

// class UserRepo {
//   // CREATE
//   createUser = async (user: Record<string, unknown>) => {
//     try {
//       const newUser = new User(user);
//       return await newUser.save();
//     } catch (error) {
//       return new Error("[CONN]: User failed to create");
//     }
//   };

//   createManyUsers = async (usersArray: Record<string, unknown>[]) => {
//     return await User.insertMany(usersArray); // Returns an array of user documents
//   };

//   // READ
//   getAllUsers = async (skipCount: number, limitCount: number) => {
//     /*
//    Can be further optimized using interface as the parameter. That way you can skip some parameter. You should destructure the passed object for getting the property that you need. I see a lot of such complex cases in real app code.
//   */
//     return await User.find({})
//       .sort({ createdAt: -1 })
//       .skip(skipCount && skipCount > 0 ? skipCount : 0)
//       .limit(limitCount && limitCount > 0 ? limitCount : 0)
//       .lean();
//   };

//   getUserById = async (id: string) => {
//     return await User.findById(id);
//   };

//   // UPDATE
//   updateUserWithId = async (id: string, update: Record<string, unknown>) => {
//     let user = await this.getUserById(id);
//     if (!user) return null;
//     return await User.findByIdAndUpdate(id, update, { new: true });
//   };

//   // DELETE
//   deleteUserWithId = async (id: string) => {
//     let user = await this.getUserById(id);
//     if (!user) return "[ERROR] No user found";
//     return await User.findByIdAndDelete(id);
//   };
// }

// export const userRepo = new UserRepo();

// import prisma from "../lib/prisma.js";

// class UserRepo {
//   // CREATE
//   createUser = async (user: { name: string; age: number; contact: string; address: string; gender: string }) => {
//     try {
//       return await prisma.user.create({ data: user });
//     } catch (error) {
//       return new Error("[CONN]: User failed to create");
//     }
//   };

//   createManyUsers = async (usersArray: { name: string; age: number; contact: string; address: string; gender: string }[]) => {
//     return await prisma.user.createMany({ data: usersArray });
//   };

//   // READ
//   getAllUsers = async (skipCount: number, limitCount: number) => {
//     return await prisma.user.findMany({
//       orderBy: { id: "desc" },
//       skip: skipCount && skipCount > 0 ? skipCount : 0,
//       take: limitCount && limitCount > 0 ? limitCount : 0,
//     });
//   };

//   getUserById = async (id: number) => {
//     return await prisma.user.findUnique({ where: { id } });
//   };

//   // UPDATE
//   updateUserWithId = async (id: number, update: Partial<{ name: string; age: number; contact: string; address: string; gender: string }>) => {
//     const user = await this.getUserById(id);
//     if (!user) return null;
//     return await prisma.user.update({ where: { id }, data: update });
//   };

//   // DELETE
//   deleteUserWithId = async (id: number) => {
//     const user = await this.getUserById(id);
//     if (!user) return "[ERROR] No user found";
//     return await prisma.user.delete({ where: { id } });
//   };
// }

import { AppDataSource } from "../data-source.js";
import { User } from "../models/UserTypeORM.js";

class UserRepo {
  private repo = () => AppDataSource.getRepository(User);

  // CREATE
  createUser = async (user: Partial<User>) => {
    try {
      const newUser = this.repo().create(user);
      return await this.repo().save(newUser);
    } catch (error) {
      return new Error("[CONN]: User failed to create");
    }
  };

  createManyUsers = async (usersArray: Partial<User>[]) => {
    const users = this.repo().create(usersArray);
    return await this.repo().save(users);
  };

  // READ
  getAllUsers = async (skipCount: number, limitCount: number) => {
    return await this.repo().find({
      order: { id: "DESC" },
      skip: skipCount && skipCount > 0 ? skipCount : 0,
      take: limitCount && limitCount > 0 ? limitCount : 0,
    });
  };

  getUserById = async (id: number) => {
    return await this.repo().findOneBy({ id });
  };

  // UPDATE
  updateUserWithId = async (id: number, update: Partial<User>) => {
    const user = await this.getUserById(id);
    if (!user) return null;
    await this.repo().update(id, update);
    return await this.getUserById(id);
  };

  // DELETE
  deleteUserWithId = async (id: number) => {
    const user = await this.getUserById(id);
    if (!user) return "[ERROR] No user found";
    return await this.repo().delete(id);
  };
}

export const userRepo = new UserRepo();
