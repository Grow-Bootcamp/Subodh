import { Request, Response } from "express";
import { userRepo } from "../repos/userRepo.js";

const createMultipleUsers = async (req: Request, res: Response) => {
  try {
    const sampleUsers: Record<string, unknown>[] = [
      {
        name: "Alex Morgan",
        age: 28,
        contact: 15550192834,
        address: "123 Maple Street, Springfield, IL",
        gender: "Female",
      },
      {
        name: "Jordan Lee",
        age: 34,
        contact: 15550148291,
        address: "456 Oak Avenue, Austin, TX",
        gender: "Non-binary",
      },
      {
        name: "Marcus Chen",
        age: 22,
        contact: 15550173640,
        address: "789 Pine Road, Seattle, WA",
        gender: "Male",
      },
      {
        name: "Sophia Rodriguez",
        age: 41,
        contact: 15550129481,
        address: "321 Cedar Lane, Miami, FL",
        gender: "Female",
      },
      {
        name: "David Kim",
        age: 29,
        contact: 15550165920,
        address: "654 Elm Boulevard, Chicago, IL",
        gender: "Male",
      },
    ];
    const user = await userRepo.createManyUsers(sampleUsers);
    if (!user) {
      res.status(400).json({ success: false, message: "Send valid data" });
      return;
    }
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const findUser = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
};

export { createMultipleUsers, findUser };
