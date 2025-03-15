"use client";

import React from "react";
import TasksSidebar from "@/components/sidebar/TasksSidebar";
import { Card } from "@/components/ui/card";
import FloatingToolbar from "@/components/calendar/FloatingToolbar";
import { useCalendarStore } from "@/lib/state/useCalendarStore";
import ListView from "@/components/tasks/listView";
import KanbanView from "@/components/tasks/KanbanView";
import GridView from "@/components/tasks/GridView";
import { ScrollArea } from "@/components/ui/scroll-area";

const Page = () => {
  const { viewMode } = useCalendarStore();

  // Function to render the appropriate view based on viewMode
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
      <TasksSidebar />
      <main className="flex-1 relative">
        <ScrollArea className="h-full w-full">
          <div className="p-8 pb-28 sm:pb-24">
            <div className="w-full">{renderView()}</div>
          </div>
        </ScrollArea>
      </main>

      {/* FloatingToolbar is now outside the main content padding area */}
      <FloatingToolbar />
    </Card>
  );
};

export default Page;
