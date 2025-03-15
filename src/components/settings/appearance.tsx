"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { fontOptions, FontSetting } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ThemeCard } from "../theme-card";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { useFont } from "../wrappers/font-provider";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { updateLanguage } from "@/lib/api/users";

const AppearanceTab = () => {
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFont();
  const t = useTranslations("settings.appearance");
  const [tempTheme, setTempTheme] = useState(theme || "system");
  const locale = useLocale();
  const [tempLocale, setTempLocale] = useState(locale);
  const [tempFont, setTempFont] = useState<FontSetting>(font);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setTempTheme(theme || "system");
    setTempLocale(locale);
    setTempFont(font);
  }, [theme, locale, font]);

  const { mutate } = useMutation({
    mutationFn: updateLanguage,
    onSuccess: () => {
      console.log("Language updated successfully");
    },
  });

  const handleSave = () => {
    setIsSaving(true);

    if (tempTheme !== theme) {
      setTheme(tempTheme);
    }

    if (tempLocale !== locale) {
      mutate(tempLocale);
      redirect({
        href: `/settings?tab=appearance`,
        locale: tempLocale,
      });
    }

    if (tempFont !== font) {
      setFont(tempFont);
    }

    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: t("toast.success.title"),
        description: t("toast.success.description"),
      });
    }, 1000);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight">{t("title")}</h2>
        <p className="text-sm text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* Language Section */}
      <div className="space-y-4 border-0 p-0">
        <div>
          <h3 className="font-medium mb-1">{t("language.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("language.description")}
          </p>
        </div>
        <Select value={tempLocale} onValueChange={setTempLocale}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t("language.english")}</SelectItem>
            <SelectItem value="fr">{t("language.french")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />

      {/* Font Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">{t("font.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("font.description")}
          </p>
        </div>
        <div className="space-y-4">
          <Select
            value={tempFont}
            onValueChange={(value) => setTempFont(value as FontSetting)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                  className={`font-${font.value}`}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div
            className={cn(
              "p-4 bg-muted rounded-md text-base leading-relaxed border",
              `font-${tempFont}`
            )}
          >
            {t("font.preview")}
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Theme Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">{t("theme.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("theme.description")}
          </p>
        </div>
        <TooltipProvider delayDuration={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <ThemeCard
                    theme="light"
                    selectedTheme={tempTheme}
                    onSelect={setTempTheme}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{t("theme.light")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <ThemeCard
                    theme="dark"
                    selectedTheme={tempTheme}
                    onSelect={setTempTheme}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{t("theme.dark")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <ThemeCard
                    theme="system"
                    selectedTheme={tempTheme}
                    onSelect={setTempTheme}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{t("theme.system")}</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="flex items-center justify-end pt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {t("actions.saving")}
            </>
          ) : (
            t("actions.save")
          )}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceTab;
