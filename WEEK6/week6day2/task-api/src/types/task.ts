export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  status: TaskStatus;
}
