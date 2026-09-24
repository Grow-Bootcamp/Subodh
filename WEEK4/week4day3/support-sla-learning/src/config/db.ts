// Database configuration lives here.
//
// ==========================================
// LEARNING TASK: POSTGRESQL CONNECTION (TypeORM DataSource)
// ==========================================
//
// Implement the PostgreSQL (Aiven) connection yourself.
//
// Questions to answer:
//
// 1. What does new DataSource({ ... }).initialize() do?
// 2. Where should the connection string come from?
//    (Hint: process.env.DATABASE_URL — never hardcode it)
// 3. Why should the connection string not be hardcoded?
// 4. What should happen if the connection fails?
//    Should the process exit? Log and continue?
// 5. When should the application start listening
//    for HTTP requests — before or after the connection?
//
// ------------------------------------------
// HINTS (not solutions):
//
// - Your .env file has DATABASE_URL=
// - dotenv is already loaded in src/server.ts
// - You will probably export a DataSource instance
//   (or an async init function) that server.ts can await
// - The DataSource needs your entity classes listed
//   in `entities: [...]`
//
// ------------------------------------------
// SCHEMA SYNCHRONIZE (decide yourself):
//
// TypeORM has a `synchronize` option that can auto-create
// tables from your entities during development.
//
// LEARNING TASK:
// - Research what synchronize: true does
// - Why must it never be enabled in production?
// - Decide whether you will use it for this learning project
//   or create tables another way (e.g. SQL migrations)
//
// I will NOT enable it for you.
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - Hardcoding the connection string instead of reading
//   process.env.DATABASE_URL → credentials leak in git.
//
// - Starting Express or CRON before DataSource.initialize()
//   finishes → queries run with no connection and throw
//   "Connection not established" (or appear to hang).
//
// - Aiven PostgreSQL usually requires SSL. Forgetting
//   ssl / sslmode in options or the URL → connection
//   timeout or "self signed certificate" style errors.
//
// - Setting synchronize: true and deploying → TypeORM can
//   drop/alter production tables unexpectedly. Research this
//   before enabling.
//
// - Forgetting to list entity classes in entities: [...] →
//   TypeORM doesn't know your tables; find/save fails or
//   relations never register.
//
// - Empty catch around initialize() that only console.logs
//   and continues → server "starts" but every later query fails.
//   Decide: exit process vs retry — understand your choice.
//
// - Exporting only a DataSource but never awaiting initialize()
//   in server.ts → same "not connected" failures at runtime.
//
// IMPLEMENT THIS YOURSELF.
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
