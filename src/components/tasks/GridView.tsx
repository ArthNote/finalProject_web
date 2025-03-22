import React, { useState } from "react";
import { TaskType } from "@/types/task";
import { sampleTasks } from "@/lib/taskService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreHorizontal, Check, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import TaskViewFilters, { DateRangeType } from "./TaskViewFilters";

const GridView = () => {
  const [tasks, setTasks] = useState<TaskType[]>(sampleTasks);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "high", "medium", "low"

  // Initialize with today's date by default
  const [dateRange, setDateRange] = useState<DateRangeType>(() => {
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

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleToggleScheduled = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, scheduled: !task.scheduled } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
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
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;

    const matchesScheduledStatus =
      scheduledFilter === "all" ||
      (scheduledFilter === "scheduled" && task.scheduled) ||
      (scheduledFilter === "unscheduled" && !task.scheduled);

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    // If the task is unscheduled, don't apply the date filter
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  const hasCompletedTasks = filteredTasks.some((task) => task.completed);
  const hasActiveTasks = filteredTasks.some((task) => !task.completed);

  return (
    <div className="space-y-6">
      <TaskViewFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        scheduledFilter={scheduledFilter}
        setScheduledFilter={setScheduledFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        categories={categories}
      />

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/40 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-2">No tasks found</p>
          <p className="text-sm text-muted-foreground">
            Try changing your filters or creating a new task
          </p>
        </div>
      ) : (
        <>
          {/* Active Tasks */}
          {hasActiveTasks && (
            <div className="space-y-4">
              <h3 className="font-medium text-base border-b pb-2">
                Active Tasks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div
                        className={`h-1 w-full rounded-t-md ${getPriorityColor(
                          task.priority
                        )}`}
                      ></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {task.title}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-1 rounded-md hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleComplete(task.id);
                                }}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark as completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleScheduled(task.id);
                                }}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                {task.scheduled ? "Unschedule" : "Schedule"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {task.description || "No description provided"}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <Badge
                            variant="outline"
                            className="text-xs bg-secondary/30"
                          >
                            {task.category || "Uncategorized"}
                          </Badge>
                          {task.scheduled ? (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>
                                {formatDate(task.date?.toISOString() || "")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Not scheduled
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {hasCompletedTasks && (
            <div className="space-y-4">
              <h3 className="font-medium text-base border-b pb-2">
                Completed Tasks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTasks
                  .filter((task) => task.completed)
                  .map((task) => (
                    <Card
                      key={task.id}
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-shadow",
                        "opacity-75"
                      )}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div
                        className={`h-1 w-full rounded-t-md ${getPriorityColor(
                          task.priority
                        )}`}
                      ></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm line-clamp-1 line-through">
                            {task.title}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-1 rounded-md hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleComplete(task.id);
                                }}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark as incomplete
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 line-through">
                          {task.description || "No description provided"}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <Badge
                            variant="outline"
                            className="text-xs bg-secondary/30"
                          >
                            {task.category || "Uncategorized"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Completed
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </>
      )}

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

export default GridView;
