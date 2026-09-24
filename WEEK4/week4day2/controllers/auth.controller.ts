import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppSource } from "../data-source.js";
import { User } from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";

const userRepo = AppSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password required" });
    }
    if (await userRepo.findOneBy({ email })) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    const user = userRepo.create({
      email,
      passwordHash: await bcrypt.hash(password, 10),
    });
    await userRepo.save(user);
    const token = signToken({ sub: user.id, role: user.role });
    return res.status(201).json({ success: true, data: { token } });
  } catch (error: any) {
    return res.status(422).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = signToken({ sub: user.id, role: user.role });
    return res.status(200).json({ success: true, data: { token } });
  } catch (error: any) {
    return res.status(422).json({ success: false, message: error.message });
  }
};
