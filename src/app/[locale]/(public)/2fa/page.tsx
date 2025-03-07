"use client";

import React from "react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import {
  createTwoFactorValidators,
  TwoFactorCodeFormData,
} from "@/lib/validation/2fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function TwoFactorAuthPage() {
  const t = useTranslations("auth.twoFactor");
  const tValidation = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isPending, startTransition] = useTransition();

  // Get the validation schema
  const { twoFactorCodeSchema } = createTwoFactorValidators(tValidation);

  // Setup form with zod validation
  const form = useForm<TwoFactorCodeFormData>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: {
      code: "",
      trustDevice: false,
    },
  });

  // Handle form submission
  const onSubmit = (data: TwoFactorCodeFormData) => {
    startTransition(async () => {
      try {
        // Call API to verify the 2FA code
        const { error } = await authClient.twoFactor.verifyTotp({
          code: data.code,
          trustDevice: data.trustDevice,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });

        // Redirect to callback URL after successful verification
        router.push(callbackUrl);
      } catch (error: any) {
        toast({
          title: t("toast.error.title"),
          description: error.message || t("toast.error.description"),
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex h-[70vh] w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t("code.label")}</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      >
                        <div className="flex w-full justify-center space-x-2">
                          <InputOTPGroup className="flex-1 justify-evenly">
                            <InputOTPSlot index={0} className="flex-1" />
                            <InputOTPSlot index={1} className="flex-1" />
                            <InputOTPSlot index={2} className="flex-1" />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup className="flex-1 justify-evenly">
                            <InputOTPSlot index={3} className="flex-1" />
                            <InputOTPSlot index={4} className="flex-1" />
                            <InputOTPSlot index={5} className="flex-1" />
                          </InputOTPGroup>
                        </div>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trustDevice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("trustDevice")}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <CardFooter className="px-0 pt-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
