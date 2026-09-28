import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import logger from "./logger.js";
import validateTodo from "./middleware/validateTodo.js";
import todos from "./db.js";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(morgan("dev")); // dev is the format for logging. You can use other format in production

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1>Global&Route specific error handling in express and logging using morgan for http and winston for application layer</h1>",
  );
});

app.get("/todos", (req: Request, res: Response): void => {
  res.json(todos);
});

app.get("/todos/:id", (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    // Route specific error handling
    res.status(404).json({
      message: "Todo not found",
    });
    return;
  }
  res.status(200).json(todo);
});

app.post("/todos", validateTodo, (req: Request, res: Response) => {
  logger.info("Creating todo");
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get("/error", (req: Request, res: Response, next: NextFunction): void => {
  try {
    throw new Error("Something went wrong");
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ message: "Internal server Error" });
});

// Server Listener
app.listen(PORT, () => {
  console.log(`[SERVER] Server is listening on ${PORT} port`);
});
