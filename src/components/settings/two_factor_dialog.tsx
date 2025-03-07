"use client";

import React, { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  createTwoFactorValidators,
  PasswordFormData,
  TwoFactorCodeFormData,
} from "@/lib/validation/2fa";

interface TwoFactorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TwoFactorDialog = ({ isOpen, onOpenChange }: TwoFactorDialogProps) => {
  const t = useTranslations("settings.account.security.twoFactor");
  const tValidation = useTranslations();
  const { passwordSchema, twoFactorCodeSchema } =
    createTwoFactorValidators(tValidation);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const locale = useLocale() as "en" | "fr";

  // State to track which step we're on
  const [step, setStep] = useState<"password" | "qrcode">("password");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Form for password verification
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Form for 2FA verification code
  const twoFactorForm = useForm<TwoFactorCodeFormData>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  // Handle password submission
  async function onPasswordSubmit(values: PasswordFormData) {
    const validatedFields = passwordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    startTransition(async () => {
      try {
        // Call API to generate 2FA setup
        const { data, error } = await authClient.twoFactor.enable({
          password: values.password,
          fetchOptions: {
            onError(context) {
              console.error("Error enabling 2FAa: ", context.error);
            },
          },
        });

        if (error) {
          console.error("Error enabling 2FAs: ", error.message);
          throw new Error(error.message);
        }

        // Update state with QR code URL from the response
        setQrCodeUrl(data.totpURI);
        setStep("qrcode");
      } catch (error) {
        console.error("Error setting up 2FA:", error);
        toast({
          title: t("toast.error.title"),
          description: t("toast.error.description") + " " + error,
          variant: "destructive",
        });
      }
    });
  }

  // Handle 2FA code verification
  async function onCodeSubmit(values: TwoFactorCodeFormData) {
    const validatedFields = twoFactorCodeSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    startTransition(async () => {
      try {
        // Call API to verify and complete 2FA setup
        const { data, error } = await authClient.twoFactor.verifyTotp({
          code: values.code,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });

        // Reset forms and close dialog
        passwordForm.reset();
        twoFactorForm.reset();
        setStep("password");
        onOpenChange(false);
      } catch (error) {
        console.error("Error verifying 2FA code:", error);
        toast({
          title: t("toast.codeError.title"),
          description: t("toast.codeError.description") + " " + error,
          variant: "destructive",
        });
      }
    });
  }

  // Handle dialog close
  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Reset state when dialog closes
      passwordForm.reset();
      twoFactorForm.reset();
      setStep("password");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(`${step}.title`)}</DialogTitle>
          <DialogDescription>{t(`${step}.description`)}</DialogDescription>
        </DialogHeader>

        {step === "password" ? (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password.form.password.label")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("password.form.password.placeholder")}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  {t("password.form.cancel")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      {t("password.form.confirming")}
                    </>
                  ) : (
                    t("password.form.confirm")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCode value={qrCodeUrl} size={180} />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {t("qrcode.scanInstructions")}
              </p>
            </div>

            <Form {...twoFactorForm}>
              <form
                onSubmit={twoFactorForm.handleSubmit(onCodeSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={twoFactorForm.control}
                  name="code"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t("qrcode.form.code.label")}</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          disabled={isPending}
                          onChange={field.onChange}
                          className="w-full"
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
                <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("password")}
                    disabled={isPending}
                    className={cn("w-full sm:w-auto sm:flex-1")}
                  >
                    {t("qrcode.form.back")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className={cn("w-full sm:w-auto sm:flex-1")}
                  >
                    {isPending ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        {t("qrcode.form.enabling")}
                      </>
                    ) : (
                      t("qrcode.form.enable")
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorDialog;
