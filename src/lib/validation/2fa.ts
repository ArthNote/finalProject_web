import { z } from "zod";

export const createTwoFactorValidators = (
  t: (path: string, params?: Record<string, any>) => string
) => {
  const passwordSchema = z.object({
    password: z.string().min(8, t("validation.password.min")),
  });

  const twoFactorCodeSchema = z.object({
    code: z.string().length(6, t("validation.twoFactor.length")),
    trustDevice: z.boolean().default(false),
  });

  return { passwordSchema, twoFactorCodeSchema };
};

export type PasswordFormData = z.infer<
  ReturnType<typeof createTwoFactorValidators>["passwordSchema"]
>;

export type TwoFactorCodeFormData = z.infer<
  ReturnType<typeof createTwoFactorValidators>["twoFactorCodeSchema"]
>;
