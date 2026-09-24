// import { ClientSession } from "mongoose";
// import { Account, type IAccount } from "../models/Account.model.js";

// export class AccountRepo {
//   findActiveById = async (
//     accountId: string,
//     session?: ClientSession,
//   ): Promise<IAccount | null> => {
//     return Account.findOne({ _id: accountId, status: "active" }).session(
//       session || null,
//     );
//   };

//   // All following operations can still be further made secure by introducing JWT(or other OAuth method) for owner and account Id. See that ownerId and accountNumber in the paramters
//   deductBalance = async (
//     accountId: string,
//     amountInCents: bigint,
//     // ownerId: string,
//     // accountNumber: string,
//     session: ClientSession,
//   ): Promise<IAccount | null> => {
//     return await Account.findByIdAndUpdate(
//       {
//         _id: accountId,
//         status: "active",
//         $expr: {
//           $gte: [{ $subtract: ["$balance", "pendingBalance"], amountInCents }],
//         },
//       },
//       { $inc: { balance: -amountInCents } },
//       { session, new: true },
//     );
//   };

//   creditBalance = async (
//     accountId: string,
//     // ownerId: string,
//     // accountNumber: string,
//     amountInCents: bigint,
//     session: ClientSession,
//   ) => {
//     return await Account.findByIdAndUpdate(
//       {
//         _id: accountId,
//         status: "active",
//       },
//       { $inc: { balance: amountInCents } },
//       { session, new: true },
//     );
//   };
// }

// export { IAccount };

import { EntityManager } from "typeorm";
import { Account } from "../models/Account.model.js";

export class AccountRepo {
  findActiveById = async (
    manager: EntityManager,
    accountId: string,
    ownerId?: string,
  ): Promise<Account | null> => {
    return manager.findOne(Account, {
      where: ownerId
        ? { id: accountId, ownerId, status: "active" }
        : { id: accountId, status: "active" },
    });
  };

  deductBalance = async (
    manager: EntityManager,
    accountId: string,
    amountInCents: bigint,
    ownerId: string,
  ): Promise<Account | null> => {
    const result = await manager
      .createQueryBuilder()
      .update(Account)
      .set({
        balance: () => `balance - ${amountInCents}`,
        version: () => `version + 1`,
      })
      .where(
        `id = :accountId AND "ownerId" = :ownerId AND status = 'active'
         AND balance - "pendingBalance" >= :amount`,
        { accountId, ownerId, amount: amountInCents.toString() },
      )
      .returning("*")
      .execute();
    return result.raw[0] ? manager.create(Account, result.raw[0]) : null;
  };

  creditBalance = async (
    manager: EntityManager,
    accountId: string,
    amountInCents: bigint,
  ): Promise<Account | null> => {
    const result = await manager
      .createQueryBuilder()
      .update(Account)
      .set({
        balance: () => `balance + ${amountInCents}`,
        version: () => `version + 1`,
      })
      .where(`id = :accountId AND status = 'active'`, { accountId })
      .returning("*")
      .execute();
    return result.raw[0] ? manager.create(Account, result.raw[0]) : null;
  };
}
