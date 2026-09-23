import { ClientSession } from "mongoose";
import { Account, type IAccount } from "../models/Account.model.js";

export class AccountRepo {
  findActiveById = async (
    accountId: string,
    session?: ClientSession,
  ): Promise<IAccount | null> => {
    return Account.findOne({ _id: accountId, status: "active" }).session(
      session || null,
    );
  };

  // All following operations can still be further made secure by introducing JWT(or other OAuth method) for owner and account Id. See that ownerId and accountNumber in the paramters
  deductBalance = async (
    accountId: string,
    amountInCents: bigint,
    // ownerId: string,
    // accountNumber: string,
    session: ClientSession,
  ): Promise<IAccount | null> => {
    return await Account.findByIdAndUpdate(
      {
        _id: accountId,
        status: "active",
        $expr: {
          $gte: [{ $subtract: ["$balance", "pendingBalance"], amountInCents }],
        },
      },
      { $inc: { balance: -amountInCents } },
      { session, new: true },
    );
  };

  creditBalance = async (
    accountId: string,
    // ownerId: string,
    // accountNumber: string,
    amountInCents: bigint,
    session: ClientSession,
  ) => {
    return await Account.findByIdAndUpdate(
      {
        _id: accountId,
        status: "active",
      },
      { $inc: { balance: amountInCents } },
      { session, new: true },
    );
  };
}

export { IAccount };
