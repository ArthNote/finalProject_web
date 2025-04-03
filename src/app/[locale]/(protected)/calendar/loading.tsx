import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const Loading = () => {
  return (
    <div className="relative h-[calc(100vh-4rem)] w-full p-4 sm:p-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-32" /> {/* Month/Year */}
              <Skeleton className="h-5 w-16" /> {/* Tasks count */}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <Skeleton className="h-8 w-[200px] hidden md:block" /> {/* View tabs */}
              <Skeleton className="h-8 w-[100px] md:hidden" /> {/* Mobile select */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled className="text-xs h-8">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                  Today
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card className="flex-1 overflow-hidden border-radius-sm">
            <CardContent className="p-0 h-full">
              <div className="flex flex-col h-full">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-border/40">
                  {Array(7).fill(0).map((_, i) => (
                    <div key={i} className="text-center py-2">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="flex-1 grid grid-cols-7">
                  {Array(35).fill(0).map((_, i) => (
                    <div key={i} className="h-full p-1 sm:p-2 border-b border-r border-border/40">
                      {/* Date Number */}
                      <div className="text-right mb-1">
                        <Skeleton className="h-6 w-6 ml-auto rounded-full" />
                      </div>
                      {/* Task Items */}
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading;
