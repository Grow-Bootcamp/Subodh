import "dotenv/config";
import "reflect-metadata";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";
import User from "../entities/User.js";
import Notification from "../entities/Notification.js";
import Ticket from "../entities/Ticket.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// sslmode=require in the URL overrides the ssl option below and forces full
// cert verification, which fails on Aiven (CA not in Node's store) — strip it
const databaseUrl = process.env.DATABASE_URL?.replace(/[?&]sslmode=require/, "");

const AppSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  ssl: { rejectUnauthorized: false },
  entities: [User, Notification, Ticket],
  migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
  synchronize: false,
  migrationsRun: true, // auto-apply pending migrations when server connects
});

export { AppSource };
