import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "next-intl";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export const DayViewSkeleton = () => {
  const locale = useLocale() as "fr" | "en";
  const today = new Date();

  return (
    <>
      <div className="border-b border-border/40 py-2 px-4">
        <div className="text-center text-sm font-medium text-muted-foreground">
          {format(today, "EEEE", {
            locale: locale === "fr" ? fr : enUS,
          })}
        </div>
      </div>
      <ScrollArea className="h-full">
        <div className="p-2 sm:p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="group relative p-4 border-l-2 border-l-muted transition-all bg-gradient-to-r from-muted/5 to-transparent"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Skeleton className="h-3 w-16" />
                {Math.random() > 0.7 && <Skeleton className="h-4 w-12" />}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full max-w-[70%]" />
              </div>
              {Math.random() > 0.5 && (
                <div className="flex items-center gap-2 mt-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
