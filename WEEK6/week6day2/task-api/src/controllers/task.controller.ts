import type { Request, Response } from "express";
import { tasks } from "../data/tasks.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { UserRole } from "../types/auth.js";

const parseId = (raw: string | string[] | undefined): number => {
  const value = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  return Number.parseInt(value, 10);
};

/**
 * GET /api/tasks
 * Rules: ADMIN sees all tasks, USER sees only tasks they own.
 */
export const getTasks = (req: Request, res: Response): void => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const visible =
    user.role === UserRole.ADMIN
      ? tasks
      : tasks.filter((task) => task.ownerId === user.id);

  res.status(200).json({ success: true, tasks: visible });
};

/**
 * POST /api/tasks
 * Rules: any authenticated user may create a task.
 * The task is owned by the authenticated user.
 */
export const createTask = (req: Request, res: Response): void => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { title, description } = createTaskSchema.parse(req.body);

  const nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

  const task = {
    id: nextId,
    title,
    description,
    ownerId: user.id,
    status: "pending" as const,
  };

  tasks.push(task);
  res.status(201).json({ success: true, task });
};

/**
 * GET /api/tasks/:id
 * Rules: ADMIN may view any task, USER only their own.
 * USER requesting another user's task → 403.
 */
export const getTaskById = (req: Request, res: Response): void => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const task = tasks.find(
    (candidate) => candidate.id === parseId(req.params.id),
  );

  if (!task) {
    res.status(404).json({ success: false, message: "Task not found" });
    return;
  }

  if (user.role !== UserRole.ADMIN && task.ownerId !== user.id) {
    res.status(403).json({ success: false, message: "Forbidden" });
    return;
  }

  res.status(200).json({ success: true, task });
};

/**
 * DELETE /api/tasks/:id
 * Rules: ADMIN only. The route already runs
 * `authorize(UserRole.ADMIN)`, so a USER never reaches this handler.
 */
export const deleteTask = (req: Request, res: Response): void => {
  const index = tasks.findIndex(
    (candidate) => candidate.id === parseId(req.params.id),
  );

  if (index === -1) {
    res.status(404).json({ success: false, message: "Task not found" });
    return;
  }

  tasks.splice(index, 1);
  res.status(200).json({ success: true, message: "Task deleted" });
};
