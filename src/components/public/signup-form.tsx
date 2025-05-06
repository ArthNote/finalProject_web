"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAuthValidators,
  type SignupFormData,
} from "@/lib/validation/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FaGoogle,
  FaApple,
  FaFacebookF,
  FaGithub,
  FaDiscord,
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
import { Link, useRouter } from "@/i18n/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { getAuthErrorMessage } from "@/lib/auth-translations";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations("auth.signup");
  const tValidation = useTranslations();
  const { signupSchema } = createAuthValidators(tValidation);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = useLocale() as "en" | "fr";
  const callbackUrl = searchParams.get("callbackUrl");
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing");
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignupFormData) {
    const validatedFields = signupSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { username, password, name, email } = validatedFields.data;

    startTransition(async () => {
      const { error } = await authClient.signUp.email(
        {
          username: username,
          password: password,
          email: email,
          name: name,
          lang: locale,
          image: "https://github.com/shadcn.png",
          activeOrganizationId: "org-1",
        },
        {
          onRequest: () => {
            toast({
              title: t("toast.signing.title"),
              description: t("toast.signing.description"),
            });
          },
          onSuccess: async () => {
            console.log("Success");
            toast({
              title: t("toast.success.title"),
              description: t("toast.success.description"),
            });

            const { data, error } = await authClient.subscription.upgrade({
              plan: plan || "free",
              successUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/success?type=subscription`,
              cancelUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/pricing`,
              annual: billing === "yearly",
              returnUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/dashboard`,
            });
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
          onSuccess: async () => {
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
                  name="name"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name.label")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("name.placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="email"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("email.placeholder")}
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
                      <FormLabel>{t("password.label")}</FormLabel>
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
                  name="confirmPassword"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("confirmPassword.label")}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t("confirmPassword.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
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
                  {t("hasAccount")}{" "}
                  <Link href="/signin" className="underline underline-offset-4">
                    {t("signin")}
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
