import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

//tried this cause my network request to /chatroom was getting 304 as response instead of 200 and it still didn't fix it. ??
// app.use((req, res, next) => {
//   // Disable caching for all API routes
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, proxy-revalidate",
//   );
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Server Listening on PORT ${PORT}</h1>`);
});

const roomNames: Array<string> = [];
app.get("/chatroom", (req: Request, res: Response) => {
  const roomName = req.query.roomName ? String(req.query.roomName) : "";
  if (!roomName) {
    return res.status(400).json({ error: "Missing roomname query parameter" });
  }
  roomNames.push(roomName);
  console.log(roomNames);
  res.status(200).json({
    success: true,
    message: `Connected to chatroom ${roomName}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
});
