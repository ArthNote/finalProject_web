"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { redirect } from "@/i18n/routing";
import { toast } from "@/hooks/use-toast";

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

  const handleSave = () => {
    setIsSaving(true);

    if (tempTheme !== theme) {
      setTheme(tempTheme);
    }

    if (tempLocale !== locale) {
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
    <div className="py-8 px-10">
      <div className="grid gap-12">
        {/* Main Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium">{t("title")}</h2>
            <p className="text-muted-foreground mt-2">{t("description")}</p>
          </div>

          {/* Language Section */}
          <div className="space-y-6 rounded-lg bg-muted/40 p-6">
            <div className="space-y-1">
              <h3 className="text-xl font-medium">{t("language.title")}</h3>
              <p className="text-muted-foreground">
                {t("language.description")}
              </p>
            </div>
            <div className="px-4">
              <Select value={tempLocale} onValueChange={setTempLocale}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("language.english")}</SelectItem>
                  <SelectItem value="fr">{t("language.french")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Font Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("font.title")}</h2>
          <div className="space-y-6 rounded-lg bg-muted/40 p-6">
            <div className="space-y-1">
              <p className="text-muted-foreground">
                {t("font.description")}
              </p>
            </div>
            <div className="space-y-6 px-4">
              <Select
                value={tempFont}
                onValueChange={(value) => setTempFont(value as FontSetting)}
              >
                <SelectTrigger className="w-[240px]">
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
                  "p-6 bg-background rounded-lg text-base leading-relaxed border transition-colors",
                  `font-${tempFont}`
                )}
              >
                {t("font.preview")}
              </div>
            </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("theme.title")}</h2>
          <div className="space-y-6 rounded-lg bg-muted/40 p-6">
            <div className="space-y-1">
              <p className="text-muted-foreground">
                {t("theme.description")}
              </p>
            </div>
            <div className="px-4">
              <TooltipProvider delayDuration={200}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          </div>
        </section>
      </div>

      <div className="mt-12 flex justify-end">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[120px]"
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
