import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Tag,
  CalendarClock,
  MoreHorizontal,
  Search,
  Filter,
  X,
  CalendarRange,
  ChevronDown,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { sampleTasks, updateTaskCompleted } from "@/lib/taskService";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskType } from "@/types/task";

const GridView = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "high", "medium", "low"
  const [showFilters, setShowFilters] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Initialize with today's date by default
  const [dateRange, setDateRange] = useState<{
    type: "none" | "today" | "tomorrow" | "week" | "custom";
    from: Date | undefined;
    to: Date | undefined;
  }>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      type: "today",
      from: today,
      to: today,
    };
  });

  // Get unique categories from tasks
  const categories = ["all", ...new Set(tasks.map((task) => task.category))];

  const handleToggleComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedTask = updateTaskCompleted(taskId, !task.completed);
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const handleViewTaskDetails = (task: TaskType) => {
    setSelectedTask(task);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 text-red-500 bg-red-50 dark:bg-red-500/10";
      case "medium":
        return "border-amber-300 text-amber-500 bg-amber-50 dark:bg-amber-500/10";
      case "low":
        return "border-green-300 text-green-500 bg-green-50 dark:bg-green-500/10";
      default:
        return "border-blue-300 text-blue-500 bg-blue-50 dark:bg-blue-500/10";
    }
  };

  const getPriorityIndicatorColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span>High</span>
          </div>
        );
      case "medium":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <span>Medium</span>
          </div>
        );
      case "low":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>Low</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span>Normal</span>
          </div>
        );
    }
  };

  // Helper to check if a task date is within the selected range
  const isTaskInDateRange = (taskDate: string) => {
    const taskDateTime = new Date(taskDate);

    if (dateRange.type === "none") {
      return true;
    }

    if (dateRange.from && dateRange.to) {
      // Set the time of "to" date to end of day for inclusive range
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);

      return taskDateTime >= dateRange.from && taskDateTime <= endDate;
    }

    if (dateRange.from && !dateRange.to) {
      return taskDateTime >= dateRange.from;
    }

    return true;
  };

  // Filter tasks based on search query, category, scheduled status, priority, and date
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;

    const matchesScheduledStatus =
      scheduledFilter === "all" ||
      (scheduledFilter === "scheduled" && task.scheduled) ||
      (scheduledFilter === "unscheduled" && !task.scheduled);

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    // Unscheduled tasks are always included if date filter is active
    if (!task.scheduled) {
      return (
        matchesSearch &&
        matchesCategory &&
        matchesScheduledStatus &&
        matchesPriority
      );
    }

    // For scheduled tasks, check date range
    const matchesDate = isTaskInDateRange(task.date?.toISOString() || "");

    return (
      matchesSearch &&
      matchesCategory &&
      matchesScheduledStatus &&
      matchesPriority &&
      matchesDate
    );
  });

  // Check if any filters are active
  const isFilterActive =
    categoryFilter !== "all" ||
    scheduledFilter !== "all" ||
    priorityFilter !== "all";

  const isDateFilterActive = dateRange.type !== "none";

  const clearFilters = () => {
    setCategoryFilter("all");
    setScheduledFilter("all");
    setPriorityFilter("all");
  };

  const clearDateFilter = () => {
    setDateRange({
      type: "none",
      from: undefined,
      to: undefined,
    });
    setIsCalendarOpen(false);
  };

  // Set date filters for today
  const setTodayFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setDateRange({
      type: "today",
      from: today,
      to: today,
    });
    setIsCalendarOpen(false);
  };

  // Set date filters for tomorrow
  const setTomorrowFilter = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    setDateRange({
      type: "tomorrow",
      from: tomorrow,
      to: tomorrow,
    });
    setIsCalendarOpen(false);
  };

  // Set date filters for this week
  const setThisWeekFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    const dayOfWeek = endOfWeek.getDay();
    const daysUntilEndOfWeek = 6 - dayOfWeek; // Until Sunday
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilEndOfWeek);
    endOfWeek.setHours(23, 59, 59, 999);

    setDateRange({
      type: "week",
      from: today,
      to: endOfWeek,
    });
    setIsCalendarOpen(false);
  };

  // Handle custom date range selection
  const handleCustomDateRange = (
    from: Date | undefined,
    to: Date | undefined
  ) => {
    if (!from) {
      clearDateFilter();
      return;
    }

    setDateRange({
      type: "custom",
      from,
      to: to || from,
    });
  };

  // Format the date range for display
  const formatDateRange = () => {
    switch (dateRange.type) {
      case "today":
        return "Today";
      case "tomorrow":
        return "Tomorrow";
      case "week":
        return "This Week";
      case "custom":
        if (
          dateRange.from &&
          dateRange.to &&
          dateRange.from.toDateString() === dateRange.to.toDateString()
        ) {
          return format(dateRange.from, "MMM d, yyyy");
        } else if (dateRange.from && dateRange.to) {
          return `${format(dateRange.from, "MMM d")} - ${format(
            dateRange.to,
            "MMM d, yyyy"
          )}`;
        } else if (dateRange.from) {
          return `From ${format(dateRange.from, "MMM d, yyyy")}`;
        }
        return "Custom Range";
      default:
        return "All Dates";
    }
  };

  return (
    <div>
      {/* Header with search and filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Date Range Selector */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={isDateFilterActive ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "gap-1.5",
                    isDateFilterActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{formatDateRange()}</span>
                  {isDateFilterActive && (
                    <X
                      className="h-3.5 w-3.5 ml-1 hover:bg-background/20 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDateFilter();
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Filter by date</h4>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant={
                        dateRange.type === "today" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={setTodayFilter}
                      className="justify-start"
                    >
                      Today
                    </Button>
                    <Button
                      variant={
                        dateRange.type === "tomorrow" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={setTomorrowFilter}
                      className="justify-start"
                    >
                      Tomorrow
                    </Button>
                    <Button
                      variant={
                        dateRange.type === "week" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={setThisWeekFilter}
                      className="justify-start"
                    >
                      This Week
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Custom range</h4>
                    <Calendar
                      mode="range"
                      variant="compact"
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to,
                      }}
                      onSelect={(range) => {
                        handleCustomDateRange(range?.from, range?.to);
                      }}
                      initialFocus
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  variant={isFilterActive ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "gap-1.5",
                    isFilterActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                  {isFilterActive && (
                    <span className="ml-1 rounded-full bg-primary-foreground text-primary w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {[
                        categoryFilter !== "all" ? 1 : 0,
                        scheduledFilter !== "all" ? 1 : 0,
                        priorityFilter !== "all" ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {isFilterActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={clearFilters}
                      >
                        <X className="mr-1 h-3 w-3" /> Clear all
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={scheduledFilter}
                      onValueChange={setScheduledFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Task Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="unscheduled">Unscheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active filters display */}
        {(isFilterActive || isDateFilterActive) && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-muted-foreground">
              Active filters:
            </span>
            {categoryFilter !== "all" && (
              <Badge
                variant="secondary"
                className="px-2 flex gap-1 items-center"
              >
                Category: {categoryFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setCategoryFilter("all")}
                />
              </Badge>
            )}
            {scheduledFilter !== "all" && (
              <Badge
                variant="secondary"
                className="px-2 flex gap-1 items-center"
              >
                Status: {scheduledFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setScheduledFilter("all")}
                />
              </Badge>
            )}
            {priorityFilter !== "all" && (
              <Badge
                variant="secondary"
                className="px-2 flex gap-1 items-center"
              >
                Priority: {priorityFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setPriorityFilter("all")}
                />
              </Badge>
            )}
            {isDateFilterActive && (
              <Badge
                variant="secondary"
                className="px-2 flex gap-1 items-center"
              >
                Date: {formatDateRange()}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={clearDateFilter}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            No tasks match your filters. Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`hover:shadow-md transition-all cursor-pointer group ${
                task.completed ? "opacity-80 bg-muted/30" : ""
              }`}
              onClick={() => handleViewTaskDetails(task)}
            >
              {/* Top priority indicator */}
              <div
                className={`h-1 w-full ${
                  task.completed
                    ? "bg-gray-300"
                    : getPriorityIndicatorColor(task.priority)
                }`}
              />

              <div className="flex flex-col h-[220px]">
                {" "}
                {/* Fixed height for consistent cards */}
                {/* Card Header */}
                <div className="px-4 pt-3 pb-2 flex justify-between items-start">
                  <div className="flex items-start gap-2 min-w-0 pr-2">
                    <Checkbox
                      checked={task.completed}
                      className="mt-1 flex-shrink-0"
                      onCheckedChange={(checked) => {
                        const newValue = checked === true;
                        const updatedTask = updateTaskCompleted(
                          task.id,
                          newValue
                        );
                        setTasks(
                          tasks.map((t) =>
                            t.id === task.id ? { ...t, completed: newValue } : t
                          )
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <h4
                        className={`font-medium text-sm leading-tight ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="text-xs mt-1 text-muted-foreground">
                        {getPriorityLabel(task.priority)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(
                            task.id,
                            e as unknown as React.MouseEvent
                          );
                        }}
                      >
                        {task.completed
                          ? "Mark as Incomplete"
                          : "Mark as Complete"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Task</DropdownMenuItem>
                      <DropdownMenuItem>Set Priority</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* Card Content */}
                <div className="px-4 py-2 flex-grow overflow-hidden">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {task.description || "No description provided"}
                  </p>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {task.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-1.5 py-0.5 rounded-sm bg-muted"
                        >
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{task.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* Separator Line */}
                <div className="h-px bg-border mx-4" />
                {/* Card Footer */}
                <div className="px-4 py-3 text-xs text-muted-foreground grid grid-cols-3 gap-2">
                  {/* Date/Time */}
                  <div className="col-span-2 flex items-center truncate pr-2">
                    {task.scheduled ? (
                      <>
                        <Clock className="h-3.5 w-3.5 flex-shrink-0 mr-1.5" />
                        <span className="truncate">
                          {formatDate(task.date?.toString() || "")}
                        </span>
                      </>
                    ) : (
                      <span className="italic">Not scheduled</span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="flex justify-end">
                    {task.category && (
                      <Badge variant="secondary" className="text-xs">
                        {task.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Details Sheet */}
      <TaskDetailsSheet
        task={selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onTaskComplete={(taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            const updatedTask = updateTaskCompleted(taskId, !task.completed);
            setTasks(
              tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              )
            );
          }
        }}
        onTaskScheduled={(taskId) => {
          setTasks(
            tasks.map((t) =>
              t.id === taskId ? { ...t, scheduled: !t.scheduled } : t
            )
          );
        }}
      />
    </div>
  );
};

export default GridView;
