import { z } from "zod";

export const createDeleteAccountValidators = (
  t: (path: string, params?: Record<string, any>) => string
) => {
  const deleteAccountSchema = z.object({
    password: z.string().min(8, t("validation.password.min")),
  });

  return { deleteAccountSchema };
};

export type DeleteAccountFormData = z.infer<
  ReturnType<typeof createDeleteAccountValidators>["deleteAccountSchema"]
>;
