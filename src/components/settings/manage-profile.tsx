"use client";
import React, { useEffect, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountFormData,
  createAuthValidators,
} from "@/lib/validation/account";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-translations";
import { ProfileSkeleton } from "./account-skeletons";

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

const resizeImage = async (
  base64Str: string,
  maxWidth = 400,
  maxHeight = 400
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
  });
};

const ManageProfile = () => {
  const { toast } = useToast();
  const t = useTranslations("settings.account");
  const tValidation = useTranslations();
  const { accountSchema } = createAuthValidators(tValidation);
  const [isPending, startTransition] = useTransition();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const locale = useLocale() as "en" | "fr";

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      image: "",
    },
  });

  // Only set form values when session data is available
  useEffect(() => {
    if (session?.user) {
      form.reset({
        username: session.user.username || "",
        email: session.user.email || "",
        image: session.user.image || "",
        name: session.user.name || "",
      });
    }
  }, [session, form]);

  async function onSubmit(values: AccountFormData) {
    const validatedFields = accountSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { name, username, email, image } = validatedFields.data;

    const updates: Partial<typeof validatedFields.data> = {};

    // Compare with session data and only include changed fields
    if (username !== session?.user.username) {
      updates.username = username;
    }
    if (name !== session?.user.name) {
      updates.name = name;
    }
    if (email !== session?.user.email) {
      updates.email = email;
    }
    if (image && image !== session?.user.image) {
      updates.image = image;
    }

    // If no changes, show message and return
    if (Object.keys(updates).length === 0) {
      toast({
        title: t("toast.noChanges.title"),
        description: t("toast.noChanges.description"),
      });
      return;
    }

    startTransition(async () => {
      try {
        if (updates.username || updates.image || updates.name) {
          const { error } = await authClient.updateUser({
            username: updates.username,
            image: updates.image,
            name: updates.name,
          });

          if (error) {
            console.error(error);
            toast({
              title: t("toast.error.title"),
              description: getAuthErrorMessage(error.code, locale),
              variant: "destructive",
            });
          }
        }

        if (updates.email) {
          await authClient.changeEmail({
            newEmail: updates.email,
          });
        }

        toast({
          title: t("toast.profile.success.title"),
          description: t("toast.profile.success.description"),
        });
      } catch (error) {
        toast({
          title: t("toast.profile.error.title"),
          description: t("toast.profile.error.description") + " " + error,
        });
      }
    });
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await toBase64(file);
        const resized = await resizeImage(base64);
        form.setValue("image", resized);
      } catch (error) {
        toast({
          title: t("toast.profile.error.title"),
          description: t("toast.profile.error.imageUploadError"),
          variant: "destructive",
        });
      }
    }
  };

  const userAvatar = form.watch("image") || session?.user?.image || "";
  const userName = session?.user?.username || "User avatar";

  if (sessionPending) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium mb-1">{t("profile.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("profile.description")}
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
          className="min-w-[100px] hidden lg:flex w-fit items-center"
        >
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {t("profile.saving")}
            </>
          ) : (
            t("profile.save")
          )}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[150px_1fr]">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              <UserIcon className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isPending}
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            {t("profile.changePhoto")}
          </Button>
          <p className="text-xs text-muted-foreground">
            {t("profile.imageRequirements")}
          </p>
          {form.formState.errors.image && (
            <p className="text-xs text-destructive">
              {t(form.formState.errors.image.message as string)}
            </p>
          )}
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="avatar-upload"
            disabled={isPending}
            onChange={handleImageSelect}
          />
        </div>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="username"
              control={form.control}
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.username")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.username")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full block lg:hidden"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  {t("profile.saving")}
                </>
              ) : (
                t("profile.save")
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ManageProfile;
