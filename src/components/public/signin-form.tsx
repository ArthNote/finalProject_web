"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAuthValidators,
  type SigninFormData,
} from "@/lib/validation/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FaGoogle,
  FaApple,
  FaFacebookF,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { PlaceholderIllustration } from "./placeholder-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, redirect, useRouter } from "@/i18n/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { getAuthErrorMessage } from "@/lib/auth-translations";
import { Checkbox } from "../ui/checkbox";

export function SigninForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations("auth.signin");
  const tValidation = useTranslations();
  const { signinSchema } = createAuthValidators(tValidation);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = useLocale() as "en" | "fr";
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: SigninFormData) {
    const validatedFields = signinSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { username, password, rememberMe } = validatedFields.data;

    startTransition(async () => {
      const { error } = await authClient.signIn.username(
        {
          username: username,
          password: password,
          rememberMe: rememberMe,
        },
        {
          onRequest: () => {
            toast({
              title: t("toast.signing.title"),
              description: t("toast.signing.description"),
            });
          },
          onSuccess: (context) => {
            console.log("Success");
            if (context.data.twoFactorRedirect) {
              redirect({
                href: "/2fa",
                locale: locale,
              });
            }
            toast({
              title: t("toast.success.title"),
              description: t("toast.success.description"),
            });
            router.push(callbackUrl || "/dashboard");
          },
        }
      );

      // Use error directly from the response
      if (error) {
        console.error(error);
        toast({
          title: t("toast.error.title"),
          description: getAuthErrorMessage(error.code, locale),
          variant: "destructive",
        });
      }
    });
  }

  function onProviderSignIn(provider: "discord" | "github" | "google") {
    startTransition(async () => {
      const { data, error } = await authClient.signIn.social({
        provider: provider,
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/dashboard`,
        fetchOptions: {
          onRequest: () => {
            toast({
              title: t("toast.signing.title"),
              description: t("toast.signing.description"),
            });
          },
          onSuccess: () => {
            console.log("Success");
            toast({
              title: t("toast.success.title"),
              description: t("toast.success.description"),
            });
            router.push(callbackUrl || "/dashboard");
          },
        },
      });

      if (error) {
        console.error(error);
        toast({
          title: t("toast.error.title"),
          description: getAuthErrorMessage(error.code, locale),
          variant: "destructive",
        });
      }
    });
  }
  return (
    <div
      className={cn("flex flex-col gap-6 w-full sm:w-[500px]", className)}
      {...props}
    >
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("username.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("username.placeholder")}
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
                      <div className="flex items-center">
                        <FormLabel>{t("password.label")}</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          {t("password.forgot")}
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          placeholder={t("password.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("rememberMe")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full min-w-[200px]"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-8 bg-background px-2 text-muted-foreground">
                    {t("or")}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          type="button"
                          disabled={isPending}
                          onClick={() => onProviderSignIn("discord")}
                        >
                          <FaDiscord />
                          <span className="sr-only">
                            {t("providers.discord")}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("providers.discord")}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          type="button"
                          disabled={isPending}
                          onClick={() => onProviderSignIn("google")}
                        >
                          <FaGoogle />
                          <span className="sr-only">
                            {t("providers.google")}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("providers.google")}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          type="button"
                          disabled={isPending}
                          onClick={() => onProviderSignIn("github")}
                        >
                          <FaGithub />
                          <span className="sr-only">
                            {t("providers.github")}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("providers.github")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="text-center text-sm">
                  {t("noAccount")}{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    {t("signup")}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        {t("terms")} <Link href="/terms">{t("termsLink")}</Link> {t("and")}{" "}
        <Link href="/privacy">{t("privacyLink")}</Link>.
      </div>
    </div>
  );
}
