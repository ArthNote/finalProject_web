import React, { useState, useEffect } from "react";
import { TaskFilterParams, TaskType } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MoreHorizontal,
  Check,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { getTasks } from "@/lib/api/tasks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { updateTaskCompleted, updateTaskScheduled } from "@/lib/taskService";
import GridViewCard from "./gridViewCard";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { ErrorState } from "../error_state";

const GridView = () => {
  const t = useTranslations("tasks.gridView");
  const locale = useLocale() as "fr" | "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all",

  const [todoPage, setTodoPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [unscheduledPage, setUnscheduledPage] = useState(1);
  const pageSize = 6; // Number of items per page

  const [dateRange, setDateRange] = useState<DateRangeType>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      type: "today",
      from: today,
      to: today,
    };
  });

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

  const [localTasks, setLocalTasks] = useState<{
    todo: TaskType[];
    completed: TaskType[];
    unscheduled: TaskType[];
  }>({
    todo: [],
    completed: [],
    unscheduled: [],
  });

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

  // Get unique categories from tasks
  const categories = ["all"]; // We'll need to fetch categories from the server or add them dynamically

  // Task action handlers - copied from ListView
  const handleToggleComplete = async (taskId: string) => {
    try {
      const isCompleted =
        data?.todo.find((t) => t.id === taskId)?.completed ||
        data?.completed.find((t) => t.id === taskId)?.completed ||
        data?.unscheduled.find((t) => t.id === taskId)?.completed ||
        false;

      await updateTaskCompleted(taskId, !isCompleted);
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

      await updateTaskScheduled(taskId, !isScheduled);
      // Refetch tasks to update the UI
      refetch();
    } catch (error) {
      console.error("Error updating task scheduling status:", error);
    }
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

  // Helper function for empty state UI
  const EmptyStateUI = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-dashed rounded-md">
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );

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
    return ErrorState({
      title: t("errorState.title"),
      description: t("errorState.description"),
      retryAction: () => refetch(),
      action: t("errorState.retry"),
    });
  }

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

      {/* Show loading indicator during subsequent data fetches */}
      {isLoading && data && (
        <div className="flex items-center justify-center py-4">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary mr-2" />
          <p className="text-sm text-muted-foreground">{t("updatingTasks")}</p>
        </div>
      )}

      {!localTasks.unscheduled.length &&
      !localTasks.todo.length &&
      !localTasks.completed.length ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/40 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-2">{t("emptyState.title")}</p>
          <p className="text-sm text-muted-foreground">
            {t("emptyState.description")}
          </p>
        </div>
      ) : (
        <>
          {/* Unscheduled Tasks */}
          {(scheduledFilter === "all" || scheduledFilter === "unscheduled") && (
            <div className="space-y-4">
              <h3 className="font-medium text-base border-b pb-2">
                {t("unscheduledTasks")}
              </h3>
              {localTasks.unscheduled && localTasks.unscheduled.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {localTasks.unscheduled.map((task) => (
                      <GridViewCard
                        key={task.id}
                        task={task}
                        setSelectedTask={setSelectedTask}
                        handleToggleComplete={handleToggleComplete}
                        handleToggleScheduled={handleToggleScheduled}
                      />
                    ))}
                  </div>

                  {/* Load More for unscheduled tasks */}
                  {hasMoreUnscheduled && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={handleLoadMoreUnscheduled}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            {t("loading")}
                          </>
                        ) : (
                          t("loadMore")
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyStateUI message={t("noUnscheduledTasks")} />
              )}
            </div>
          )}

          {/* Active Todo Tasks */}
          {(scheduledFilter === "all" || scheduledFilter === "scheduled") && (
            <div className="space-y-4">
              <h3 className="font-medium text-base border-b pb-2">
                {t("activeTasks")}
              </h3>
              {localTasks.todo &&
              localTasks.todo.filter((task) => !task.completed).length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {localTasks.todo
                      .filter((task) => !task.completed)
                      .map((task) => (
                        <GridViewCard
                          key={task.id}
                          task={task}
                          setSelectedTask={setSelectedTask}
                          handleToggleComplete={handleToggleComplete}
                          handleToggleScheduled={handleToggleScheduled}
                        />
                      ))}
                  </div>

                  {/* Load More for todo tasks */}
                  {hasMoreTodo && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={handleLoadMoreTodo}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            {t("loading")}
                          </>
                        ) : (
                          t("loadMore")
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyStateUI message={t("noActiveTasks")} />
              )}
            </div>
          )}

          {/* Completed Tasks */}
          <div className="space-y-4">
            <h3 className="font-medium text-base border-b pb-2">
              {t("completedTasks")}
            </h3>
            {localTasks.completed &&
            localTasks.completed.filter((task) => task.completed).length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localTasks.completed
                    .filter((task) => task.completed)
                    .map((task) => (
                      <GridViewCard
                        key={task.id}
                        task={task}
                        setSelectedTask={setSelectedTask}
                        handleToggleComplete={handleToggleComplete}
                        handleToggleScheduled={handleToggleScheduled}
                      />
                    ))}
                </div>

                {/* Load More for completed tasks */}
                {hasMoreCompleted && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={handleLoadMoreCompleted}
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          {t("loading")}
                        </>
                      ) : (
                        t("loadMore")
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyStateUI message={t("noCompletedTasks")} />
            )}
          </div>
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
