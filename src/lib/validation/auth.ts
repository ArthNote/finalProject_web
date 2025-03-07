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
    rememberMe: z.boolean().default(false),
  });

  return { signupSchema, signinSchema };
};

export type SignupFormData = z.infer<
  ReturnType<typeof createAuthValidators>["signupSchema"]
>;
export type SigninFormData = z.infer<
  ReturnType<typeof createAuthValidators>["signinSchema"]
>;
