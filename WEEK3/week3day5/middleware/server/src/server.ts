import express from "express";

const app = express();

// This logger function is an Middleware.
const logger = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  console.log("This is logger Middleware getting request from: ");
  console.log(req.method, req.url);
  next(); // It is passing control to other middlewares or apis
};
// Logger middleware is being used here
app.use(logger);

// Authentication Middleware
const auth = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.headers.authorization; // Can be anything: Q:Is most commonly used JWT Token?
  if (!token) return res.status(401).send("Unauthorized");
  next();
};
// Authorization middleware used by passing it to the use method of express
app.use(auth);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(`You requested from ${req.url} using ${req.method} method`);
});

app.get("/dashboard", (req: express.Request, res: express.Response) => {
  const user = req.body;
  res.send(`[PLACEHOLDER] This is your DashBoard`);
});

app.listen(4000);
