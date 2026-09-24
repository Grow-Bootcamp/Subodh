// import { Schema, model, Document, Types } from "mongoose";

// interface IAccount extends Document {
//   accountNumber: string;
//   ownerId: Types.ObjectId;
//   accountType: "checking" | "savings" | "escrow" | "clearing";
//   currency: string;
//   balance: bigint; // Stored in smallest unit due to floating point inaccuracy
//   pendingBalance: bigint; // Funds locked/reserved in ongoing transactions
//   status: "active" | "frozen" | "closed";
//   version: number; // ??? [For now says `Optimistic concurrency control`]
//   allowNegative: boolean;
//   metaData?: Record<string, any>;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const AccountSchema = new Schema<IAccount>(
//   {
//     accountNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     ownerId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     accountType: {
//       type: String,
//       enum: ["checking", "savings", "escrow", "clearing"],
//       required: true,
//     },
//     currency: {
//       type: String,
//       required: true,
//       uppercase: true,
//       length: 3, // ISO 4217 (e.g. USD, EUR)
//     },
//     balance: {
//       type: BigInt, // Mongoose 6+ supports BigInt natively
//       required: true,
//       default: 0n,
//     },
//     pendingBalance: {
//       type: BigInt,
//       required: true,
//       default: 0n,
//     },
//     status: {
//       type: String,
//       enum: ["active", "frozen", "closed"],
//       default: "active",
//     },
//     version: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     allowNegative: {
//       type: Boolean,
//       required: true,
//     },
//     metaData: {
//       type: Schema.Types.Mixed,
//     },
//   },
//   { timestamps: true, optimisticConcurrency: true },
// );

// //Compound index for fast balance checks per user and currency
// AccountSchema.index({ ownerId: 1, currency: 1 });

// const Account = model<IAccount>("Account", AccountSchema);

// export { Account, type IAccount };

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
} from "typeorm";
import { User } from "./User.model.js";

const bigintTransformer = {
  to: (v?: bigint) => (v === undefined || v === null ? v : v.toString()),
  from: (v?: string | null) => (v === undefined || v === null ? 0n : BigInt(v)),
};

@Index(["owner", "currency"])
@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true, length: 32 })
  accountNumber: string;

  @ManyToOne(() => User, (user) => user.accounts, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Column({ type: "uuid" })
  ownerId: string;

  @Column({ type: "enum", enum: ["checking", "savings", "escrow", "clearing"] })
  accountType: "checking" | "savings" | "escrow" | "clearing";

  @Column({ type: "char", length: 3 })
  currency: string;

  @Column({ type: "bigint", default: 0, transformer: bigintTransformer })
  balance: bigint;

  @Column({ type: "bigint", default: 0, transformer: bigintTransformer })
  pendingBalance: bigint;

  @Column({
    type: "enum",
    enum: ["active", "frozen", "closed"],
    default: "active",
  })
  status: "active" | "frozen" | "closed";

  @VersionColumn({ type: "int", default: 1 })
  version: number;

  @Column({ type: "boolean", default: false })
  allowNegative: boolean;

  @Column({ type: "jsonb", nullable: true })
  metaData?: Record<string, any>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
