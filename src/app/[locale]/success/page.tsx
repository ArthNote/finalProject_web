"use client";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const locale = useLocale() as "en" | "fr";
  const type = searchParams.get("type");

  const t = useTranslations(`success.${type}`);

  return (
    <div className="flex items-center justify-center h-screen py-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardFooter className="justify-center">
          <Link href="/dashboard">
            <Button className="w-full">{t("cta")}</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
