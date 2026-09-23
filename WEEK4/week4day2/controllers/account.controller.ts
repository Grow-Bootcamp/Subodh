import { Request, Response } from "express";
import { AppSource } from "../data-source.js";
import { Account } from "../models/Account.model.js";

const accountRepo = AppSource.getRepository(Account);

export const listAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await accountRepo.find({
      where: { ownerId: req.user!.sub },
      select: [
        "id",
        "accountNumber",
        "accountType",
        "currency",
        "balance",
        "pendingBalance",
        "status",
        "createdAt",
      ],
    });
    return res.status(200).json({
      success: true,
      data: accounts.map((a) => ({
        ...a,
        balance: a.balance.toString(),
        pendingBalance: a.pendingBalance.toString(),
      })),
    });
  } catch (error: any) {
    return res.status(422).json({ success: false, message: error.message });
  }
};
