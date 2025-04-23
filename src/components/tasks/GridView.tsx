import React, { useState } from "react";
import { TaskType } from "@/types/task";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { updateTaskScheduled } from "@/lib/taskService";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import TaskViewFilters, { DateRangeType } from "./TaskViewFilters";
import { useLocale, useTranslations } from "next-intl";
import { ErrorState } from "../error_state";
import GridViewCard from "./gridViewCard";
import GridViewLoading from "./gridViewLoading";
import GridViewCardLoading from "./gridViewCardLoading";
import { useTasks, hasMoreTasks, getNextPage } from "@/lib/services/tasks";

const GridView = () => {
  const t = useTranslations("tasks.gridView");
  const locale = useLocale() as "fr" | "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all",

  // Pagination state
  const [pagination, setPagination] = useState({
    todoPage: 1,
    completedPage: 1,
    unscheduledPage: 1,
    inprogressPage: 1,
    pageSize: 6, // Number of items per page
  });

  const [dateRange, setDateRange] = useState<DateRangeType>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      type: "today",
      from: today,
      to: today,
    };
  });

  // Create filter params for the API
  const filterParams = {
    search: searchQuery,
    category: categoryFilter,
    scheduled: scheduledFilter,
    priority: priorityFilter,
    dateRange: dateRange,
  };

  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const [loadingStates, setLoadingStates] = useState({
    todo: false,
    completed: false,
    unscheduled: false,
    inprogress: false,
  });

  // Use our custom hook to get tasks
  const {
    todo: todoTasks,
    completed: completedTasks,
    unscheduled: unscheduledTasks,
    inprogress: inprogressTasks,
    todoTotal,
    completedTotal,
    unscheduledTotal,
    inprogressTotal,
    isLoading,
    isError,
    refetch,
  } = useTasks(filterParams, pagination, setPagination);

  // Helper to check if we should show the "Load More" button
  const hasMoreTodo = hasMoreTasks(
    todoTotal,
    pagination.todoPage,
    pagination.pageSize
  );
  const hasMoreCompleted = hasMoreTasks(
    completedTotal,
    pagination.completedPage,
    pagination.pageSize
  );
  const hasMoreUnscheduled = hasMoreTasks(
    unscheduledTotal,
    pagination.unscheduledPage,
    pagination.pageSize
  );
  const hasMoreInprogress = hasMoreTasks(
    inprogressTotal,
    pagination.inprogressPage,
    pagination.pageSize
  );

  // Modify load more handlers to update loading states
  const handleLoadMoreTodo = async () => {
    setLoadingStates((prev) => ({ ...prev, todo: true }));
    setPagination((prev) => ({
      ...prev,
      todoPage: getNextPage(prev.todoPage),
    }));
    await refetch();
    setLoadingStates((prev) => ({ ...prev, todo: false }));
  };

  const handleLoadMoreCompleted = async () => {
    setLoadingStates((prev) => ({ ...prev, completed: true }));
    setPagination((prev) => ({
      ...prev,
      completedPage: getNextPage(prev.completedPage),
    }));
    await refetch();
    setLoadingStates((prev) => ({ ...prev, completed: false }));
  };

  const handleLoadMoreUnscheduled = async () => {
    setLoadingStates((prev) => ({ ...prev, unscheduled: true }));
    setPagination((prev) => ({
      ...prev,
      unscheduledPage: getNextPage(prev.unscheduledPage),
    }));
    await refetch();
    setLoadingStates((prev) => ({ ...prev, unscheduled: false }));
  };

  const handleLoadMoreInprogress = async () => {
    setLoadingStates((prev) => ({ ...prev, inprogress: true }));
    setPagination((prev) => ({
      ...prev,
      inprogressPage: getNextPage(prev.inprogressPage),
    }));
    await refetch();
    setLoadingStates((prev) => ({ ...prev, inprogress: false }));
  };

  // Get unique categories from tasks
  const categories = ["all"]; // We'll need to fetch categories from the server or add them dynamically

  // Task action handlers
  const handleToggleComplete = async (taskId: string) => {
    try {
      const findTask = (id: string) => {
        return (
          todoTasks.find((t) => t.id === id) ||
          completedTasks.find((t) => t.id === id) ||
          unscheduledTasks.find((t) => t.id === id) ||
          inprogressTasks.find((t) => t.id === id) ||
          null
        );
      };

      // Logic for toggling completion status
      refetch();
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleToggleScheduled = async (taskId: string) => {
    try {
      const findTask = (id: string) => {
        return (
          todoTasks.find((t) => t.id === id) ||
          completedTasks.find((t) => t.id === id) ||
          unscheduledTasks.find((t) => t.id === id) ||
          inprogressTasks.find((t) => t.id === id) ||
          null
        );
      };

      const task = findTask(taskId);
      const isScheduled = task?.scheduled || false;

      // await updateTaskScheduled(taskId, !isScheduled);
      // Refetch tasks to update the UI
      refetch();
    } catch (error) {
      console.error("Error updating task scheduling status:", error);
    }
  };

  // Helper function for empty state UI
  const EmptyStateUI = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-dashed rounded-md">
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );

  // Handle initial loading state
  if (
    isLoading &&
    !todoTasks.length &&
    !completedTasks.length &&
    !unscheduledTasks.length &&
    !inprogressTasks.length
  ) {
    return <GridViewLoading />;
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
        refrshTasks={refetch}
      />

      {/* Show loading indicator during subsequent data fetches */}
      {isLoading &&
        (todoTasks.length > 0 ||
          completedTasks.length > 0 ||
          unscheduledTasks.length > 0 ||
          inprogressTasks.length > 0) && (
          <div className="flex items-center justify-center py-4">
            <LoaderCircle className="h-5 w-5 animate-spin text-primary mr-2" />
            <p className="text-sm text-muted-foreground">
              {t("updatingTasks")}
            </p>
          </div>
        )}

      {!unscheduledTasks.length &&
      !todoTasks.length &&
      !inprogressTasks.length &&
      !completedTasks.length ? (
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
              {unscheduledTasks && unscheduledTasks.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unscheduledTasks.map((task) => (
                      <GridViewCard
                        key={task.id}
                        task={task}
                        setSelectedTask={setSelectedTask}
                        handleToggleComplete={handleToggleComplete}
                        handleToggleScheduled={handleToggleScheduled}
                      />
                    ))}
                    {loadingStates.unscheduled && <GridViewCardLoading />}
                  </div>

                  {/* Load More for unscheduled tasks */}
                  {hasMoreUnscheduled && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={handleLoadMoreUnscheduled}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        disabled={loadingStates.unscheduled}
                      >
                        {loadingStates.unscheduled
                          ? t("loading")
                          : t("loadMore")}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyStateUI message={t("noUnscheduledTasks")} />
              )}
            </div>
          )}

       
          {(scheduledFilter === "all" || scheduledFilter === "scheduled") && (
            <div className="space-y-4">
              <h3 className="font-medium text-base border-b pb-2">
                {t("todoTasks")}
              </h3>
              {todoTasks &&
              todoTasks.filter((task) => !task.completed).length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todoTasks
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
                    {loadingStates.todo && <GridViewCardLoading />}
                  </div>

                  {/* Load More for todo tasks */}
                  {hasMoreTodo && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={handleLoadMoreTodo}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        disabled={loadingStates.todo}
                      >
                        {loadingStates.todo ? t("loading") : t("loadMore")}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyStateUI message={t("noTodoTasks")} />
              )}
            </div>
          )}

          {/* In Progress Tasks - Only show when filter is "all" or "scheduled" */}
          {(scheduledFilter === "all" || scheduledFilter === "scheduled") && (
            <div className="space-y-4">
              <h3 className="font-medium text-base border-b pb-2">
                {t("inprogressTasks")}
              </h3>
              {inprogressTasks && inprogressTasks.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inprogressTasks.map((task) => (
                      <GridViewCard
                        key={task.id}
                        task={task}
                        setSelectedTask={setSelectedTask}
                        handleToggleComplete={handleToggleComplete}
                        handleToggleScheduled={handleToggleScheduled}
                      />
                    ))}
                    {loadingStates.inprogress && <GridViewCardLoading />}
                  </div>

                  {/* Load More for in-progress tasks */}
                  {hasMoreInprogress && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={handleLoadMoreInprogress}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        disabled={loadingStates.inprogress}
                      >
                        {loadingStates.inprogress
                          ? t("loading")
                          : t("loadMore")}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyStateUI message={t("noInProgressTasks")} />
              )}
            </div>
          )}

          {/* Completed Tasks */}
          <div className="space-y-4">
            <h3 className="font-medium text-base border-b pb-2">
              {t("completedTasks")}
            </h3>
            {completedTasks &&
            completedTasks.filter((task) => task.completed).length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTasks
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
                  {loadingStates.completed && <GridViewCardLoading />}
                </div>

                {/* Load More for completed tasks */}
                {hasMoreCompleted && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={handleLoadMoreCompleted}
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      disabled={loadingStates.completed}
                    >
                      {loadingStates.completed ? t("loading") : t("loadMore")}
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
      {/* TODO: make the logic for taskcomplete and task scheduled */}
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
