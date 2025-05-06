import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { StreakCardProps } from "@/types/goals";
import { useLocale, useTranslations } from "next-intl";

export const StreakCard: React.FC<StreakCardProps> = ({
  streak,
  longestStreak,
}) => {
  const t = useTranslations("goals.streakCard");
  const locale = useLocale() as "fr" | "en";

  // Get the current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDayIndex = new Date().getDay();

  // Adjust to make Monday=0, Sunday=6 for display purposes
  const adjustedDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-orange-100/50 to-orange-50/30 dark:from-orange-900/20 dark:to-orange-950/10 pb-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" /> {t("title")}
        </h3>
      </CardHeader>

      <CardContent className="pt-6 flex flex-col flex-grow justify-between">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="text-5xl font-bold text-orange-500">{streak}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("current")}
            </div>
          </div>

          <div className="h-16 w-px bg-border mx-4"></div>

          <div className="text-center flex-1">
            <div className="text-4xl font-bold text-muted-foreground">
              {longestStreak}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("longest")}
            </div>
          </div>
        </div>

        <div className="mt-auto text-center">
          <div className="flex justify-between gap-2 pt-4 border-t border-border">
            {Array.from({ length: 7 }).map((_, i) => {
              // A day is active if it's today or a previous day in the streak
              // If streak >= 7, all previous days are active
              const isActive =
                streak >= 7 ||
                (i <= adjustedDayIndex && i > adjustedDayIndex - streak);

              return (
                <div key={i} className="flex-1 flex flex-col items-center py-2">
                  <div
                    className={`w-5 h-5 rounded-full mb-2 transition-all ${
                      isActive ? "bg-orange-500 scale-110" : "bg-muted"
                    }`}
                  ></div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {locale === "fr"
                      ? ["L", "M", "M", "J", "V", "S", "D"][i]
                      : ["M", "T", "W", "T", "F", "S", "S"][i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
