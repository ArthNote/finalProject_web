import * as z from "zod";
import { type TranslationValues } from "next-intl";

// First define the resource schema
export const createTaskValidators = (
  t: (key: string, values?: TranslationValues) => string
) => {
  const taskResourceSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: t("validation.resource.nameRequired") }),
    type: z.string(),
    category: z.enum(["file", "link", "note"]),
    url: z
      .string()
      .url({ message: t("validation.resource.invalidUrl") })
      .optional(),
  });

  const taskSchema = z.object({
    title: z
      .string()
      .min(1, { message: t("validation.task.titleRequired") })
      .max(100, { message: t("validation.task.titleTooLong") }),
    description: z
      .string()
      .max(500, { message: t("validation.task.descriptionTooLong") }),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    category: z.string().optional(),
    scheduled: z.boolean().default(false),
    date: z.date().nullable().optional(),
    startTime: z.date().nullable().optional(),
    endTime: z.date().nullable().optional(),
    duration: z
      .number()
      .min(15, { message: t("validation.task.durationTooShort") })
      .optional(),
    tags: z.array(z.string()).default([]),
    assignedTo: z.array(z.string()).default([]),
    parentId: z.string().optional(),
    resources: z.array(taskResourceSchema).default([]),
  });

  return { taskResourceSchema, taskSchema };
};

// Define types based on the return value of the function
export type TaskResource = z.infer<
  ReturnType<typeof createTaskValidators>["taskResourceSchema"]
>;
export type TaskFormValues = z.infer<
  ReturnType<typeof createTaskValidators>["taskSchema"]
>;
