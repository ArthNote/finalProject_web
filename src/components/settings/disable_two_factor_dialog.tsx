"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
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
import { authClient } from "@/lib/auth-client";
import {
  createTwoFactorValidators,
  PasswordFormData,
} from "@/lib/validation/2fa";

interface DisableTwoFactorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DisableTwoFactorDialog = ({
  isOpen,
  onOpenChange,
}: DisableTwoFactorDialogProps) => {
  const t = useTranslations("settings.account.security.twoFactor.disable");
  const tValidation = useTranslations();
  const { passwordSchema } = createTwoFactorValidators(tValidation);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const locale = useLocale() as "en" | "fr";

  // Form for password verification
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Handle password submission to disable 2FA
  async function onSubmit(values: PasswordFormData) {
    const validatedFields = passwordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    startTransition(async () => {
      try {
        // Call API to disable 2FA
        const { error } = await authClient.twoFactor.disable({
          password: values.password,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });

        // Reset form and close dialog
        form.reset();
        onOpenChange(false);
      } catch (error) {
        console.error("Error disabling 2FA:", error);
        toast({
          title: t("toast.error.title"),
          description: t("toast.error.description") + " " + error,
          variant: "destructive",
        });
      }
    });
  }

  // Handle dialog close
  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Reset form when dialog closes
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.password.label")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("form.password.placeholder")}
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
                {t("form.cancel")}
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {t("form.disabling")}
                  </>
                ) : (
                  t("form.disable")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DisableTwoFactorDialog;
