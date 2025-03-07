import { z } from "zod";

export const createPasswordValidators = (
  t: (path: string, params?: Record<string, any>) => string
) => {
  const passwordChangeSchema = z
    .object({
      currentPassword: z.string().min(8, t("validation.password.min")),
      newPassword: z.string().min(8, t("validation.password.min")),
      confirmNewPassword: z.string().min(8, t("validation.password.min")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("validation.password.match"),
      path: ["confirmNewPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: t("validation.password.different"),
      path: ["newPassword"],
    });

  return { passwordChangeSchema };
};

export type PasswordChangeFormData = z.infer<
  ReturnType<typeof createPasswordValidators>["passwordChangeSchema"]
>;
