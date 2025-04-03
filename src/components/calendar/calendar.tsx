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
  parseISO,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Calendar,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCalendarTasks } from "@/lib/api/tasks";
import { TaskType } from "@/types/task";
import TaskDetailsSheet from "../tasks/side_calendar/TaskDetailsSheet";
import TaskCard from "./taskCard";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { MonthViewSkeleton } from "./loading/MonthViewSkeleton";
import { WeekViewSkeleton } from "./loading/WeekViewSkeleton";
import { DayViewSkeleton } from "./loading/DayViewSkeleton";
import { TaskSheetSkeleton } from "./loading/TaskSheetSkeleton";
import { Skeleton } from "../ui/skeleton";

type ViewMode = "month" | "week" | "day";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("calendar");

  const queryClient = useQueryClient();

  // Calculate date range based on current view
  const getDateRange = () => {
    if (viewMode === "month") {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      // Include prev/next month days that appear in the grid
      return {
        start: addDays(start, -getDay(start)),
        end: addDays(end, 6 - getDay(end)),
      };
    } else if (viewMode === "week") {
      return {
        start: startOfWeek(selectedDate),
        end: endOfWeek(selectedDate),
      };
    } else {
      // For day view, set start to beginning of day and end to end of day
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  };

  const { start, end } = getDateRange();

  const { data: calendarData, isLoading } = useQuery({
    queryKey: ["calendar-tasks", start.toISOString(), end.toISOString()],
    queryFn: () => getCalendarTasks(start, end),
  });

  // Update useEffect to invalidate query when view changes
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["calendar-tasks", start.toISOString(), end.toISOString()],
    });
  }, [viewMode, currentMonth, selectedDate]);

  useEffect(() => {
    // When the view is shown, dispatch event to open the calendar sidebar
    const event = new CustomEvent("tab-change", { detail: "calendar" });
    document.dispatchEvent(event);
  }, []);

  const nextPeriod = () => {
    if (viewMode === "month") {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
    } else if (viewMode === "week") {
      setSelectedDate(addDays(selectedDate, 7));
    } else {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  const prevPeriod = () => {
    if (viewMode === "month") {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
    } else if (viewMode === "week") {
      setSelectedDate(addDays(selectedDate, -7));
    } else {
      setSelectedDate(addDays(selectedDate, -1));
    }
  };

  const getTasksForDate = (date: Date) => {
    if (!calendarData?.tasks) return [];
    // Updated to handle both calendar days and specific times
    return calendarData.tasks
      .filter((task) => {
        const taskDate = new Date(task.date!);
        return (
          taskDate.getFullYear() === date.getFullYear() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getDate() === date.getDate()
        );
      })
      .sort((a, b) => {
        const timeA = new Date(a.startTime || a.date!).getTime();
        const timeB = new Date(b.startTime || b.date!).getTime();
        return timeA - timeB;
      });
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const viewTitle = () => {
    if (viewMode === "month") {
      return format(currentMonth, "MMMM yyyy", {
        locale: locale === "fr" ? fr : enUS,
      });
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return `${format(weekStart, "MMM d", {
        locale: locale === "fr" ? fr : enUS,
      })} - ${format(weekEnd, "MMM d, yyyy", {
        locale: locale === "fr" ? fr : enUS,
      })}`;
    } else {
      return format(selectedDate, "EEEE, MMMM d, yyyy", {
        locale: locale === "fr" ? fr : enUS,
      });
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSheetOpen(true);
  };

  const handleTaskClick = (e: React.MouseEvent, task: TaskType) => {
    e.stopPropagation(); // Prevent day click handler from firing
    setSelectedTask(task);
  };

  const getTotalTasksInCurrentView = () => {
    if (!calendarData?.tasks) return 0;

    if (viewMode === "month") {
      // For month view, count all tasks within the month
      return calendarData.tasks.filter((task) =>
        isSameMonth(new Date(task.date!), currentMonth)
      ).length;
    } else if (viewMode === "week") {
      // For week view, count all tasks within the week
      return calendarData.tasks.filter((task) => {
        const taskDate = new Date(task.date!);
        return taskDate >= start && taskDate <= end;
      }).length;
    } else {
      // For day view, return tasks for selected date
      return selectedDateTasks.length;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">{viewTitle()}</h2>
            <Badge variant="outline" className="text-xs font-normal">
              {!isLoading
                ? `${getTotalTasksInCurrentView()} ${t("tasks")}`
                : "..."}
            </Badge>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as ViewMode)}
              className="hidden md:block"
            >
              <TabsList className="h-8">
                <TabsTrigger value="month" className="h-6">
                  {t("tabs.month")}
                </TabsTrigger>
                <TabsTrigger value="week" className="h-6">
                  {t("tabs.week")}
                </TabsTrigger>
                <TabsTrigger value="day" className="h-6">
                  {t("tabs.day")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="md:hidden">
              <Select
                value={viewMode}
                onValueChange={(v) => setViewMode(v as ViewMode)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={t("view")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">{t("tabs.month")}</SelectItem>
                  <SelectItem value="week">{t("tabs.week")}</SelectItem>
                  <SelectItem value="day">{t("tabs.day")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPeriod}
                aria-label="Previous period"
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPeriod}
                aria-label="Next period"
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentMonth(new Date());
                  setSelectedDate(new Date());
                }}
                className="text-xs h-8"
              >
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                {t("today")}
              </Button>
            </div>
          </div>
        </div>

        <Card className="flex-1 overflow-hidden border-radius-sm">
          <CardContent className="p-0 h-full">
            {isLoading ? (
              <>
                {viewMode === "month" && <MonthViewSkeleton />}
                {viewMode === "week" && (
                  <WeekViewSkeleton currentDate={selectedDate} />
                )}
                {viewMode === "day" && <DayViewSkeleton />}
              </>
            ) : (
              <>
                {viewMode === "month" && (
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-7 border-b border-border/40">
                      {eachDayOfInterval({
                        start: startOfWeek(new Date()),
                        end: endOfWeek(new Date()),
                      }).map((date) => (
                        <div
                          key={format(date, "EEE")}
                          className="text-center py-2 text-xs sm:text-sm font-medium text-muted-foreground"
                        >
                          {format(date, "EEE", {
                            locale: locale === "fr" ? fr : enUS,
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="grid grid-cols-7 h-full">
                        {eachDayOfInterval({ start, end }).map((date, i) => {
                          const tasksForDay = getTasksForDate(date);
                          const isSelected = isSameDay(date, selectedDate);
                          const taskCount = tasksForDay.length;
                          const hasPriorityHigh = tasksForDay.some(
                            (task) => task.priority === "high"
                          );

                          return (
                            <TooltipProvider key={i} delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`h-full p-1 sm:p-2 border-b border-r border-border/40 transition-all ${
                                      !isSameMonth(date, currentMonth)
                                        ? "bg-muted/30 text-muted-foreground"
                                        : ""
                                    } ${isToday(date) ? "bg-accent/30" : ""} ${
                                      isSelected
                                        ? "ring-2 ring-inset ring-primary"
                                        : ""
                                    } hover:bg-accent/10 cursor-pointer`}
                                    onClick={() => handleDayClick(date)}
                                  >
                                    <div className="text-right mb-1">
                                      <span
                                        className={`text-xs sm:text-sm inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full ${
                                          isToday(date)
                                            ? "bg-primary text-primary-foreground font-medium"
                                            : ""
                                        }`}
                                      >
                                        {format(date, "d", {
                                          locale: locale === "fr" ? fr : enUS,
                                        })}
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      {tasksForDay.slice(0, 2).map((task) => (
                                        <div
                                          key={task.id}
                                          className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded truncate flex items-center gap-1 ${getPriorityColor(
                                            task.priority
                                          )}`}
                                        >
                                          <div
                                            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                              task.priority === "high"
                                                ? "bg-red-500"
                                                : task.priority === "medium"
                                                ? "bg-amber-500"
                                                : "bg-green-500"
                                            }`}
                                          ></div>
                                          {task.title}
                                        </div>
                                      ))}
                                      {tasksForDay.length > 2 && (
                                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                                          +{tasksForDay.length - 2} {t("more")}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="p-2 max-w-xs"
                                >
                                  <div>
                                    <div className="font-medium">
                                      {format(date, "EEEE, MMMM d", {
                                        locale: locale === "fr" ? fr : enUS,
                                      })}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {taskCount === 0 ? (
                                        t("noTasksScheduled")
                                      ) : (
                                        <div className="space-y-1">
                                          <div>
                                            {taskCount} {t("task")}
                                            {taskCount !== 1 ? "s" : ""}
                                          </div>
                                          {hasPriorityHigh && (
                                            <div className="flex items-center gap-1 text-red-500">
                                              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                              <span>
                                                {t("includesHighPriority")}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                                      <Info className="h-3 w-3" />
                                      <span>{t("clickToView")}</span>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {viewMode === "week" && (
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-7 border-b border-border/40">
                      {eachDayOfInterval({ start, end }).map((date) => (
                        <TooltipProvider
                          key={date.toString()}
                          delayDuration={300}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="text-center py-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleDayClick(date)}
                              >
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                  {format(date, "EEE", {
                                    locale: locale === "fr" ? fr : enUS,
                                  })}
                                </span>
                                <span
                                  className={`mt-1 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-medium ${
                                    isToday(date)
                                      ? "bg-primary text-primary-foreground"
                                      : isSameDay(date, selectedDate)
                                      ? "bg-accent"
                                      : ""
                                  }`}
                                >
                                  {format(date, "d", {
                                    locale: locale === "fr" ? fr : enUS,
                                  })}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="p-2">
                              <div className="font-medium">
                                {format(date, "EEEE, MMMM d", {
                                  locale: locale === "fr" ? fr : enUS,
                                })}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {getTasksForDate(date).length} {t("tasks")}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="grid grid-cols-7 divide-x divide-border h-full">
                        {eachDayOfInterval({ start, end }).map((date) => {
                          const tasksForDay = getTasksForDate(date);
                          return (
                            <div
                              key={date.toString()}
                              className={`h-full p-1 sm:p-2 ${
                                isSameDay(date, selectedDate)
                                  ? "bg-accent/20"
                                  : ""
                              }`}
                              onClick={() => handleDayClick(date)}
                            >
                              <div className="space-y-1 sm:space-y-2">
                                {tasksForDay.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`p-1 sm:p-2 rounded text-[10px] sm:text-sm ${getPriorityColor(
                                      task.priority
                                    )} hover:opacity-80 cursor-pointer`}
                                    onClick={(e) => handleTaskClick(e, task)}
                                  >
                                    <div className="font-medium truncate">
                                      {task.title}
                                    </div>
                                    {task.assignedTo &&
                                      task.assignedTo.length > 0 && (
                                        <div className="mt-1 flex items-center gap-1 text-[8px] sm:text-xs">
                                          <Avatar className="h-3 w-3 sm:h-4 sm:w-4">
                                            <AvatarFallback className="text-[6px] sm:text-[8px]">
                                              {task.assignedTo[0].name.charAt(
                                                0
                                              )}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="hidden sm:inline">
                                            {task.assignedTo[0].name}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {viewMode === "day" && (
                  <ScrollArea className="h-full">
                    <div className="p-2 sm:p-4 space-y-3">
                      {selectedDateTasks.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center p-8 text-center">
                          <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">
                            {t("noTasksScheduled")}
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-[250px]">
                            {t("noTasksScheduledDescription")}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-px">
                          {tasksByPriority(selectedDateTasks).map(
                            ({ priority, tasks }) => (
                              <div key={priority}>
                                {tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`group relative p-4 border-l-2 transition-all cursor-pointer
                                  ${
                                    priority === "high"
                                      ? "border-l-red-600 hover:border-l-red-500 bg-gradient-to-r from-red-500/5 to-transparent hover:from-red-500/10"
                                      : priority === "medium"
                                      ? "border-l-amber-600 hover:border-l-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent hover:from-amber-500/10"
                                      : "border-l-emerald-600 hover:border-l-emerald-500 bg-gradient-to-r from-emerald-500/5 to-transparent hover:from-emerald-500/10"
                                  }
                                  hover:bg-accent/5`}
                                    onClick={(e) => handleTaskClick(e, task)}
                                  >
                                    {/* Time & Priority Indicator */}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>
                                          {format(
                                            new Date(
                                              task.startTime || task.date!
                                            ),
                                            "h:mm a",
                                            {
                                              locale:
                                                locale === "fr" ? fr : enUS,
                                            }
                                          )}
                                        </span>
                                      </div>
                                      {priority === "high" && (
                                        <Badge
                                          variant="destructive"
                                          className="h-5 px-1.5"
                                        >
                                          {t("urgent")}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-1">
                                      <h4 className="font-medium text-sm">
                                        {task.title}
                                      </h4>
                                      {task.description && (
                                        <p className="text-sm text-muted-foreground leading-normal line-clamp-2 group-hover:line-clamp-none">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* Footer */}
                                    {task.assignedTo &&
                                      task.assignedTo.length > 0 && (
                                        <div className="flex items-center gap-2 mt-3">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs bg-accent">
                                              {task.assignedTo[0].name.charAt(
                                                0
                                              )}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs text-muted-foreground">
                                            {task.assignedTo[0].name}
                                          </span>
                                        </div>
                                      )}

                                    {/* Hover Actions */}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                      >
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                        <span className="sr-only">
                                          {t("viewDetails")}
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sheet for all screen sizes */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md p-0">
          {isLoading ? (
            <TaskSheetSkeleton />
          ) : (
            <div className="flex flex-col h-full bg-background">
              <div className="p-4 sm:p-6 border-b sticky top-0 bg-background z-10">
                <SheetHeader className="mb-0">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            isToday(selectedDate) ? "default" : "outline"
                          }
                        >
                          {isToday(selectedDate)
                            ? t("today")
                            : format(selectedDate, "EEEE", {
                                locale: locale === "fr" ? fr : enUS,
                              })}
                        </Badge>
                        {selectedDateTasks.some(
                          (t) => t.priority === "high"
                        ) && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {t("highPriority")}
                          </Badge>
                        )}
                      </div>
                      <SheetTitle className="text-2xl font-bold">
                        {format(selectedDate, "MMMM d, yyyy", {
                          locale: locale === "fr" ? fr : enUS,
                        })}
                      </SheetTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSheetOpen(false)}
                      className="h-8 w-8 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">
                        {selectedDateTasks.length}{" "}
                        {selectedDateTasks.length === 1 ? "task" : "tasks"}{" "}
                        {t("scheduled")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span>{t("high")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{t("medium")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>{t("low")}</span>
                      </div>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              <ScrollArea className="flex-1">
                {selectedDateTasks.length === 0 ? (
                  <div className="h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <Calendar className="h-8 w-8 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {t("noTasksScheduled")}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {selectedDateTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        getPriorityColor={getPriorityColor}
                        onClick={(e) => handleTaskClick(e, task)}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <TaskDetailsSheet
        task={selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onTaskComplete={(taskId) => {
          queryClient.invalidateQueries({
            queryKey: ["calendar-tasks"],
          });
        }}
        onTaskScheduled={(taskId) => {
          queryClient.invalidateQueries({
            queryKey: ["calendar-tasks"],
          });
        }}
      />
    </div>
  );
};

// Helper function to organize tasks by priority
const tasksByPriority = (tasks: TaskType[]) => {
  const priorities = ["high", "medium", "low"] as const;

  return priorities
    .map((priority) => ({
      priority,
      tasks: tasks.filter((task) => task.priority === priority),
    }))
    .filter((group) => group.tasks.length > 0);
};

export default CalendarView;
