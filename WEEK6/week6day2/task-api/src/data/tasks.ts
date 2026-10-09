import type { Task } from "../types/task.js";

/**
 * DEMO ONLY.
 * In-memory task list. Mutations are lost on restart.
 */
export const tasks: Task[] = [
  {
    id: 1,
    title: "Learn JWT structure",
    description: "Read the header, payload and signature parts of a JWT.",
    ownerId: 2,
    status: "pending",
  },
  {
    id: 2,
    title: "Audit cookie settings",
    description: "Review HttpOnly, Secure and SameSite for the auth cookies.",
    ownerId: 1,
    status: "completed",
  },
  {
    id: 3,
    title: "Document 401 vs 403",
    description: "Write down when to return 401 and when to return 403.",
    ownerId: 2,
    status: "in_progress",
  },
];
