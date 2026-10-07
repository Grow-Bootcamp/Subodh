import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
