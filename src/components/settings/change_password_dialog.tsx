"use client";

import React, { useTransition } from "react";
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
  DialogTrigger,
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
import {
  PasswordChangeFormData,
  createPasswordValidators,
} from "@/lib/validation/password";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

const ChangePasswordDialog = () => {
  const t = useTranslations("settings.account.security.password");
  const tValidation = useTranslations();
  const { passwordChangeSchema } = createPasswordValidators(tValidation);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  // Query for accounts to check if credentials are enabled
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      return authClient.listAccounts();
    },
  });

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: PasswordChangeFormData) {
    const validatedFields = passwordChangeSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { currentPassword, newPassword } = validatedFields.data;
    startTransition(async () => {
      try {
        const { error } = await authClient.changePassword({
          newPassword: newPassword,
          currentPassword: currentPassword,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });

        form.reset();
        setOpen(false);
      } catch (error) {
        console.error("Error changing password:", error);
        toast({
          title: t("toast.error.title"),
          description: t("toast.error.description"),
          variant: "destructive",
        });
      }
    });
  }

  const handleDialogChange = (open: boolean) => {
    // Check if credentials are enabled before opening the dialog
    if (open) {
      const hasCredentials = accounts?.data?.some(
        (account) => account?.provider === "credential"
      );

      if (!hasCredentials) {
        toast({
          title: t("requiresCredential.title"),
          description: t("requiresCredential.description"),
          variant: "destructive",
        });
        return;
      }
    }

    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("button")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.currentPassword.label")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("form.currentPassword.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.newPassword.label")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("form.newPassword.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.confirmNewPassword.label")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("form.confirmNewPassword.placeholder")}
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
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {t("form.submitting")}
                  </>
                ) : (
                  t("form.submit")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
