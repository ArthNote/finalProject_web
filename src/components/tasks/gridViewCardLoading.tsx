import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

const GridViewCardLoading = () => {
  return (
    <Card className="cursor-pointer">
      <Skeleton className="h-1 w-full rounded-t-md" />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-5 w-40" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1 mb-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridViewCardLoading;
