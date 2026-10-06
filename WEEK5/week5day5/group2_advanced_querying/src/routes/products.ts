import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// ─── WORKED EXAMPLE ──────────────────────────────────────────────────────────
// A plain, fixed list: no filters, no pagination. Read it to see the pattern,
// then compare with the TODO below.
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.execute(
    `SELECT p.product_id, p.name, p.price, p.stock, c.name AS category
       FROM products p
       JOIN categories c ON c.category_id = p.category_id
      WHERE p.is_active = 1
      ORDER BY p.price DESC
      LIMIT 10`,
  );
  res.json({ count: (rows as any[]).length, items: rows });
});

// ─── TASK (filter + sort + paginate) ─────────────────────────────────────────
// REAL WORLD: GET /products/search?category=Electronics&minPrice=200&sort=price_asc&page=2&limit=20
// One query built from N optional params. Replace the stub with:
//
// TODO(you):
//   const clauses: string[] = ["1 = 1"];   // so you can always append " AND "
//   const params: any[] = [];
//   if (category) { clauses.push("c.name = ?");  params.push(category); }
//   if (minPrice) { clauses.push("p.price >= ?"); params.push(Number(minPrice)); }
//   if (active === "false") clauses.push("p.is_active = 0");
//
//   SORT: NEVER concatenate req.query into SQL (injection) — whitelist it:
//     const SORTS = { price_asc: "p.price ASC", price_desc: "p.price DESC",
//                     name: "p.name ASC" };
//     const orderBy = SORTS[req.query.sort] ?? "p.product_id DESC";
//
//   PAGINATION: limit = min(Number(req.query.limit ?? 10), 100)
//               offset = (page - 1) * limit
//               ... LIMIT ? OFFSET ?     (both are params too)
//
//   Then run COUNT(*) with the SAME clauses (no ORDER BY/LIMIT) and return
//   { total, page, limit, items }.
router.get("/search", async (req: Request, res: Response) => {
  const { category, minPrice, sort, page, limit } = req.query;

  // ── TODO(you): replace this stub ──
  res.status(501).json({
    message: "Not implemented — see TODO in src/routes/products.ts",
    expected: {
      filters: { category: category ?? null, minPrice: minPrice ?? null },
      sort: sort ?? "price_asc",
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
      note: "dynamic WHERE + whitelisted ORDER BY + LIMIT/OFFSET + COUNT(*) total",
    },
  });
});

export default router;
