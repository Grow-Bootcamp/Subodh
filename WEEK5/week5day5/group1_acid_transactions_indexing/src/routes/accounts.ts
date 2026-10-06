import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// NOTE: literal routes must be registered BEFORE "/:id", otherwise Express
// matches "/accounts/search" as id="search".
// ─── TASK 2 (indexing) ───────────────────────────────────────────────────────
// REAL WORLD: support staff types a customer name and the API is sluggish.
// Returning EXPLAIN lets you SEE whether MySQL scans the table or uses an index.
//
// TODO(you):
//   1. Run EXPLAIN SELECT * FROM customers_index_demo WHERE full_name = ?
//      with the q parameter (run sql/04_indexing.sql first to create that table).
//   2. Return { query, plan: rows } so the caller can read type/key/rows.
//   3. Try it BEFORE and AFTER `CREATE INDEX ...` and compare the responses.
router.get("/search", async (req: Request, res: Response) => {
  const q = String(req.query.q ?? "");

  // ── TODO(you): replace this stub ──
  res.status(501).json({
    message: "Not implemented — see TODO in src/routes/accounts.ts",
    expected: `EXPLAIN plan for WHERE full_name = '${q}'`,
  });
});

// ─── WORKED EXAMPLE ──────────────────────────────────────────────────────────
// Read one account. Shows the standard pattern: pool.execute + placeholders.
router.get("/:id", async (req: Request, res: Response) => {
  const [rows] = await pool.execute(
    "SELECT account_id, owner_name, balance, updated_at FROM accounts WHERE account_id = ?",
    [Number(req.params.id)],
  );

  if ((rows as any[]).length === 0) {
    res.status(404).json({ message: "Account not found" });
    return;
  }
  res.json((rows as any[])[0]);
});

// ─── TASK 1 (ACID + transactions) ────────────────────────────────────────────
// REAL WORLD: POST /accounts/1/transfer  { "to": 2, "amount": 10000, "reason": "rent" }
// Money must move as ONE unit: debit + credit + 2 audit rows, or nothing at all.
//
// TODO(you): make this handler atomic. Steps:
//   1. const conn = await pool.getConnection();          // one dedicated connection
//   2. await conn.beginTransaction();
//   3. Debit: UPDATE accounts SET balance = balance - ? WHERE account_id = ?
//      (amount, fromId)
//   4. Check affectedRows — if 0, or amount <= 0 -> await conn.rollback();
//      then throw/respond 400 "insufficient funds / invalid amount"
//      (the CHECK constraint will also throw on a negative balance)
//   5. Credit: UPDATE accounts SET balance = balance + ? WHERE account_id = ?
//   6. Two INSERTs into transactions_log ('debit' and 'credit', with balance_after)
//   7. await conn.commit();
//   8. finally { conn.release(); }                        // ALWAYS return the connection
//
// Hints: use conn.execute(...) with ? placeholders (never string-concat user input).
// After it works, prove atomicity: send an amount larger than the balance and
// check that NO row was written to transactions_log.
router.post("/:id/transfer", async (req: Request, res: Response) => {
  const fromId = Number(req.params.id);
  const { to, amount, reason } = req.body ?? {};

  // sanity checks are safe even before you implement the transaction
  if (!to || !amount || amount <= 0) {
    res.status(400).json({ message: "Body needs { to, amount } with amount > 0" });
    return;
  }

  // ── TODO(you): replace this stub with the 8 steps above ──
  res.status(501).json({
    message: "Not implemented — see TODO in src/routes/accounts.ts",
    expected: {
      from: fromId,
      to,
      amount,
      reason: reason ?? null,
      effect: "debit from, credit to, write 2 rows into transactions_log, all in one transaction",
    },
  });
});

export default router;
