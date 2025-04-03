import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const TaskSheetSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 sm:p-6 border-b sticky top-0 bg-background z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative p-4 border rounded-lg bg-gradient-to-r from-muted/5 to-transparent"
          >
            <div className="flex items-center gap-2 text-xs mb-2">
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
    </div>
  );
};
