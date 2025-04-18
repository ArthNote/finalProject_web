"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, Check, Activity } from "lucide-react";

export default function ProjectLoadingPage() {
  return (
    <div className="p-4 space-y-6 h-[calc(100vh-4rem)]">
      {/* Header Section Skeleton */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-64 mt-2" />
                <Skeleton className="h-4 w-full max-w-2xl mt-2" />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-8" />
          </div>

          {/* Timeline Skeleton */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Check, color: "green" },
          { icon: Activity, color: "blue" },
          { icon: Clock, color: "yellow" },
          { icon: Clock, color: "yellow" },
        ].map((stat, i) => (
          <Card className="p-4" key={i}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
              </div>
              <div className="space-y-0.5">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tasks Section Skeleton */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-9 w-32" />
          </div>

          {/* Table Skeleton */}
          <div className="rounded-md border">
            <div className="border-b">
              <div className="grid grid-cols-5 p-4">
                {[48, 24, 24, 32, 16].map((width, i) => (
                  <Skeleton key={i} className={`h-4 w-${width}`} />
                ))}
              </div>
            </div>
            <div className="divide-y">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 p-4 items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48 hidden md:block" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 ml-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-[70px]" />
              <Skeleton className="h-4 w-24 hidden md:block" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
