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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { redirect } from "@/i18n/routing";
import {
  createCredentialValidators,
  CredentialFormData,
} from "@/lib/validation/account";

// Form data type

// Create credential validators

interface ConnectCredentialDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (username: string, password: string) => void;
  isPending: boolean;
  username?: string;
}

const ConnectCredentialDialog = ({
  isOpen,
  onOpenChange,
  onConnect,
  isPending,
  username,
}: ConnectCredentialDialogProps) => {
  const t = useTranslations("settings.account.security");
  const tValidation = useTranslations();
  const { credentialSchema } = createCredentialValidators(tValidation);

  const locale = useLocale() as "en" | "fr";
  const form = useForm<CredentialFormData>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      username: username || "",
      password: "",
    },
  });

  function onSubmit(values: CredentialFormData) {
    const validatedFields = credentialSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { username, password } = validatedFields.data;
    onConnect(username, password);
    redirect({
      href: {
        pathname: "/settings",
        query: { tab: "account" },
      },
      locale: locale,
    });
  }

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dialog.username.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("dialog.username.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dialog.password.label")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("dialog.password.placeholder")}
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
                onClick={() => handleDialogChange(false)}
                disabled={isPending}
              >
                {t("dialog.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {t("dialog.connecting")}
                  </>
                ) : (
                  t("dialog.connect")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectCredentialDialog;
