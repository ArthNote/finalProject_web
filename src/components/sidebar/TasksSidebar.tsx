"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import TimelineCalendar from "@/components/calendar/TimelineCalendar";

const TasksSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-[500px] h-full border-r bg-white dark:bg-background">
        <TimelineCalendar />
      </div>

      {/* Mobile Toggle */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden fixed bottom-6 right-6 z-50 px-4 py-2 h-auto gap-2
              bg-white dark:bg-background shadow-lg border border-neutral-200 dark:border-neutral-800
              hover:bg-neutral-100 dark:hover:bg-neutral-800/30 transition-colors"
          >
            <CalendarRange className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Calendar</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-[90vw] border-r bg-background"
        >
          <TimelineCalendar />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TasksSidebar;
