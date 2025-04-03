"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const TimelineCalendarSkeleton = () => {
  return (
    <ScrollArea className="flex-1">
      <div className="relative px-2 min-h-[1440px]">
        {HOURS.map((hour) => (
          <div key={hour} className="flex items-start h-[150px] relative group">
            <div className="w-[60px] pr-4 py-2 text-[11px] font-medium tracking-wide text-right sticky left-0 bg-background">
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </div>
            <div className="flex-1 relative">
              {hour > 0 && (
                <div className="absolute left-0 right-0 top-0 h-[1px] border-t-0 bg-neutral-100 dark:bg-neutral-800" />
              )}
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-neutral-100 dark:border-neutral-800" />
            </div>
          </div>
        ))}

        {/* Task Skeletons - Randomly positioned */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute left-[68px] right-6"
            style={{
              top: `${Math.random() * 80}%`,
              height: `${50 + Math.random() * 100}px`,
            }}
          >
            <div className="h-full w-full">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TimelineCalendarSkeleton;
