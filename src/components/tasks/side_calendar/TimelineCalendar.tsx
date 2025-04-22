"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Settings,
} from "lucide-react";
import { format, addDays, subDays, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { EventItem } from "@/components/tasks/side_calendar/EventItem";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CalendarSettingsDialog, {
  CalendarSettings,
} from "./CalendarSettingsDialog";
import { useCalendarStore } from "@/lib/state/useCalendarStore";
import TaskDetailsSheet from "./TaskDetailsSheet";
import { TaskType } from "@/types/task";
import { useLocale } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTasksByDate,
  updateTaskTimes,
  updateTaskCompleted,
  updateTaskScheduled,
} from "@/lib/api/tasks";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import TimelineCalendarSkeleton from "./TimelineCalendarSkeleton";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CURRENT_TIME = new Date();
const CURRENT_HOUR = CURRENT_TIME.getHours();

const TimelineCalendar = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [openSidebar, setOpenSidebar] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<HTMLDivElement | null>(null);
  const locale = useLocale() as "en" | "fr";
  const t = useTranslations("tasks.sideCalendar");
  const queryClient = useQueryClient();

  const [calendarSettings, setCalendarSettings] =
    React.useState<CalendarSettings>({
      showWeekends: true,
      colorScheme: "default",
      showCompletedTasks: true,
      timeFormat: "12h",
      startHour: 8,
      endHour: 18,
      expandAllDay: false,
    });

  const [selectedTask, setSelectedTask] = React.useState<TaskType | null>(null);

  // Get state and actions from our Zustand store
  const {
    events,
    setEvents,
    isSettingsOpen,
    setIsSettingsOpen,
    selectedEvent,
    setSelectedEvent,
    updateEvent,
  } = useCalendarStore();

  // Query for tasks on the selected date
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks-by-date", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      try {
        const result = await getTasksByDate({
          date: selectedDate.toISOString(),
        });
        return result.tasks;
      } catch (error) {
        console.error("Error fetching tasks by date:", error);
        throw error;
      }
    },
  });

  // Mutation for updating task times when dragging or resizing
  const { mutate: updateTimes } = useMutation({
    mutationFn: updateTaskTimes,
    onSuccess: () => {
      // Immediately refetch tasks to update UI without waiting for background invalidation
      refetch();

      // Also invalidate any related queries
      queryClient.invalidateQueries({
        queryKey: ["tasks-by-date"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        type: "all",
      });
      queryClient.refetchQueries({
        queryKey: ["tasks"],
        type: "all",
      });

      toast({
        title: t("toast.updateSuccess.title"),
        description: t("toast.updateSuccess.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toast.updateError.title"),
        description: t("toast.updateError.description"),
        variant: "destructive",
      });
    },
  });

  // Mutation for toggling task completion status
  const { mutate: toggleComplete } = useMutation({
    mutationFn: updateTaskCompleted,
    onSuccess: () => {
      // Immediately refetch tasks to update UI
      refetch();

      queryClient.invalidateQueries({
        queryKey: ["tasks-by-date"],
      });

      queryClient.refetchQueries({
        queryKey: ["tasks"],
        type: "all",
      });

      toast({
        title: t("toast.statusSuccess.title"),
        description: t("toast.statusSuccess.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toast.statusError.title"),
        description: t("toast.statusError.description"),
        variant: "destructive",
      });
    },
  });

  // Mutation for toggling task scheduled status
  const { mutate: toggleScheduled } = useMutation({
    mutationFn: (params: { id: string; scheduled: boolean }) =>
      updateTaskScheduled(params.id, params.scheduled),
    onSuccess: () => {
      // Immediately refetch tasks to update UI
      refetch();

      queryClient.invalidateQueries({
        queryKey: ["tasks-by-date"],
      });

      queryClient.refetchQueries({
        queryKey: ["tasks"],
        type: "all",
      });

      toast({
        title: t("toast.updateSuccess.title"),
        description: t("toast.updateSuccess.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toast.updateError.title"),
        description: t("toast.updateError.description"),
        variant: "destructive",
      });
    },
  });

  // Scroll to current time when component mounts or date changes to today
  React.useEffect(() => {
    if (scrollContainerRef.current && isToday(selectedDate)) {
      const currentTimePosition = ((CURRENT_HOUR * 60) / (24 * 60)) * 1440;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        currentTimePosition - 100
      );
    }
  }, [selectedDate]);

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());

    // Scroll to current time
    if (scrollContainerRef.current) {
      const currentTimePosition = ((CURRENT_HOUR * 60) / (24 * 60)) * 1440;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        currentTimePosition - 100
      );
    }
  };

  // Handler for date selection from the calendar popover
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle saving calendar settings
  const handleSaveSettings = () => {
    // Here you would save the settings to persistent storage
    setIsSettingsOpen(false);
  };

  // Handle task selection
  const handleTaskSelected = (task: TaskType) => {
    // Only set the selected task without performing an update
    setSelectedTask(task);
  };

  // Handle task completion toggle
  const handleTaskComplete = (taskId: string, completed: boolean) => {
    // Call the mutation to toggle task completion
    toggleComplete(taskId);
    setSelectedTask(null); // Close the details sheet
  };

  // Handle task scheduling toggle
  const handleTaskScheduled = (taskId: string, scheduled: boolean) => {
    // Call the mutation to toggle task scheduled status
    toggleScheduled({ id: taskId, scheduled });
    setSelectedTask(null); // Close the details sheet
  };

  // Handle event update (when dragging/resizing in calendar)
  const handleEventUpdate = (updatedTask: TaskType) => {
    // Only call the mutation to update task times when there's an actual change
    if (updatedTask.startTime && updatedTask.endTime && updatedTask.duration) {
      // Find the original task to compare with
      const originalTask = data?.find((task) => task.id === updatedTask.id);

      if (!originalTask) return;

      // Convert dates to timestamps for reliable comparison
      const originalStart = new Date(originalTask.startTime!).getTime();
      const originalEnd = new Date(originalTask.endTime!).getTime();
      const updatedStart = new Date(updatedTask.startTime).getTime();
      const updatedEnd = new Date(updatedTask.endTime).getTime();

      // Only update if something actually changed
      if (
        originalStart !== updatedStart ||
        originalEnd !== updatedEnd ||
        originalTask.duration !== updatedTask.duration
      ) {
        console.log("Task actually changed, updating in database");
        updateTimes({
          id: updatedTask.id,
          startTime: new Date(updatedTask.startTime),
          endTime: new Date(updatedTask.endTime),
          duration: updatedTask.duration,
          date: new Date(updatedTask.date!),
        });
      } else {
        console.log("No actual changes detected, skipping update");
      }
    }
  };

  // Filter out tasks that should not be displayed based on settings
  const filteredTasks = React.useMemo(() => {
    if (!data) return [];

    return data.filter((task: TaskType) => {
      // If the showCompletedTasks setting is off, hide completed tasks
      if (!calendarSettings.showCompletedTasks && task.completed) {
        return false;
      }
      return task.scheduled;
    });
  }, [data, calendarSettings.showCompletedTasks]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 h-full bg-background">
        {/* Date Navigation - Always visible */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          {/* Left: Calendar Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                variant="compact"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                locale={locale === "en" ? enUS : fr}
                lang={locale}
              />
            </PopoverContent>
          </Popover>

          {/* Center: Date Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousDay}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <button
              onClick={!isToday(selectedDate) ? handleToday : undefined}
              className={cn(
                "flex flex-col items-center min-w-[140px] px-2 rounded-md transition-colors",
                !isToday(selectedDate) &&
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800/30 cursor-pointer"
              )}
            >
              <h3 className="text-[13px] font-medium tracking-tight">
                {format(selectedDate, "EEEE", {
                  locale: locale === "en" ? enUS : fr,
                })}
              </h3>
              <p
                className={cn(
                  "text-[11px] leading-tight",
                  isToday(selectedDate)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {format(selectedDate, "MMMM d", {
                  locale: locale === "en" ? enUS : fr,
                })}
              </p>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Settings Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="h-8"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>

        {/* Timeline Content - Show skeleton when loading */}
        {isLoading && !data ? (
          <TimelineCalendarSkeleton />
        ) : (
          <ScrollArea
            className="flex-1 [&>div>div]:!block"
            ref={scrollContainerRef}
          >
            <div className="relative px-2">
              {/* Current Time Indicator */}
              {isToday(selectedDate) && (
                <>
                  <div
                    className="absolute left-[60px] w-1.5 h-1.5 rounded-full bg-primary z-10 shadow-[0_0_6px_var(--shadow-color)]"
                    style={
                      {
                        top: `${
                          ((CURRENT_TIME.getHours() * 60 +
                            CURRENT_TIME.getMinutes()) /
                            (24 * 60)) *
                          100
                        }%`,
                        transform: "translate(-50%, -50%)",
                        "--shadow-color": "hsl(var(--primary) / 0.5)",
                      } as React.CSSProperties
                    }
                  />
                  <div
                    className="absolute left-[68px] right-6 h-[1.5px] bg-gradient-to-r from-primary to-transparent z-10"
                    style={{
                      top: `${
                        ((CURRENT_TIME.getHours() * 60 +
                          CURRENT_TIME.getMinutes()) /
                          (24 * 60)) *
                        100
                      }%`,
                    }}
                  />
                </>
              )}
              {/* Tasks Layer */}
              <div
                className="absolute left-[68px] right-6 top-0 bottom-0 pointer-events-none z-10"
                ref={timelineRef}
              >
                {filteredTasks.map((task: TaskType) => (
                  <EventItem
                    key={task.id}
                    event={task}
                    selectedDate={selectedDate}
                    timelineRef={timelineRef}
                    onSelect={() => handleTaskSelected(task)}
                    onUpdate={handleEventUpdate}
                  />
                ))}
              </div>

              {/* Time Slots */}
              <div className="relative min-h-[3600px] pr-6">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className={`flex items-start h-[150px] relative group transition-colors
                        ${
                          hour === CURRENT_HOUR && isToday(selectedDate)
                            ? "bg-gradient-to-r from-primary/5 to-transparent"
                            : ""
                        }`}
                  >
                    <div
                      className={`w-[60px] pr-4 py-2 text-[11px] font-medium tracking-wide text-right sticky left-0
                          ${
                            hour === CURRENT_HOUR && isToday(selectedDate)
                              ? "text-primary"
                              : "text-muted-foreground"
                          } 
                          bg-white dark:bg-background`}
                    >
                      {hour === 0
                        ? "12 AM"
                        : hour < 12
                        ? `${hour} AM`
                        : hour === 12
                        ? "12 PM"
                        : `${hour - 12} PM`}
                    </div>
                    <div className="flex-1 relative">
                      {hour > 0 && (
                        <div className="absolute left-0 right-0 top-0 h-[1px] border-t-0 bg-neutral-100 dark:bg-neutral-800" />
                      )}
                      {/* 30 minute mark */}
                      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-neutral-100 dark:border-neutral-800" />
                      {/* Hover effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-800/30 dark:to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}

        {/* Dialogs and Sheets */}
        <CalendarSettingsDialog
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          settings={calendarSettings}
          onSettingsChange={setCalendarSettings}
          onSave={handleSaveSettings}
        />

        <TaskDetailsSheet
          task={selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onTaskComplete={handleTaskComplete}
          onTaskScheduled={handleTaskScheduled}
        />
      </div>
    </div>
  );
};

export default TimelineCalendar;
