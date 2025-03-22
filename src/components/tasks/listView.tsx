import React, { useState, useEffect } from "react";
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
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  sampleTasks,
  updateTaskCompleted,
  updateTaskScheduled,
} from "@/lib/taskService";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import { TaskFilterParams, TaskType } from "@/types/task";
import ListViewCard from "./listViewCard";
import TaskViewFilters, { DateRangeType } from "./TaskViewFilters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/api/tasks";

const ListView = () => {
  // Replace static tasks with API data
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "high", "medium", "low"

  // Pagination state
  const [todoPage, setTodoPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [unscheduledPage, setUnscheduledPage] = useState(1);
  const pageSize = 2; // Number of items per page

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

  const [tasksOpen, setTasksOpen] = useState({
    todo: true,
    completed: true,
  });

  // Create filter params for the API
  const filterParams: TaskFilterParams = {
    search: searchQuery,
    category: categoryFilter,
    scheduled: scheduledFilter,
    priority: priorityFilter,
    dateRange: dateRange,
    todoPage: todoPage,
    todoLimit: pageSize,
    completedPage: completedPage,
    completedLimit: pageSize,
    unscheduledPage: unscheduledPage,
    unscheduledLimit: pageSize,
  };

  // Track locally accumulated tasks
  const [localTasks, setLocalTasks] = useState<{
    todo: TaskType[];
    completed: TaskType[];
    unscheduled: TaskType[];
  }>({
    todo: [],
    completed: [],
    unscheduled: [],
  });

  // Use React Query to fetch tasks
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks", filterParams],
    queryFn: () => getTasks(filterParams),
    placeholderData: keepPreviousData, // Keep previous data while loading new data
  });

  // Update local tasks whenever data changes
  useEffect(() => {
    if (data) {
      if (todoPage === 1) {
        // Reset todo tasks when filters change or on first page
        setLocalTasks((prev) => ({ ...prev, todo: data.todo }));
      } else {
        // Append new todo tasks when loading more, avoiding duplicates
        const existingIds = new Set(localTasks.todo.map((task) => task.id));
        const newTasks = data.todo.filter((task) => !existingIds.has(task.id));
        setLocalTasks((prev) => ({
          ...prev,
          todo: [...prev.todo, ...newTasks],
        }));
      }

      if (completedPage === 1) {
        // Reset completed tasks when filters change or on first page
        setLocalTasks((prev) => ({ ...prev, completed: data.completed }));
      } else {
        // Append new completed tasks when loading more, avoiding duplicates
        const existingIds = new Set(
          localTasks.completed.map((task) => task.id)
        );
        const newTasks = data.completed.filter(
          (task) => !existingIds.has(task.id)
        );
        setLocalTasks((prev) => ({
          ...prev,
          completed: [...prev.completed, ...newTasks],
        }));
      }

      if (unscheduledPage === 1) {
        // Reset unscheduled tasks when filters change or on first page
        setLocalTasks((prev) => ({ ...prev, unscheduled: data.unscheduled }));
      } else {
        // Append new unscheduled tasks when loading more, avoiding duplicates
        const existingIds = new Set(
          localTasks.unscheduled.map((task) => task.id)
        );
        const newTasks = data.unscheduled.filter(
          (task) => !existingIds.has(task.id)
        );
        setLocalTasks((prev) => ({
          ...prev,
          unscheduled: [...prev.unscheduled, ...newTasks],
        }));
      }
    }
  }, [data, todoPage, completedPage, unscheduledPage]);

  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  // Helper to check if we should show the "Load More" button
  const hasMoreTodo = data?.todoTotal
    ? data.todoTotal > todoPage * pageSize
    : false;
  const hasMoreCompleted = data?.completedTotal
    ? data.completedTotal > completedPage * pageSize
    : false;
  const hasMoreUnscheduled = data?.unscheduledTotal
    ? data.unscheduledTotal > unscheduledPage * pageSize
    : false;

  // Handler for "Load More" buttons
  const handleLoadMoreTodo = () => setTodoPage((prev) => prev + 1);
  const handleLoadMoreCompleted = () => setCompletedPage((prev) => prev + 1);
  const handleLoadMoreUnscheduled = () =>
    setUnscheduledPage((prev) => prev + 1);

  // Reset pagination when filters change
  React.useEffect(() => {
    setTodoPage(1);
    setCompletedPage(1);
    setUnscheduledPage(1);
  }, [searchQuery, categoryFilter, scheduledFilter, priorityFilter, dateRange]);

  // Count tasks by status
  const todoTasksCount = data?.todoTotal || 0;
  const completedTasksCount = data?.completedTotal || 0;
  const unscheduledTasksCount = data?.unscheduledTotal || 0;

  // Get unique categories from tasks
  const categories = ["all"]; // We'll need to fetch categories from the server or add them dynamically

  const handleToggleComplete = async (taskId: string) => {
    try {
      const isCompleted =
        data?.todo.find((t) => t.id === taskId)?.completed ||
        data?.completed.find((t) => t.id === taskId)?.completed ||
        data?.unscheduled.find((t) => t.id === taskId)?.completed ||
        false;

      const updatedTask = await updateTaskCompleted(taskId, !isCompleted);
      // Refetch tasks to update the UI
      refetch();
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleToggleScheduled = async (taskId: string) => {
    try {
      const isScheduled =
        data?.todo.find((t) => t.id === taskId)?.scheduled ||
        data?.completed.find((t) => t.id === taskId)?.scheduled ||
        data?.unscheduled.find((t) => t.id === taskId)?.scheduled ||
        false;

      const updatedTask = await updateTaskScheduled(taskId, !isScheduled);
      // Refetch tasks to update the UI
      refetch();
    } catch (error) {
      console.error("Error updating task scheduling status:", error);
    }
  };

  const handleViewTaskDetails = (task: TaskType) => {
    setSelectedTask(task);
  };

  // Handle loading state
  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">
            Failed to load tasks. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Use the new TaskViewFilters component */}
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

      {/* Show loading indicator during subsequent data fetches */}
      {isLoading && data && (
        <div className="flex items-center justify-center py-4">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary mr-2" />
          <p className="text-sm text-muted-foreground">Updating tasks...</p>
        </div>
      )}

      {/* Unscheduled Tasks Section - Only show when filter is "all" or "unscheduled" */}
      {(scheduledFilter === "all" || scheduledFilter === "unscheduled") &&
        (unscheduledTasksCount > 0 || scheduledFilter === "unscheduled") && (
          <Collapsible defaultOpen>
            <div className="flex items-center justify-between border-b pb-2">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <h3 className="font-medium text-base">Unscheduled</h3>
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                  >
                    {unscheduledTasksCount}
                  </Badge>
                  <ChevronDown className="h-4 w-4 transition-transform" />
                </div>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="space-y-3 mt-3">
                {localTasks.unscheduled && localTasks.unscheduled.length > 0 ? (
                  <>
                    {localTasks.unscheduled.map((task) => (
                      <ListViewCard
                        task={task}
                        key={task.id}
                        handleToggleComplete={handleToggleComplete}
                        handleToggleScheduled={handleToggleScheduled}
                        handleViewTaskDetails={handleViewTaskDetails}
                      />
                    ))}
                    {hasMoreUnscheduled && (
                      <Button
                        onClick={handleLoadMoreUnscheduled}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>Load more unscheduled tasks</>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      No unscheduled tasks to do.
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

      {/* Todo Tasks Section - Only show when filter is "all" or "scheduled" */}
      {(scheduledFilter === "all" || scheduledFilter === "scheduled") && (
        <Collapsible
          open={tasksOpen.todo}
          onOpenChange={(open) => setTasksOpen({ ...tasksOpen, todo: open })}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <h3 className="font-medium text-base">To Do</h3>
                <Badge variant="secondary">{todoTasksCount}</Badge>
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
              {localTasks.todo && localTasks.todo.length > 0 ? (
                <>
                  {localTasks.todo.map((task) => (
                    <ListViewCard
                      task={task}
                      key={task.id}
                      handleToggleComplete={handleToggleComplete}
                      handleToggleScheduled={handleToggleScheduled}
                      handleViewTaskDetails={handleViewTaskDetails}
                    />
                  ))}
                  {hasMoreTodo && (
                    <Button
                      onClick={handleLoadMoreTodo}
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>Load more tasks</>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                  <p className="text-muted-foreground">
                    {scheduledFilter === "scheduled"
                      ? "No scheduled tasks to do. Schedule some tasks to get started!"
                      : "No tasks to do. Create a new task to get started!"}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

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
          {data?.completed && data.completed.length > 0 && (
            <Button variant="ghost" size="sm">
              Clear All
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="space-y-2 mt-3">
            {localTasks.completed && localTasks.completed.length > 0 ? (
              <>
                {localTasks.completed.map((task) => (
                  <ListViewCard
                    task={task}
                    key={task.id}
                    handleToggleComplete={handleToggleComplete}
                    handleToggleScheduled={handleToggleScheduled}
                    handleViewTaskDetails={handleViewTaskDetails}
                  />
                ))}
                {hasMoreCompleted && (
                  <Button
                    onClick={handleLoadMoreCompleted}
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>Load more completed tasks</>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                <p className="text-muted-foreground">No completed tasks yet.</p>
              </div>
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
