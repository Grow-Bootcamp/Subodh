import "dotenv/config";
import mysql from "mysql2/promise";

// One shared pool for the whole app: connections are reused across requests.
// Never create a new connection per request — that is how you exhaust MySQL's
// max_connections in production.
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3307),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root_pw",
  database: process.env.DB_NAME ?? "bank_db",
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true, // return DECIMAL columns as JS numbers instead of strings
});

export default pool;
