import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TaskViewFiltersLoading = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Active filters display */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-28 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default TaskViewFiltersLoading;
