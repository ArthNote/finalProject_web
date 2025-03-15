"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import {
  createPasswordResetValidators,
  type ResetPasswordFormData,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter, Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const tValidation = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError(t("errors.noToken"));
      return;
    }
    setToken(token);
  }, [searchParams, t]);

  const { resetPasswordSchema } = createPasswordResetValidators(tValidation);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      setError(t("errors.noToken"));
      return;
    }

    startTransition(async () => {
      const { data, error } = await authClient.resetPassword({
        newPassword: values.password,
        token: token,
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

      // Redirect to sign in page after successful password reset
      setTimeout(() => {
        router.push(`/signin`);
      }, 2000);
    });
  };

  if (error) {
    return (
      <div className=" flex h-[75vh] w-full flex-col items-center justify-center">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("errors.title")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/forgot-password">{t("errors.backToReset")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password.label")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("password.placeholder")}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPassword.label")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("confirmPassword.placeholder")}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !token}
              >
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
