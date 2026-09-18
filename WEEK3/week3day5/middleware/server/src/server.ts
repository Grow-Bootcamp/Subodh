import express from "express";

const app = express();

// This logger function is an Middleware.
const logger = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  console.log("This is logger Middleware");
  console.log(req.method, req.url);
  next(); // It is passing control to other middlewares or apis
};

// Authentication Middleware
const auth = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  //   const token = req.headers.authorization; // Can be anything: Most commonly used JWT Token
  //   if (!token) return res.status(401).send("Unauthorized");
  next();
};

// Authorization middleware used by passing it to the use method of express
app.use(auth);

// Logger middleware is being used here
app.use(logger);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(`You requested from ${req.url} using ${req.method} method`);
});

app.get("/dashboard", (req: express.Request, res: express.Response) => {
  const user = req.body;
  res.send(`[PLACEHOLDER] This is your DashBoard`);
});

app.listen(3000);
