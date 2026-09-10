const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/health", async (req, res) => {
  try {
    const dbRes = await pool.query("SELECT NOW()");
    res.json({ status: "ok", dbTime: dbRes.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

app.listen(port, () => console.log(`API running on port ${port}`));
