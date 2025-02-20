import * as z from "zod";
import { type TranslationValues } from "next-intl";

export const createAuthValidators = (
  t: (key: string, values?: TranslationValues) => string
) => {
  const signupSchema = z
    .object({
      name: z.string().min(2, {
        message: t("validation.name.min"),
      }),
      email: z.string().email({
        message: t("validation.email.invalid"),
      }),
      password: z.string().min(8, {
        message: t("validation.password.min"),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.password.match"),
      path: ["confirmPassword"],
    });

  const signinSchema = z.object({
    email: z.string().email({
      message: t("validation.email.invalid"),
    }),
    password: z.string().min(8, {
      message: t("validation.password.min"),
    }),
  });

  return { signupSchema, signinSchema };
};

export type SignupFormData = z.infer<
  ReturnType<typeof createAuthValidators>["signupSchema"]
>;
export type SigninFormData = z.infer<
  ReturnType<typeof createAuthValidators>["signinSchema"]
>;
