import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "next-intl";
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export const MonthViewSkeleton = () => {
  const locale = useLocale() as "fr" | "en";

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-border/40">
        {eachDayOfInterval({
          start: startOfWeek(new Date()),
          end: endOfWeek(new Date()),
        }).map((date) => (
          <div
            key={format(date, "EEE")}
            className="text-center py-2 text-xs sm:text-sm font-medium text-muted-foreground"
          >
            {format(date, "EEE", {
              locale: locale === "fr" ? fr : enUS,
            })}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 h-full">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-full p-1 sm:p-2 border-b border-r border-border/40"
          >
            <div className="text-right mb-1">
              <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 ml-auto rounded-full" />
            </div>
            <div className="space-y-1">
              {Array.from({ length: Math.random() > 0.5 ? 2 : 1 }).map(
                (_, j) => (
                  <Skeleton key={j} className="h-4 sm:h-5 w-full rounded-md" />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
