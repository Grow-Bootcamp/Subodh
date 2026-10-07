import type { Request, Response } from "express";
import { tasks } from "../data/tasks.js";
import { createTaskSchema } from "../schemas/task.schema.js";

const parseId = (raw: string | string[] | undefined): number => {
  const value = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  return Number.parseInt(value, 10);
};

/**
 * GET /api/tasks
 * Rules: USER sees only their own tasks, ADMIN sees all.
 *
 * TODO: filter `tasks` — return everything for ADMIN,
 * otherwise only tasks whose `ownerId === req.user.id`.
 */
export const getTasks = (req: Request, res: Response): void => {
  void req;
  res.status(200).json({ tasks });
};

/**
 * POST /api/tasks
 * Rules: both roles may create a task.
 *
 * TODO: set `ownerId` to `req.user.id` instead of leaving it unassigned.
 */
export const createTask = (req: Request, res: Response): void => {
  const input = createTaskSchema.parse(req.body);

  void input;
  res.status(501).json({ error: "Not implemented: create task" });
};

/**
 * GET /api/tasks/:id
 * Rules: ADMIN may view any task, USER only their own.
 *
 * TODO: when `req.user.role` is USER and the task's `ownerId` differs,
 * return 403 instead of the task.
 */
export const getTaskById = (req: Request, res: Response): void => {
  const id = parseId(req.params.id ?? "");
  const task = tasks.find((candidate) => candidate.id === id);

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(200).json({ task });
};

/**
 * DELETE /api/tasks/:id
 * Rules: ADMIN may delete any task, USER is forbidden.
 *
 * The route already runs `authorize(UserRole.ADMIN)`, so role checking
 * happens there. TODO: confirm the authorization decision is enforced
 * before any deletion happens here.
 */
export const deleteTask = (req: Request, res: Response): void => {
  const id = parseId(req.params.id ?? "");
  const index = tasks.findIndex((candidate) => candidate.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted" });
};
