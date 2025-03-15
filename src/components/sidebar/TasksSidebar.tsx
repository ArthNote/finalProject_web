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
    </div>
  );
};

export default TasksSidebar;
