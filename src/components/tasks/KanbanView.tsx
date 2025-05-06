import React, { useState, useEffect } from "react";
import { Plus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import { TaskFilterParams, TaskType } from "@/types/task";
import TaskViewFilters, { DateRangeType } from "./TaskViewFilters";
// Remove direct import of keepPreviousData and useQuery
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// Remove direct import of getTasks
// import { getTasks } from "@/lib/api/tasks";
import { useLocale, useTranslations } from "next-intl";
import { ErrorState } from "../error_state";
import KanbanColumn from "./kanban/KanbanColumn";
import { Column } from "./kanban/types";
// Import useTasks and related functions from tasks service
import { useTasks, hasMoreTasks, getNextPage } from "@/lib/services/tasks";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import {
  updateTaskCompleteStatus,
  updateTaskKanban,
  updateTaskStatus,
} from "@/lib/api/tasks";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleTasks } from "@/lib/api/schedule";

const KanbanView = () => {
  const t = useTranslations("tasks.kanbanView");
  const locale = useLocale() as "fr" | "en";

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all");
  const [columnFilter, setColumnFilter] = useState("all");
  const [schedulingTaskId, setSchedulingTaskId] = useState<string | null>(null);

  // Replace pagination state variables with a single object to match ListView structure
  const [pagination, setPagination] = useState({
    todoPage: 1,
    completedPage: 1,
    unscheduledPage: 1,
    inprogressPage: 1,
    pageSize: 6, // Number of items per page
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

  // State for columns
  const [columns, setColumns] = useState<Column[]>([
    { id: "unscheduled", title: t("unscheduled"), color: "bg-purple-500" },
    { id: "todo", title: t("todo"), color: "bg-blue-500" },
    { id: "inprogress", title: t("inprogress"), color: "bg-amber-500" },
    { id: "completed", title: t("completed"), color: "bg-green-500" },
  ]);

  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState<Partial<TaskType>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [columnFormData, setColumnFormData] = useState({ title: "", id: "" });
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

  // Create filter params for the API
  const filterParams = {
    search: searchQuery,
    category: categoryFilter,
    scheduled: scheduledFilter,
    priority: priorityFilter,
    dateRange: dateRange,
  };

  // Replace direct data fetching with useTasks hook
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

  // Update handler for "Load More" buttons
  const handleLoadMoreTodo = () =>
    setPagination((prev) => ({
      ...prev,
      todoPage: getNextPage(prev.todoPage),
    }));
  const handleLoadMoreCompleted = () =>
    setPagination((prev) => ({
      ...prev,
      completedPage: getNextPage(prev.completedPage),
    }));
  const handleLoadMoreUnscheduled = () =>
    setPagination((prev) => ({
      ...prev,
      unscheduledPage: getNextPage(prev.unscheduledPage),
    }));
  const handleLoadMoreInprogress = () =>
    setPagination((prev) => ({
      ...prev,
      inprogressPage: getNextPage(prev.inprogressPage),
    }));

  // Setup drag and drop

  const categories = ["all"];

  const generateId = () =>
    `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Handle creating/editing a task
  const handleSaveTask = () => {
    if (!taskFormData.title?.trim()) return;

    if (editingTask) {
      // Update existing task - in a real app, this would call an API
      // Refresh data after update
      refetch();
    } else {
      // Create new task logic - would call an API in real implementation
      // For now we'll just refresh to get the latest data
      refetch();
    }

    setTaskFormData({});
    setEditingTask(null);
    setIsTaskFormOpen(false);
  };

  // Handle column operations
  const handleSaveColumn = () => {
    const title = columnFormData.title?.trim();
    if (!title) return;

    if (editingColumn) {
      setColumns(
        columns.map((column) =>
          column.id === editingColumn ? { ...column, title } : column
        )
      );
    } else {
      const newColumnId =
        columnFormData.id?.trim() ||
        columnFormData.title?.toLowerCase().replace(/\s+/g, "_") ||
        `column-${generateId()}`;
      const newColumn: Column = { id: newColumnId, title };
      setColumns([...columns, newColumn]);
    }

    setColumnFormData({ title: "", id: "" });
    setEditingColumn(null);
    setIsColumnFormOpen(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    const firstColumnId = columns[0]?.id;
    if (firstColumnId && firstColumnId !== columnId) {
      // This would need an API call to update task statuses in a real implementation
      // For now, just update the columns
      setColumns(columns.filter((column) => column.id !== columnId));
    }
  };

  const handleAddTask = (columnId: string) => {
    setTaskFormData({ status: columnId });
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: TaskType) => {
    setTaskFormData(task);
    setEditingTask(task.id);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    // This would call an API to delete the task
    // For now, just refresh the data
    refetch();
  };

  const { mutate: updateCompleteStatus } = useMutation({
    mutationFn: updateTaskCompleteStatus,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
      ]);
      toast({
        title:
          locale === "en"
            ? "Task status updated"
            : "Statut de la tâche mis à jour",
        description:
          locale === "en"
            ? "The task status has been updated successfully."
            : "Le statut de la tâche a été mis à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title:
          locale === "en"
            ? "Error updating task status"
            : "Erreur de mise à jour du statut de la tâche",
        description:
          locale === "en"
            ? "There was an error updating the task status."
            : "Il y a eu une erreur lors de la mise à jour du statut de la tâche.",
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

      // await updateTaskScheduled(taskId, !isScheduled);
      // Refetch tasks to update the UI
      refetch();
    } catch (error) {
      console.error("Error updating task scheduling status:", error);
    }
  };

  const handleToggleSchedule = async (taskId: string) => {
    try {
      setSchedulingTaskId(taskId); // Set loading state
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
      if (!task) {
        toast({
          title: locale === "en" ? "Task not found" : "Tâche introuvable",
          description:
            locale === "en"
              ? "The task was not found."
              : "La tâche n'a pas été trouvée.",
          variant: "destructive",
        });
        return;
      }

      // If already scheduled, don't do anything -
      // you'd need another API call to unschedule a specific task
      if (task.scheduled) {
        return;
      }

      // Create a scheduling request for just this one task
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const thirtyDaysFromToday = new Date(today);
      thirtyDaysFromToday.setDate(today.getDate() + 30);

      await scheduleTasks({
        taskSelectionMode: "full", // Only schedule unscheduled tasks
        timePeriodType: "custom",
        customRangeStart: today,
        customRangeEnd: thirtyDaysFromToday,
        respectFixedAppointments: true,
        addBreaksEnabled: true,
        optimizeFocusTimeEnabled: true,
        includePastTasks: false,
      });

      toast({
        title:
          locale === "en" ? "Schedule Success" : "Succès de la planification",
        description:
          locale === "en"
            ? "The task has been scheduled successfully."
            : "La tâche a été planifiée avec succès.",
      });

      // Refetch tasks to update the UI
      refetch();
      setSchedulingTaskId(null);
    } catch (error) {
      console.error("Error updating task scheduling status:", error);
      setSchedulingTaskId(null);
      toast({
        title:
          locale === "en"
            ? "Error updating task scheduling status"
            : "Erreur de mise à jour du statut de la planification de la tâche",
        description:
          locale === "en"
            ? "There was an error updating the task scheduling status."
            : "Il y a eu une erreur lors de la mise à jour du statut de la planification de la tâche.",
        variant: "destructive",
      });
    }
  };

  const handleTaskMove = (taskId: string, columnId: string) => {
    // In a real app, this would call an API to update the task column
    // For now, just refetch the data
    refetch();
  };

  const queryClient = useQueryClient();

  const { mutate: updateMove } = useMutation({
    mutationFn: updateTaskKanban,
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
        title: t("toast.taskMoved.title"),
        description: t("toast.taskMoved.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toast.moveError.title"),
        description: t("toast.moveError.description"),
        variant: "destructive",
      });
    },
  });

  const getTasksForColumn = (columnId: string) => {
    // Map our API task lists to the appropriate columns
    if (columnId === "todo") {
      return todoTasks.filter((t) => !t.completed);
    } else if (columnId === "completed") {
      return completedTasks;
    } else if (columnId === "unscheduled") {
      return unscheduledTasks;
    } else if (columnId === "inprogress") {
      return inprogressTasks;
    }
    return [];
  };

  if (
    isLoading &&
    !todoTasks.length &&
    !completedTasks.length &&
    !unscheduledTasks.length &&
    !inprogressTasks.length
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return ErrorState({
      title: t("errorState.title"),
      description: t("errorState.description"),
      retryAction: () => refetch(),
      action: t("errorState.retry"),
    });
  }

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Return if dropped outside a droppable area
    if (!destination) return;

    try {
      // Get the task that was dragged
      const allTasks = [
        ...todoTasks,
        ...completedTasks,
        ...unscheduledTasks,
        ...inprogressTasks,
      ];
      const draggedTask = allTasks.find((task) => task.id === draggableId);

      if (!draggedTask) return;

      // Prevent moving unscheduled tasks to other columns
      if (!draggedTask.scheduled && destination.droppableId !== "unscheduled") {
        toast({
          title: t("toast.unscheduledTask.title"),
          description: t("toast.unscheduledTask.description"),
          variant: "destructive",
        });
        return;
      }

      // Update task status and order with source and destination indices
      updateMove({
        id: draggableId,
        status: destination.droppableId,
        // order: destination.index,
        // sourceIndex: source.index,
        destinationIndex: destination.index,
      });

      // Show success toast

      // Refetch to ensure data consistency
      await refetch();
    } catch (error) {
      console.error("Error moving task:", error);
      toast({
        title: t("toast.moveError.title"),
        description: t("toast.moveError.description"),
        variant: "destructive",
      });
      await refetch();
    }
  };

  // Add this helper function
  const reorderRestOfTasks = async (tasks: TaskType[], startOrder: number) => {
    // Update the order of all subsequent tasks
    const updatePromises = tasks.map((task, index) => {
      const newOrder = startOrder + index;
      return updateTaskKanban({
        id: task.id,
        status: task.status || "todo",
      });
    });

    await Promise.all(updatePromises);
  };

  // Add this helper function to calculate the new order
  const calculateNewOrder = (
    tasks: TaskType[],
    startIndex: number,
    endIndex: number
  ): number => {
    // If moving to start of list
    if (endIndex === 0) {
      return tasks[0]?.order ? tasks[0].order - 1000 : 1000;
    }

    // If moving to end of list
    if (endIndex >= tasks.length - 1) {
      return (tasks[tasks.length - 1]?.order ?? 0) + 1000;
    }

    // Moving between two tasks
    const prevTask = tasks[endIndex - 1];
    const nextTask = tasks[endIndex];
    return ((prevTask?.order ?? 0) + (nextTask?.order ?? 0)) / 2;
  };

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
      !completedTasks.length &&
      !inprogressTasks.length ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/40 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-2">{t("emptyState.title")}</p>
          <p className="text-sm text-muted-foreground">
            {t("emptyState.description")}
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
            {columns.map((column) => {
              const tasks = getTasksForColumn(column.id);
              const hasMore =
                column.id === "todo"
                  ? hasMoreTodo
                  : column.id === "completed"
                  ? hasMoreCompleted
                  : column.id === "unscheduled"
                  ? hasMoreUnscheduled
                  : column.id === "inprogress"
                  ? hasMoreInprogress
                  : false;

              const handleLoadMore =
                column.id === "todo"
                  ? handleLoadMoreTodo
                  : column.id === "completed"
                  ? handleLoadMoreCompleted
                  : column.id === "unscheduled"
                  ? handleLoadMoreUnscheduled
                  : column.id === "inprogress"
                  ? handleLoadMoreInprogress
                  : () => {};

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  columns={columns}
                  isLoading={isLoading}
                  hasMore={hasMore}
                  onLoadMore={handleLoadMore}
                  onFilterByColumn={setColumnFilter}
                  onAddTask={handleAddTask}
                  onDeleteColumn={handleDeleteColumn}
                  onTaskClick={setSelectedTask}
                  onEditTask={handleEditTask}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  handleTaskMove={handleTaskMove}
                  handleToggleSchedule={handleToggleSchedule}
                  schedulingTaskId={schedulingTaskId as string | undefined}
                />
              );
            })}
          </div>
        </DragDropContext>
      )}

      <TaskDetailsSheet
        task={selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onTaskComplete={handleToggleComplete}
        onTaskScheduled={handleToggleScheduled}
      />

      <style jsx global>{`
        .dragging-task * {
          cursor: grabbing !important;
        }

        .cursor-grab {
          cursor: grab;
        }

        .cursor-grab:active {
          cursor: grabbing;
        }

        /* Smooth transitions for task cards */
        .card {
          transition: all 0.2s ease-in-out;
        }

        /* Scale effect when dragging */
        .card:active {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default KanbanView;
