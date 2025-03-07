import { TranslationValues } from "next-intl";
import { z } from "zod";

export const createAuthValidators = (
  t: (key: string, values?: TranslationValues) => string
) => {
  const accountSchema = z.object({
    name: z.string().min(2, {
      message: t("validation.name.min"),
    }),
    username: z
      .string()
      .min(3, {
        message: t("validation.username.min"),
      })
      .max(20, {
        message: t("validation.username.max"),
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: t("validation.username.invalid"),
      }),
    email: z.string().email({
      message: t("validation.email.invalid"),
    }),
    image: z.string().optional(),
  });

  return { accountSchema };
};

export type AccountFormData = z.infer<
  ReturnType<typeof createAuthValidators>["accountSchema"]
>;

export type CredentialFormData = z.infer<
  ReturnType<typeof createCredentialValidators>["credentialSchema"]
>;

export const createCredentialValidators = (
  t: (path: string, params?: Record<string, any>) => string
) => {
  const credentialSchema = z.object({
    username: z
      .string()
      .min(3, {
        message: t("validation.username.min"),
      })
      .max(20, {
        message: t("validation.username.max"),
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: t("validation.username.invalid"),
      }),
    password: z.string().min(8, {
      message: t("validation.password.min"),
    }),
  });

  return { credentialSchema };
};
