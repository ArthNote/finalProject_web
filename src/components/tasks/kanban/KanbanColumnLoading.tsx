import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import KanbanTaskCardLoading from "./KanbanTaskCardLoading";

const KanbanColumnLoading = () => {
  return (
    <div className="flex flex-col border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
        <Skeleton className="h-7 w-7" />
      </div>

      <div className="p-3 flex-1 min-h-[50vh] flex flex-col">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <KanbanTaskCardLoading key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumnLoading;
