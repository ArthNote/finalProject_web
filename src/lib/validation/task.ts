import * as z from "zod";

// First define the resource schema
export const taskResourceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Resource name is required" }),
  type: z.string(),
  category: z.enum(["file", "link", "note"]),
  url: z.string().url({ message: "Please enter a valid URL" }).optional(),
});

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" }),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  category: z.string().optional(),
  scheduled: z.boolean().default(false),
  date: z.date().nullable().optional(),
  startTime: z.date().nullable().optional(),
  endTime: z.date().nullable().optional(),
  duration: z.number().min(15).optional(),
  tags: z.array(z.string()).default([]),
  assignedTo: z.array(z.string()).default([]),
  parentId: z.string().optional(),
  resources: z.array(taskResourceSchema).default([]),
});

export type TaskResource = z.infer<typeof taskResourceSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
