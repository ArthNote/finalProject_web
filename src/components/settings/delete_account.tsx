import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";
import { Loader2Icon } from "lucide-react";
import {
  createDeleteAccountValidators,
  DeleteAccountFormData,
} from "@/lib/validation/delete-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { getAuthErrorMessage } from "@/lib/auth-translations";
import { useRouter } from "@/i18n/routing";

const DeleteAccount = () => {
  const t = useTranslations("settings.account");
  const tValidation = useTranslations();
  const locale = useLocale() as "en" | "fr";
  const { deleteAccountSchema } = createDeleteAccountValidators(tValidation);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data } = authClient.useSession();
  const router = useRouter();

  const form = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });
  const handleDeleteAccount = () => {
    // const validatedFields = deleteAccountSchema.safeParse(values);

    // if (!validatedFields.success) {
    //   return { error: "Invalid fields!" };
    // }

    // const { password } = validatedFields.data;

    // Start transition for the deletion process

    if (!data?.user.emailVerified) {
      toast({
        title: t("deleteAccount.emailNotVerified.title"),
        description: t("deleteAccount.emailNotVerified.description"),
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        // Call the backend to delete account with password confirmation
        const { error, data } = await authClient.deleteUser({
          callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/goodbye`,
        });

        if (error) {
          console.error(error);
          toast({
            title: t("deleteAccount.error.title"),
            description: getAuthErrorMessage(error.code, locale),
            variant: "destructive",
          });
          return;
        }

        if (data.success) {
          toast({
            title: t("deleteAccount.success.title"),
            description: t("deleteAccount.success.description"),
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast({
          title: t("deleteAccount.error.title"),
          description: t("deleteAccount.error.description"),
          variant: "destructive",
        });
      }
    });
  };

  const handleDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      form.reset();
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-destructive mb-1">
          {t("deleteAccount.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("deleteAccount.description")}
        </p>
      </div>
      <div className="flex justify-end">
        <AlertDialog open={deleteDialogOpen} onOpenChange={handleDialogChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">{t("deleteAccount.button")}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("deleteAccount.confirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteAccount.confirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleDeleteAccount)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("deleteAccount.passwordConfirmation")}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t("deleteAccount.passwordPlaceholder")}
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                
              </form>
            </Form> */}
            <AlertDialogFooter className="gap-2 pt-2">
              <AlertDialogCancel disabled={isPending}>
                {t("deleteAccount.cancel")}
              </AlertDialogCancel>
              <Button
                variant="destructive"
                disabled={isPending}
                className="mt-0"
                onClick={handleDeleteAccount}
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {t("deleteAccount.deleting")}
                  </>
                ) : (
                  t("deleteAccount.confirm")
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DeleteAccount;
