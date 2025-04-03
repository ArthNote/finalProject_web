import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "next-intl";
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface WeekViewSkeletonProps {
  currentDate?: Date;
}

export const WeekViewSkeleton = ({
  currentDate = new Date(),
}: WeekViewSkeletonProps) => {
  const locale = useLocale() as "fr" | "en";
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-border/40">
        {eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) => (
          <div
            key={date.toString()}
            className="text-center py-2 flex flex-col items-center"
          >
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {format(date, "EEE", {
                locale: locale === "fr" ? fr : enUS,
              })}
            </span>
            <span className="mt-1 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-medium">
              {format(date, "d", {
                locale: locale === "fr" ? fr : enUS,
              })}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-border h-full">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-full p-1 sm:p-2">
              <div className="space-y-2">
                {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
                  (_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-16 w-full rounded-md" />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
