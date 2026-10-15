import bcrypt from "bcrypt";
import { pool } from "../../config/db.ts";

const users = [
  {
    name: "Subodh",
    email: "subodhshah@gmail.com",
    password: "adminsubodh",
    role: "admin",
  },
  { name: "Bob", email: "bob@gmail.com", password: "userbob123", role: "user" },
  {
    name: "Carol",
    email: "carol@gmail.com",
    password: "usercarol123",
    role: "user",
  },
];

async function seed() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
  )`);

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await pool.query(
      "INSERT IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [u.name, u.email, passwordHash, u.role],
    );
  }

  console.log("Seeding complete");
}

seed()
  .then(() => pool.end())
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exitCode = 1;
    return pool.end();
  });
