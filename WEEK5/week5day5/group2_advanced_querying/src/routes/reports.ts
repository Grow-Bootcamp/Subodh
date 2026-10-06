import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// ─── TASK A — daily revenue widget ───────────────────────────────────────────
// REAL WORLD: the dashboard header shows "Revenue (last 30 days): ₹X".
// Input: ?days=30 (default 30, clamp to 1..365).
//
// TODO(you): build one GROUP BY query that returns one row per day:
//   columns: day, orders, revenue
//   rules:
//     - only orders.status IN ('paid','shipped') count as revenue
//     - join order_items; money = quantity * unit_price
//     - day = DATE(placed_at), filter placed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
//     - GROUP BY day  (or DATE(placed_at))
//     - ORDER BY day DESC
//   Use placeholders for the interval — no string interpolation of user input.
//
// Return { days, summary: rows }.
router.get("/sales/summary", async (req: Request, res: Response) => {
  const days = Math.min(Math.max(Number(req.query.days ?? 30) || 30, 1), 365);

  // ── TODO(you): replace this stub ──
  res.status(501).json({
    message: "Not implemented — see TODO in src/routes/reports.ts",
    expected: { days, rows: "one row per day: { day, orders, revenue }" },
  });
});

// ─── TASK B — "Top products this month" card ─────────────────────────────────
// REAL WORLD: marketing wants the 10 best sellers; ?limit=10 (clamp 1..50).
//
// TODO(you): GROUP BY product, aggregate, filter, sort, limit:
//   columns: product_id, name, units_sold, revenue
//   rules:
//     - units_sold = SUM(o.quantity), revenue = SUM(o.quantity * o.unit_price)
//     - join order_items -> products, and orders (last 30 days, paid/shipped)
//     - GROUP BY product_id, name
//     - HAVING SUM(...) > 0            <-- groups are filtered AFTER aggregation
//     - ORDER BY revenue DESC
//     - LIMIT ?
//
// Then write the sibling query the dashboard needs: top CITIES by revenue,
// with a HAVING clause that keeps only cities above ₹50,000.
router.get("/top-products", async (req: Request, res: Response) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 10) || 10, 1), 50);

  // ── TODO(you): replace this stub ──
  res.status(501).json({
    message: "Not implemented — see TODO in src/routes/reports.ts",
    expected: { limit, rows: "one row per product: { product_id, name, units_sold, revenue }" },
  });
});

export default router;
