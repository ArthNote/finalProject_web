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
import { Loader2Icon, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useFont } from "../wrappers/font-provider";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { updateLanguage } from "@/lib/api/users";
import { useUnlockedThemes } from "@/hooks/use-unlocked-themes";

const AppearanceTab = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { font, setFont } = useFont();
  const t = useTranslations("settings.appearance");
  const [tempTheme, setTempTheme] = useState(theme || "system");
  const locale = useLocale();
  const [tempLocale, setTempLocale] = useState(locale);
  const [tempFont, setTempFont] = useState<FontSetting>(font);
  const [isSaving, setIsSaving] = useState(false);
  const unlockedThemes = useUnlockedThemes();
  // Extract theme type and color mode
  const [selectedThemeType, setSelectedThemeType] = useState<string>("default");
  const [selectedColorMode, setSelectedColorMode] = useState<
    "light" | "dark" | "system"
  >("system");

  useEffect(() => {
    if (theme) {
      if (theme === "light" || theme === "dark" || theme === "system") {
        setSelectedThemeType("default");
        setSelectedColorMode(theme as "light" | "dark" | "system");
      } else {
        const themeName = theme.replace("theme-", "");
        setSelectedThemeType(themeName);
        setSelectedColorMode(resolvedTheme === "dark" ? "dark" : "light");
      }
      setTempTheme(theme);
    }

    setTempLocale(locale);
    setTempFont(font);
  }, [theme, locale, font, resolvedTheme]);

  // Update theme preview without applying
  useEffect(() => {
    let newTheme: string;
    if (selectedThemeType === "default") {
      newTheme = selectedColorMode;
    } else {
      // For custom themes, we handle dark mode separately
      const baseTheme = `theme-${selectedThemeType}`;
      // Only preview the default theme name, dark mode will be handled by next-themes
      newTheme = baseTheme;
    }
    setTempTheme(newTheme);
  }, [selectedThemeType, selectedColorMode]);

  // Add this effect to handle dark mode separately
  useEffect(() => {
    if (selectedThemeType !== "default" && selectedColorMode !== "system") {
      // For custom themes, manually set the dark mode class
      const root = document.documentElement;
      if (selectedColorMode === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [selectedColorMode, selectedThemeType]);

  const { mutate } = useMutation({
    mutationFn: updateLanguage,
    onSuccess: () => {
      console.log("Language updated successfully");
    },
  });

  const handleSave = () => {
    setIsSaving(true);

    // Apply theme changes only on save
    if (tempTheme !== theme) {
      // Set the theme first
      setTheme(tempTheme);

      // Then handle dark mode if it's a custom theme
      if (selectedThemeType !== "default") {
        if (selectedColorMode === "system") {
          // Let next-themes handle system preference
          setTheme(tempTheme);
        } else {
          // For custom themes, we need to set both the theme and dark mode
          setTheme(selectedColorMode === "dark" ? "dark" : "light");
          setTimeout(() => setTheme(tempTheme), 0);
        }
      }
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

  const themeTypes = [
    {
      id: "default",
      name: "Default",
      value: "default",
    },
    // Add unlocked theme rewards
    ...(unlockedThemes?.map((theme) => ({
      id: theme.id,
      name: theme.reward.title.replace(/_/g, " "),
      value: theme.reward.title.toLowerCase().replace(/_/g, "-"),
    })) ?? []),
  ];

  const availableThemes = [
    {
      id: "light",
      name: t("theme.light"),
      value: "light",
      preview: "/themes/light.png",
    },
    {
      id: "dark",
      name: t("theme.dark"),
      value: "dark",
      preview: "/themes/dark.png",
    },
    {
      id: "system",
      name: t("theme.system"),
      value: "system",
      preview: "/themes/system.png",
    },
    // Add unlocked theme rewards
    ...(unlockedThemes?.map((theme) => ({
      id: theme.id,
      name: theme.reward.title,
      value: `theme-${theme.reward.title.replace(/_/g, "-")}`,
      preview: "/themes/system.png",
    })) ?? []),
  ];
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
            <SelectValue placeholder={t("language.selectLanguage")} />
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
              <SelectValue placeholder={t("font.selectFont")} />
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

        {/* Theme Type Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">{t("theme.themeStyle")}</h4>
          <Select
            value={selectedThemeType}
            onValueChange={setSelectedThemeType}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue>
                {t(
                  `theme.style.${
                    themeTypes.find((t) => t.value === selectedThemeType)?.value
                  }`
                ) || t("theme.selectTheme")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {themeTypes.map((type) => (
                <SelectItem key={type.id} value={type.value}>
                  {t(`theme.style.${type.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Mode Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">{t("theme.appearanceMode")}</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={selectedColorMode === "light" ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedColorMode("light")}
            >
              <Sun className="h-4 w-4 mr-2" />
              {t("theme.light")}
            </Button>
            <Button
              variant={selectedColorMode === "dark" ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedColorMode("dark")}
            >
              <Moon className="h-4 w-4 mr-2" />
              {t("theme.dark")}
            </Button>
            <Button
              variant={selectedColorMode === "system" ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedColorMode("system")}
            >
              <Monitor className="h-4 w-4 mr-2" />
              {t("theme.system")}
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="text-sm font-medium mb-4">{t("theme.preview")}</h4>
          <div className="w-full max-w-lg mx-auto">
            <ThemeCard
              theme={tempTheme}
              selectedTheme={tempTheme}
              onSelect={() => {}}
            />
          </div>
        </div>

        {/* <TooltipProvider delayDuration={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {availableThemes.map((theme) => (
              <Tooltip key={theme.id}>
                <TooltipTrigger asChild>
                  <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    <ThemeCard
                      theme={theme.value}
                      selectedTheme={tempTheme}
                      onSelect={setTempTheme}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{theme.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider> */}
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
