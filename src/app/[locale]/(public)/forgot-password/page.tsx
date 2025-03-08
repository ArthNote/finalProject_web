"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import {
  createPasswordResetValidators,
  type ForgotPasswordFormData,
} from "@/lib/validation/password-reset";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const tValidation = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { forgotPasswordSchema } = createPasswordResetValidators(tValidation);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    startTransition(async () => {
      const { data, error } = await authClient.forgetPassword({
        email: values.email,
        redirectTo: `${process.env.FRONTEND_URL}/${locale}/reset-password`,
      });

      if (error) {
        console.error(error);
        toast({
          title: t("toast.error.title"),
          description: t("toast.error.description"),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("toast.success.title"),
        description: t("toast.success.description"),
      });
    });
  };

  return (
    <div className="flex h-[75vh] w-full flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("email.placeholder")}
                        type="email"
                        autoComplete="email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
