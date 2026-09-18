import express from "express";
import path from "path";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const logger = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  console.log(req.method, req.url);
  next();
};

app.use(logger);

app.get("/", (req: express.Request, res: express.Response) => {
  res.render("index", { title: "Template Engine" });
});

app.get("/dashboard", (req: express.Request, res: express.Response) => {
  res.render("index", { title: "Dashboard" });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
