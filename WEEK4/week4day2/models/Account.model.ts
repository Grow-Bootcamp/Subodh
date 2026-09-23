import { Schema, model, Document, Types } from "mongoose";

interface IAccount extends Document {
  accountNumber: string;
  ownerId: Types.ObjectId;
  accountType: "checking" | "savings" | "escrow" | "clearing";
  currency: string;
  balance: bigint; // Stored in smallest unit due to floating point inaccuracy
  pendingBalance: bigint; // Funds locked/reserved in ongoing transactions
  status: "active" | "frozen" | "closed";
  version: number; // ??? [For now says `Optimistic concurrency control`]
  allowNegative: boolean;
  metaData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountType: {
      type: String,
      enum: ["checking", "savings", "escrow", "clearing"],
      required: true,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      length: 3, // ISO 4217 (e.g. USD, EUR)
    },
    balance: {
      type: BigInt, // Mongoose 6+ supports BigInt natively
      required: true,
      default: 0n,
    },
    pendingBalance: {
      type: BigInt,
      required: true,
      default: 0n,
    },
    status: {
      type: String,
      enum: ["active", "frozen", "closed"],
      default: "active",
    },
    version: {
      type: Number,
      required: true,
      default: 0,
    },
    allowNegative: {
      type: Boolean,
      required: true,
    },
    metaData: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true, optimisticConcurrency: true },
);

//Compound index for fast balance checks per user and currency
AccountSchema.index({ ownerId: 1, currency: 1 });

const Account = model<IAccount>("Account", AccountSchema);

export { Account, type IAccount };
