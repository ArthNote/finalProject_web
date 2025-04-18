import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import GridViewCardLoading from "./gridViewCardLoading";
import TaskViewFiltersLoading from "./taskViewFiltersLoading";

const GridViewLoading = () => {
  return (
    <div className="space-y-6">
      <TaskViewFiltersLoading />

      {/* Unscheduled Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <GridViewCardLoading key={i} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <GridViewCardLoading key={i} />
          ))}
        </div>
      </div>

      {/* In Progress Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <GridViewCardLoading key={i} />
          ))}
        </div>
      </div>

      {/* Completed Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <GridViewCardLoading key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridViewLoading;
