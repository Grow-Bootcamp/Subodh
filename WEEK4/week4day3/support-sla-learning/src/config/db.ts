import "reflect-metadata";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";
import User from "../entities/User.js";
import Notification from "../entities/Notification.js";
import Ticket from "../entities/Ticket.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AppSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Notification, Ticket],
  migrations: [path.join(__dirname, "migrations/*.{ts,js}")],
  synchronize: false,
});

export { AppSource };
