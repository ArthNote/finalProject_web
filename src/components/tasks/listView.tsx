import React, { useState } from "react";
import {
  Check,
  Clock,
  Calendar,
  MoreHorizontal,
  Star,
  AlertCircle,
  Tag,
  Plus,
  ChevronDown,
  Search,
  Filter,
  X,
  CalendarIcon,
  FlagIcon,
  ChevronRight,
  CalendarRange,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as UICalendar } from "@/components/ui/calendar";
import {
  sampleTasks,
  updateTaskCompleted,
  updateTaskScheduled,
} from "@/lib/taskService";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import { TaskType } from "@/types/task";

const ListView = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "high", "medium", "low"

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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState({
    todo: true,
    completed: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  // Count tasks by status
  const todoTasksCount = tasks.filter((task) => !task.completed).length;
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const unscheduledTasksCount = tasks.filter(
    (task) => !task.scheduled && !task.completed
  ).length;

  // Get unique categories from tasks
  const categories = ["all", ...new Set(tasks.map((task) => task.category))];

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
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;

    const matchesScheduledStatus =
      scheduledFilter === "all" ||
      (scheduledFilter === "scheduled" && task.scheduled) ||
      (scheduledFilter === "unscheduled" && !task.scheduled);

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    // Unscheduled tasks are always included regardless of date filter
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

  const todoTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

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

  const handleToggleComplete = (taskId: string) => {
    const updatedTask = updateTaskCompleted(
      taskId,
      !tasks.find((t) => t.id === taskId)?.completed
    );
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleToggleScheduled = (taskId: string) => {
    const updatedTask = updateTaskScheduled(
      taskId,
      !tasks.find((t) => t.id === taskId)?.scheduled
    );
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, scheduled: !task.scheduled } : task
      )
    );
  };

  const handleViewTaskDetails = (task: TaskType) => {
    setSelectedTask(task);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
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
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col gap-4">
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
                    <UICalendar
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
                <div
                  className={`h-2 w-2 rounded-full mr-1 ${getPriorityColor(
                    priorityFilter
                  )}`}
                />
                {priorityFilter}
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

      {/* Unscheduled Tasks Section - Always shown regardless of date filter */}
      {unscheduledTasksCount > 0 && scheduledFilter !== "scheduled" && (
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between border-b pb-2">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <h3 className="font-medium text-base">Unscheduled</h3>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                >
                  {todoTasks.filter((task) => !task.scheduled).length}
                </Badge>
                <ChevronDown className="h-4 w-4 transition-transform" />
              </div>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="space-y-3 mt-3">
              {todoTasks
                .filter((task) => !task.scheduled)
                .map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start gap-3 p-3 sm:p-4 border rounded-lg hover:shadow-sm transition-all bg-card overflow-hidden cursor-pointer"
                    onClick={() => handleViewTaskDetails(task)}
                  >
                    {/* Priority indicator */}
                    <div className="mt-1.5 flex flex-col items-center gap-2 shrink-0">
                      <div
                        className={`h-3 w-3 rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      />
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                      />
                    </div>

                    {/* Task details */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <h4 className="font-medium text-base truncate max-w-full">
                            {task.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="bg-secondary/50 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap self-start sm:self-auto w-fit sm:hidden"
                          >
                            {task.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-secondary/50 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap hidden sm:flex"
                          >
                            {task.category}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 opacity-70 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleScheduled(task.id)}
                              >
                                Schedule Task
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>Set Priority</DropdownMenuItem>
                              <DropdownMenuItem>
                                Add to Calendar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Description - hidden on mobile */}
                      <p className="text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 break-words hidden sm:block">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {/* Schedule button - hidden on mobile */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2 hidden sm:flex"
                          onClick={() => handleToggleScheduled(task.id)}
                        >
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          Schedule
                        </Button>

                        {/* Tags - hidden on mobile */}
                        {(task.tags?.length ?? 0) > 0 && (
                          <div className="hidden sm:flex items-center gap-1 max-w-full overflow-hidden">
                            <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                            <div className="flex flex-wrap gap-1 overflow-hidden">
                              {(task.tags ?? []).slice(0, 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-1.5 py-0.5 bg-muted rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(task.tags?.length ?? 0) > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{(task.tags?.length ?? 0) - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Todo Tasks Section */}
      <Collapsible
        open={tasksOpen.todo}
        onOpenChange={(open) => setTasksOpen({ ...tasksOpen, todo: open })}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <h3 className="font-medium text-base">To Do</h3>
              <Badge variant="secondary">
                {scheduledFilter === "unscheduled"
                  ? 0
                  : todoTasks.filter((t) => t.scheduled).length}
              </Badge>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  tasksOpen.todo ? "rotate-0" : "-rotate-90"
                }`}
              />
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="space-y-3 mt-3">
            {todoTasks.filter(
              (task) => scheduledFilter !== "unscheduled" && task.scheduled
            ).length === 0 ? (
              <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                <p className="text-muted-foreground">
                  {scheduledFilter === "scheduled"
                    ? "No scheduled tasks to do. Schedule some tasks to get started!"
                    : "No tasks to do. Create a new task to get started!"}
                </p>
              </div>
            ) : (
              todoTasks
                .filter(
                  (task) => scheduledFilter !== "unscheduled" && task.scheduled
                )
                .map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start gap-3 p-3 sm:p-4 border rounded-lg hover:shadow-sm transition-all bg-card overflow-hidden cursor-pointer"
                    onClick={() => handleViewTaskDetails(task)}
                  >
                    {/* Priority indicator */}
                    <div className="mt-1.5 flex flex-col items-center gap-2 shrink-0">
                      <div
                        className={`h-3 w-3 rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      />
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                      />
                    </div>

                    {/* Task details */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <h4 className="font-medium text-base truncate max-w-full">
                            {task.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="bg-secondary/50 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap self-start sm:self-auto w-fit sm:hidden"
                          >
                            {task.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-secondary/50 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap hidden sm:flex"
                          >
                            {task.category}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 opacity-70 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleScheduled(task.id)}
                              >
                                Unschedule Task
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>Set Priority</DropdownMenuItem>
                              <DropdownMenuItem>
                                Add to Calendar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Description - hidden on mobile */}
                      <p className="text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 break-words hidden sm:block">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3.5 w-3.5 shrink-0" />
                          <span className="truncate max-w-[150px] sm:max-w-none">
                            {task.date ? formatDate(task.date.toISOString()) : "Not scheduled"}
                          </span>
                        </div>

                        {/* Tags - hidden on mobile */}
                        {(task.tags?.length ?? 0) > 0 && (
                          <div className="hidden sm:flex items-center gap-1 max-w-full overflow-hidden">
                            <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                            <div className="flex flex-wrap gap-1 overflow-hidden">
                              {(task.tags ?? []).slice(0, 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-1.5 py-0.5 bg-muted rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(task.tags?.length ?? 0) > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{(task.tags?.length ?? 0) - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Completed Tasks Section */}
      <Collapsible
        open={tasksOpen.completed}
        onOpenChange={(open) => setTasksOpen({ ...tasksOpen, completed: open })}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <h3 className="font-medium text-base">Completed</h3>
              <Badge variant="secondary">{completedTasksCount}</Badge>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  tasksOpen.completed ? "rotate-0" : "-rotate-90"
                }`}
              />
            </div>
          </CollapsibleTrigger>
          {completedTasks.length > 0 && (
            <Button variant="ghost" size="sm">
              Clear All
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="space-y-2 mt-3">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                <p className="text-muted-foreground">No completed tasks yet.</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start gap-3 p-3 border rounded-lg bg-muted/50 overflow-hidden"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task.id)}
                    className="shrink-0 mt-0.5"
                  />

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
                      <h4 className="font-medium text-sm text-muted-foreground line-through truncate max-w-full">
                        {task.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-secondary/30 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap w-fit opacity-50"
                      >
                        {task.category}
                      </Badge>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground/70 truncate">
                      <Clock className="mr-1 h-3 w-3 shrink-0" />
                      <span className="truncate">Completed</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Task Details Sheet */}
      <TaskDetailsSheet
        task={selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onTaskComplete={handleToggleComplete}
        onTaskScheduled={handleToggleScheduled}
      />
    </div>
  );
};

export default ListView;
