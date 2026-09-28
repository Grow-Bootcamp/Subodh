import express, { type Express, type Request, type Response } from "express";
const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1>Global&Route specific error handling in express and logging using morgan for http and winston for application layer</h1>",
  );
});

app.listen(PORT, () => {
  console.log(`[SERVER] Server is listening on ${PORT} port`);
});
