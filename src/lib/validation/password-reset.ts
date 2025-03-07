import { z } from "zod";
import { type TranslationValues } from "next-intl";

export const createPasswordResetValidators = (
  t: (key: string, values?: TranslationValues) => string
) => {
  const forgotPasswordSchema = z.object({
    email: z.string().email({
      message: t("validation.email.invalid"),
    }),
  });

  const resetPasswordSchema = z
    .object({
      password: z.string().min(8, {
        message: t("validation.password.min"),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.password.match"),
      path: ["confirmPassword"],
    });

  return { forgotPasswordSchema, resetPasswordSchema };
};

export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createPasswordResetValidators>["forgotPasswordSchema"]
>;

export type ResetPasswordFormData = z.infer<
  ReturnType<typeof createPasswordResetValidators>["resetPasswordSchema"]
>;
