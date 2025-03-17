"use client";
import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  getDay,
  addDays,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Design meeting with team",
    priority: "high",
    dueDate: new Date(),
  },
  {
    id: "2",
    title: "Prepare presentation",
    priority: "medium",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
  },
  {
    id: "3",
    title: "Lunch with marketing team",
    priority: "medium",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
  },
  {
    id: "4",
    title: "Code review",
    priority: "medium",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
  },
  {
    id: "5",
    title: "Quick stand-up",
    priority: "low",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  },
  {
    id: "6",
    title: "Coffee break",
    priority: "low",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
  },
];

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // When the view is shown, dispatch event to open the calendar sidebar
    const event = new CustomEvent("tab-change", { detail: "calendar" });
    document.dispatchEvent(event);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = addDays(monthStart, -getDay(monthStart));
  const endDate = addDays(monthEnd, 6 - getDay(monthEnd));
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const getTasksForDate = (date: Date) => {
    return sampleTasks.filter(
      (task) =>
        format(task.dueDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="grid grid-cols-7 border-b border-border/40">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center py-2 text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <ScrollArea className="h-[calc(100%-40px)]">
            <div className="grid grid-cols-7 h-full">
              {dateRange.map((date, i) => {
                const tasksForDay = getTasksForDate(date);

                return (
                  <div
                    key={i}
                    className={`min-h-24 p-2 border-b border-r border-border/40 ${
                      !isSameMonth(date, currentMonth)
                        ? "bg-muted/30 text-muted-foreground"
                        : ""
                    } ${isToday(date) ? "bg-accent/30" : ""} ${
                      format(date, "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd")
                        ? "ring-2 ring-inset ring-primary/20"
                        : ""
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-right mb-1">
                      <span
                        className={`text-sm inline-flex h-6 w-6 items-center justify-center rounded-full ${
                          isToday(date)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                      >
                        {format(date, "d")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {tasksForDay.map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded truncate ${
                            task.priority === "high"
                              ? "bg-priority-high/15 text-priority-high"
                              : task.priority === "medium"
                              ? "bg-priority-medium/15 text-priority-medium"
                              : "bg-priority-low/15 text-priority-low"
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
