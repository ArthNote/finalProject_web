import React from "react";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export const PlanSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-5 w-3/4 max-w-md" />
      </div>

      {/* Current Subscription Details */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-6 pl-1">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Separator />
        </div>
      </div>

      {/* Billing Info Section */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4 pl-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <Separator />
          <div>
            <Skeleton className="h-5 w-36 mb-3" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Management Section */}
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3 pl-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col h-full">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="mt-auto pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
