// import mongoose from "mongoose";
// import { AccountRepo } from "../repos/account.repo.js";

// export interface TransferResult {
//   transactionId: string;
//   fromAccountId: string;
//   toAccountId: string;
//   amountInCents: bigint;
//   newSenderBalance: bigint;
//   timestamp: Date;
// }

// export class TransferService {
//   private accountRepo: AccountRepo;

//   constructor() {
//     this.accountRepo = new AccountRepo();
//   }

//   executeTransfer = async (
//     fromAccountId: string,
//     toAccountId: string,
//     amountInCents: bigint,
//   ): Promise<TransferResult> => {
//     const session = await mongoose.startSession();
//     try {
//       session.startTransaction();
//       const sender = await this.accountRepo.deductBalance(
//         fromAccountId,
//         amountInCents,
//         session,
//       );
//       if (!sender)
//         throw new Error("Insufficient funds or sender account unavailable'");
//       const receiver = await this.accountRepo.creditBalance(
//         toAccountId,
//         amountInCents,
//         session,
//       );
//       if (!receiver)
//         throw new Error("Receiver account unavailable or inactive");
//       await session.commitTransaction();

//       // Return summary object as typed in TransactionResult
//       return {
//         transactionId: new mongoose.Types.ObjectId().toString(),
//         fromAccountId,
//         toAccountId,
//         amountInCents,
//         newSenderBalance: sender.balance,
//         timestamp: new Date(),
// }

import crypto from "node:crypto";
import { AppSource } from "../data-source.js";
import { AccountRepo } from "../repos/account.repo.js";

export interface TransferResult {
  transactionId: string;
  fromAccountId: string;
  toAccountId: string;
  amountInCents: bigint;
  newSenderBalance: bigint;
  timestamp: Date;
}

export class TransferService {
  private accountRepo = new AccountRepo();

  executeTransfer = async (
    fromAccountId: string,
    toAccountId: string,
    amountInCents: bigint,
    ownerId: string,
  ): Promise<TransferResult> => {
    return AppSource.transaction(async (manager) => {
      const sender = await this.accountRepo.deductBalance(
        manager,
        fromAccountId,
        amountInCents,
        ownerId,
      );
      if (!sender)
        throw new Error("Insufficient funds or sender account unavailable");

      const receiver = await this.accountRepo.creditBalance(
        manager,
        toAccountId,
        amountInCents,
      );
      if (!receiver)
        throw new Error("Receiver account unavailable or inactive");

      return {
        transactionId: crypto.randomUUID(),
        fromAccountId,
        toAccountId,
        amountInCents,
        newSenderBalance: sender.balance,
        timestamp: new Date(),
      };
    });
  };
}
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   };
// }
