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
import { updateTaskScheduled } from "@/lib/taskService";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import { TaskFilterParams, TaskType } from "@/types/task";
import ListViewCard from "./listViewCard";
import TaskViewFilters, { DateRangeType } from "./TaskViewFilters";
import { useLocale, useTranslations } from "next-intl";
import { ErrorState } from "../error_state";
import { useTasks, hasMoreTasks, getNextPage } from "@/lib/services/tasks";
import { updateTaskCompleteStatus } from "@/lib/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import ListViewLoading from "./listViewLoading";
import ListViewCardLoading from "./listViewCardLoading";

const ListView = () => {
  const t = useTranslations("tasks.listView");
  const locale = useLocale() as "fr" | "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "high", "medium", "low"

  const queryClient = useQueryClient();

  // Pagination state
  const [pagination, setPagination] = useState({
    todoPage: 1,
    completedPage: 1,
    unscheduledPage: 1,
    inprogressPage: 1,
    pageSize: 4, // Number of items per page
  });

  // Add states to track loading state for each section
  const [loadingStates, setLoadingStates] = useState({
    todo: false,
    completed: false,
    unscheduled: false,
    inprogress: false,
  });

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
    inprogress: true,
  });

  // Create filter params for the API
  const filterParams = {
    search: searchQuery,
    category: categoryFilter,
    scheduled: scheduledFilter,
    priority: priorityFilter,
    dateRange: dateRange,
  };

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

  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

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

  // Modify load more handlers to update loading states correctly
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

  const { mutate: updateCompleteStatus } = useMutation({
    mutationFn: updateTaskCompleteStatus,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
      ]);
      toast({
        title: t("card.toast.statusSuccess.title"),
        description: t("card.toast.statusSuccess.description"),
      });
    },
    onError: () => {
      toast({
        title: t("card.toast.statusError.title"),
        description: t("card.toast.statusError.description"),
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = async (taskId: string) => {
    try {
      updateCompleteStatus(taskId);
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

  // Get unique categories from tasks
  const categories = ["all"]; // We'll need to fetch categories from the server or add them dynamically

  // Handle loading state
  if (
    isLoading &&
    !todoTasks.length &&
    !completedTasks.length &&
    !unscheduledTasks.length &&
    !inprogressTasks.length
  ) {
    return <ListViewLoading />;
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
          {/* Unscheduled Tasks Section - Only show when filter is "all" or "unscheduled" */}
          {(scheduledFilter === "all" || scheduledFilter === "unscheduled") &&
            (unscheduledTotal > 0 || scheduledFilter === "unscheduled") && (
              <Collapsible defaultOpen>
                <div className="flex items-center justify-between border-b pb-2">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <h3 className="font-medium text-base">
                        {t("unscheduled")}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      >
                        {unscheduledTotal}
                      </Badge>
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    </div>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="space-y-3 mt-3">
                    {unscheduledTasks && unscheduledTasks.length > 0 ? (
                      <>
                        {unscheduledTasks.map((task) => (
                          <ListViewCard
                            task={task}
                            key={task.id}
                            handleToggleComplete={handleToggleComplete}
                            handleToggleScheduled={handleToggleScheduled}
                            handleViewTaskDetails={handleViewTaskDetails}
                          />
                        ))}
                        {hasMoreUnscheduled && (
                          <>
                            {loadingStates.unscheduled && (
                              <ListViewCardLoading />
                            )}
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
                          </>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                        <p className="text-muted-foreground">
                          {t("noUnscheduledTasks")}
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
              onOpenChange={(open) =>
                setTasksOpen({ ...tasksOpen, todo: open })
              }
            >
              <div className="flex items-center justify-between border-b pb-2">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <h3 className="font-medium text-base">{t("todo")}</h3>
                    <Badge variant="secondary">{todoTotal}</Badge>
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
                  {todoTasks && todoTasks.length > 0 ? (
                    <>
                      {todoTasks.map((task) => (
                        <ListViewCard
                          task={task}
                          key={task.id}
                          handleToggleComplete={handleToggleComplete}
                          handleToggleScheduled={handleToggleScheduled}
                          handleViewTaskDetails={handleViewTaskDetails}
                        />
                      ))}
                      {hasMoreTodo && (
                        <>
                          {loadingStates.todo && <ListViewCardLoading />}
                          <Button
                            onClick={handleLoadMoreTodo}
                            variant="ghost"
                            className="w-full text-muted-foreground"
                            disabled={loadingStates.todo}
                          >
                            {loadingStates.todo ? t("loading") : t("loadMore")}
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                      <p className="text-muted-foreground">
                        {scheduledFilter === "scheduled"
                          ? t("noScheduledTasksToDo")
                          : t("noTasksToDo")}
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* In Progress Tasks Section */}
          {(scheduledFilter === "all" || scheduledFilter === "scheduled") && (
            <Collapsible
              open={tasksOpen.inprogress}
              onOpenChange={(open) =>
                setTasksOpen({ ...tasksOpen, inprogress: open })
              }
            >
              <div className="flex items-center justify-between border-b pb-2">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <h3 className="font-medium text-base">{t("inprogress")}</h3>
                    <Badge variant="secondary">{inprogressTotal}</Badge>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        tasksOpen.inprogress ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <div className="space-y-3 mt-3">
                  {inprogressTasks && inprogressTasks.length > 0 ? (
                    <>
                      {inprogressTasks.map((task) => (
                        <ListViewCard
                          task={task}
                          key={task.id}
                          handleToggleComplete={handleToggleComplete}
                          handleToggleScheduled={handleToggleScheduled}
                          handleViewTaskDetails={handleViewTaskDetails}
                        />
                      ))}
                      {hasMoreInprogress && (
                        <>
                          {loadingStates.inprogress && <ListViewCardLoading />}
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
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                      <p className="text-muted-foreground">
                        {t("noInProgressTasks")}
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
            onOpenChange={(open) =>
              setTasksOpen({ ...tasksOpen, completed: open })
            }
          >
            <div className="flex items-center justify-between border-b pb-2">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <h3 className="font-medium text-base">{t("completed")}</h3>
                  <Badge variant="secondary">{completedTotal}</Badge>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      tasksOpen.completed ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </div>
              </CollapsibleTrigger>
              {completedTasks && completedTasks.length > 0 && (
                <Button variant="ghost" size="sm">
                  {t("clearALL")}
                </Button>
              )}
            </div>

            <CollapsibleContent>
              <div className="space-y-2 mt-3">
                {completedTasks && completedTasks.length > 0 ? (
                  <>
                    {completedTasks.map((task) => (
                      <ListViewCard
                        task={task}
                        key={task.id}
                        handleToggleComplete={handleToggleComplete}
                        handleToggleScheduled={handleToggleScheduled}
                        handleViewTaskDetails={handleViewTaskDetails}
                      />
                    ))}
                    {hasMoreCompleted && (
                      <>
                        {loadingStates.completed && <ListViewCardLoading />}
                        <Button
                          onClick={handleLoadMoreCompleted}
                          variant="ghost"
                          className="w-full text-muted-foreground"
                          disabled={loadingStates.completed}
                        >
                          {loadingStates.completed
                            ? t("loading")
                            : t("loadMore")}
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      {t("noCompletedTasks")}
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
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

export default ListView;
