import { pool } from "../../config/db.ts";

const seedUsers = async () => {
  const createUsersTableQ =
    "CREATE TABLE IF NOT EXISTS users(id INT PRIMARY KEY AUTO INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(10) NOT NULL)";
  const insertUsersQ =
    "INSERT INTO users(name, email, password, role) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?)";
  await pool.query(createUsersTableQ);
  await pool.query(insertUsersQ);
};

seedUsers();
