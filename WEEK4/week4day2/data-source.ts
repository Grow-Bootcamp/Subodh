import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { User } from "./models/User.model.js";
import { Account } from "./models/Account.model.js";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const AppSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Account],
  migrations: [path.join(__dirname, "migrations/*.{ts,js}")],
  synchronize: false,
  //synchronize is bad practice in real world app as it will alter db automatically if anything changes in the models/schema. Use Migration instead.
});

// TypeORM CLI (cli.js) calls initialize() itself — skip auto-init to avoid double-connect
const isTypeOrmCli = process.argv.some(
  (arg) => arg.includes("typeORM") || arg.includes("typeorm") || arg.includes("cli.js"),
);
if (!isTypeOrmCli) {
  await AppSource.initialize();
}
