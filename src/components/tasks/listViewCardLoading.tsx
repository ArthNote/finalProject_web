import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ListViewCardLoading = () => {
  return (
    <div className="group flex items-start gap-3 p-3 sm:p-4 border rounded-lg bg-card overflow-hidden">
      {/* Priority and checkbox */}
      <div className="mt-1.5 flex flex-col items-center gap-2 shrink-0">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>

      {/* Task details */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-20 sm:hidden" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="hidden sm:flex h-6 w-20" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>

        {/* Description - hidden on mobile */}
        <Skeleton className="h-4 w-3/4 mb-2 sm:mb-3 hidden sm:block" />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* Schedule info */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-3.5 w-24" />
          </div>

          {/* Assigned users */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5" />
            <div className="flex -space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-5 w-5 rounded-full border border-background"
                />
              ))}
            </div>
          </div>

          {/* Tags - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1 max-w-full overflow-hidden">
            <Skeleton className="h-3 w-3" />
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-12 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListViewCardLoading;
