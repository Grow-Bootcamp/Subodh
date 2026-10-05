import "dotenv/config";
import mysql from "mysql2/promise";

// One shared pool for the whole app (see group1/src/db.ts for the why).
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3308),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root_pw",
  database: process.env.DB_NAME ?? "commerce_db",
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
});

export default pool;
