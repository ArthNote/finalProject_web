"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import FloatingToolbar from "@/components/tasks/side_calendar/FloatingToolbar";
import { useCalendarStore } from "@/lib/state/useCalendarStore";
import ListView from "@/components/tasks/listView";
import KanbanView from "@/components/tasks/KanbanView";
import GridView from "@/components/tasks/GridView";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelineCalendar from "@/components/tasks/side_calendar/TimelineCalendar";

const Page = () => {
  const { viewMode } = useCalendarStore();

  const renderView = () => {
    switch (viewMode) {
      case "list":
        return <ListView />;
      case "kanban":
        return <KanbanView />;
      case "grid":
        return <GridView />;
      default:
        return <ListView />;
    }
  };

  return (
    <Card className="flex h-[90vh] relative">
      <div className="hidden lg:flex flex-col w-[500px] h-full border-r">
        <TimelineCalendar />
      </div>
      <main className="flex-1 relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4 sm:p-8 pb-28 sm:pb-24">
            <div className="w-full max-w-[100vw]">{renderView()}</div>
          </div>
        </ScrollArea>
      </main>
      <FloatingToolbar />
    </Card>
  );
};

export default Page;
