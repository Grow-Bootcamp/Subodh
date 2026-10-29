import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

export type StudySession = {
  id: string;
  topic: string;
  hours: number;
  date: string;
};

const sampleSessions: StudySession[] = [
  { id: "1", topic: "React", hours: 1.5, date: "2026-10-20" },
  { id: "2", topic: "TypeScript", hours: 1, date: "2026-10-21" },
  { id: "3", topic: "React", hours: 2, date: "2026-10-22" },
  { id: "4", topic: "Testing", hours: 1.25, date: "2026-10-23" },
  { id: "5", topic: "CSS", hours: 0.75, date: "2026-10-24" },
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/study-sessions", (_req, res) => {
  res.json(sampleSessions);
});

app.listen(PORT, () => {
  console.log(`Study API running at http://localhost:${PORT}`);
});
