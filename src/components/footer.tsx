"use client";
import { useForm } from "react-hook-form";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { consts } from "@/lib/constants";
import { useTranslations } from "next-intl";

type NewsletterFormData = {
  email: string;
};

export default function Footer() {
  const t = useTranslations("footer");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>();

  const onSubmit = async (data: NewsletterFormData) => {
    // Newsletter subscription logic here
    console.log("Newsletter subscription:", data.email);
  };

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2">
          <div className="border-b py-8 lg:order-last lg:border-b-0 lg:border-s lg:py-16 lg:ps-16">
            <div className="mt-8 space-y-4 lg:mt-0">
              <div>
                <h3 className="text-2xl font-medium">
                  {t("newsletter.title")}
                </h3>
                <p className="mt-4 max-w-lg">{t("newsletter.description")}</p>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border rounded-xl p-4 gap-3 mt-6 w-full"
              >
                <Input
                  {...register("email", { required: true })}
                  placeholder={t("newsletter.emailPlaceholder")}
                  type="email"
                />
                <Button type="submit">{t("newsletter.submit")}</Button>
              </form>
            </div>
          </div>

          <div className="py-8 lg:py-16 lg:pe-16">
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="font-medium">{t("socials.title")}</p>
                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <Link href="/" className="transition hover:opacity-75">
                      {t("socials.twitter")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="transition hover:opacity-75">
                      {t("socials.instagram")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium">{t("helpfulLinks.title")}</p>
                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <Link href="/contact" className="transition hover:opacity-75">
                      {t("helpfulLinks.contact")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="transition hover:opacity-75">
                      {t("helpfulLinks.careers")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="transition hover:opacity-75">
                      {t("helpfulLinks.support")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <ul className="flex flex-wrap gap-4 text-xs">
                <li>
                  <Link href="/terms" className="transition hover:opacity-75">
                    {t("legal.terms")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:opacity-75">
                    {t("legal.privacy")}
                  </Link>
                </li>
              </ul>

              <p className="mt-8 text-xs">
                &copy; {new Date().getFullYear()}. {consts.appName} LLC.{" "}
                {t("legal.rights")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
