import bcrypt from "bcryptjs";
import { AppSource } from "../data-source.js";
import { User } from "../models/User.model.js";
import { Account } from "../models/Account.model.js";

const users = AppSource.getRepository(User);
const accounts = AppSource.getRepository(Account);

const mkUser = async (email: string) => {
  const existing = await users.findOneBy({ email });
  if (existing) return existing;
  return users.save(
    users.create({
      email,
      passwordHash: await bcrypt.hash("password123", 10),
    }),
  );
};

const mkAccount = async (owner: User, accountNumber: string, balance: bigint) => {
  if (await accounts.findOneBy({ accountNumber })) return;
  await accounts.save(
    accounts.create({
      owner,
      ownerId: owner.id,
      accountNumber,
      accountType: "checking",
      currency: "USD",
      balance,
      pendingBalance: 0n,
      allowNegative: false,
    }),
  );
};

const alice = await mkUser("alice@test.com");
const bob = await mkUser("bob@test.com");
await mkAccount(alice, "ACC-ALICE-1", 100000n);
await mkAccount(bob, "ACC-BOB-1", 50000n);

console.log("[SEED]: Done — alice@test.com / bob@test.com, password123");
process.exit(0);
