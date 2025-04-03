import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TaskViewFiltersLoading from "./taskViewFiltersLoading";
import ListViewCardLoading from "./listViewCardLoading";

const ListViewLoading = () => {
  return (
    <div className="space-y-6">
      <TaskViewFiltersLoading />

      {/* Todo Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListViewCardLoading key={i} />
          ))}
        </div>
      </div>

      {/* In Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <ListViewCardLoading key={i} />
          ))}
        </div>
      </div>

      {/* Completed Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <ListViewCardLoading key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListViewLoading;
