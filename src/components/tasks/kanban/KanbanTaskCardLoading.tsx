import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const KanbanTaskCardLoading = () => {
  return (
    <Card className="bg-card border rounded-md shadow-sm">
      <Skeleton className="h-1 w-full rounded-t-md" />
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-7 w-7" />
        </div>

        <div>
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-full mb-2" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-5 rounded-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const LoadingCards = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <KanbanTaskCardLoading key={index} />
    ))}
  </div>
);

export default KanbanTaskCardLoading;
