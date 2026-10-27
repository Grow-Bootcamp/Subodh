import "dotenv/config";
import express, { type Request, type RequestHandler } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";

type Role = "user" | "admin";
type DemoUser = {
  id: string;
  username: string;
  role: Role;
  passwordHash: string;
};
type AuthPayload = { id: string; username: string; role: Role };
type AuthRequest = Request & { auth?: AuthPayload };

const port = Number(process.env.PORT ?? 4000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("Set JWT_SECRET in backend/.env first.");

const users: DemoUser[] = [
  { id: "1", username: "learner", role: "user", passwordHash: bcrypt.hashSync("user123", 10) },
  { id: "2", username: "admin", role: "admin", passwordHash: bcrypt.hashSync("admin123", 10) },
];

const app = express();
app.use(cors({ origin: clientOrigin }));
app.use(express.json());

const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Please sign in." });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), secret) as JwtPayload;
    const role = payload.role;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.username !== "string" ||
      (role !== "user" && role !== "admin")
    ) {
      res.status(401).json({ message: "Invalid token payload." });
      return;
    }

    (req as AuthRequest).auth = {
      id: payload.sub,
      username: payload.username,
      role,
    };
    next();
  } catch {
    res.status(401).json({ message: "Token is invalid or expired." });
  }
};

const requireAdmin: RequestHandler = (req, res, next) => {
  const auth = (req as AuthRequest).auth;
  if (auth?.role !== "admin") {
    res.status(403).json({ message: "Admin role required." });
    return;
  }
  next();
};

app.post("/api/auth/login", async (req, res) => {
  const username =
    typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = users.find((entry) => entry.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Incorrect username or password." });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    secret,
    { subject: user.id, expiresIn: "1h" },
  );

  return res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const auth = (req as AuthRequest).auth!;
  res.json({ id: auth.id, username: auth.username, role: auth.role });
});

app.get("/api/admin", requireAuth, requireAdmin, (_req, res) => {
  res.json({ message: "The backend confirms that you have admin access." });
});

app.listen(port, () => {
  console.log(`Auth API running at http://localhost:${port}`);
});
