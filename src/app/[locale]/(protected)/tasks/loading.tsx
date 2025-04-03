import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ListViewLoading from "@/components/tasks/listViewLoading";
import TimelineCalendarSkeleton from "@/components/tasks/side_calendar/TimelineCalendarSkeleton";

const Loading = () => {
  return (
    <Card className="flex h-[90vh] relative">
      {/* Timeline Calendar Loading State */}
      <div className="hidden lg:flex flex-col w-[500px] h-full border-r">
        <TimelineCalendarSkeleton />
      </div>

      {/* Main Content Loading State */}
      <main className="flex-1 relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4 sm:p-8 pb-28 sm:pb-24">
            <div className="w-full max-w-[100vw]">
              <ListViewLoading />
            </div>
          </div>
        </ScrollArea>
      </main>
    </Card>
  );
};

export default Loading;
