import { z } from "zod";
import { TranslationValues } from "next-intl";

// Define resource schema separately for reuse
export const taskResourceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.string().optional().default(""),
  category: z.enum(["file", "link", "note"]),
  url: z.string().optional(),
});

export type TaskResource = z.infer<typeof taskResourceSchema>;

export function createTaskValidators(
  t: (key: string, values?: TranslationValues) => string
) {
  const taskSchema = z.object({
    title: z
      .string()
      .min(1, { message: t("validation.task.titleRequired") })
      .max(100, { message: t("validation.task.titleTooLong") }),
    description: z
      .string()
      .max(500, { message: t("validation.task.descriptionTooLong") })
      .optional()
      .default(""),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    category: z.string().optional().default(""),
    scheduled: z.boolean().default(false),
    date: z.date().nullable().optional(),
    startTime: z.date().nullable().optional(),
    endTime: z.date().nullable().optional(),
    parentId: z.string().nullable().optional(), // Explicitly allow null or undefined
    tags: z.array(z.string()).optional().default([]),
    assignedTo: z.array(z.string()).optional().default([]),
    resources: z.array(taskResourceSchema).optional().default([]),
    duration: z
      .number()
      .min(5, { message: t("validation.task.durationTooShort") })
      .nullable() // Allow null values
      .optional(), // Allow undefined values
  });

  return { taskSchema };
}

export type TaskFormValues = z.infer<
  ReturnType<typeof createTaskValidators>["taskSchema"]
>;
