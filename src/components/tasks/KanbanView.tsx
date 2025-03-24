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
import { updateTaskScheduled } from "@/lib/taskService";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import { TaskFilterParams, TaskType } from "@/types/task";
import TaskViewFilters, { DateRangeType } from "./TaskViewFilters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/api/tasks";
import { useLocale, useTranslations } from "next-intl";
import { ErrorState } from "../error_state";
import KanbanColumn from "./kanban/KanbanColumn";
import { Column } from "./kanban/types";
import { useDragAndDrop } from "./kanban/useDragAndDrop";

const KanbanView = () => {
  const t = useTranslations("tasks.kanbanView");
  const locale = useLocale() as "fr" | "en";

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all");
  const [columnFilter, setColumnFilter] = useState("all");

  // Pagination state
  const [todoPage, setTodoPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [unscheduledPage, setUnscheduledPage] = useState(1);
  const [inprogressPage, setInprogressPage] = useState(1);
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

  // State for columns
  const [columns, setColumns] = useState<Column[]>([
    { id: "unscheduled", title: t("unscheduled"), color: "bg-purple-500" },
    { id: "todo", title: t("todo"), color: "bg-blue-500" },
    { id: "inprogress", title: t("inprogress"), color: "bg-amber-500" },
    { id: "completed", title: t("completed"), color: "bg-green-500" },
  ]);

  // Track locally accumulated tasks
  const [localTasks, setLocalTasks] = useState<{
    todo: TaskType[];
    completed: TaskType[];
    unscheduled: TaskType[];
    inprogress: TaskType[];
  }>({
    todo: [],
    completed: [],
    unscheduled: [],
    inprogress: [],
  });

  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState<Partial<TaskType>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [columnFormData, setColumnFormData] = useState({ title: "", id: "" });
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

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
    inprogressPage: inprogressPage,
    inprogressLimit: pageSize,
  };

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
        setLocalTasks((prev) => ({ ...prev, todo: data.todo }));
      } else {
        const existingIds = new Set(localTasks.todo.map((task) => task.id));
        const newTasks = data.todo.filter((task) => !existingIds.has(task.id));
        setLocalTasks((prev) => ({
          ...prev,
          todo: [...prev.todo, ...newTasks],
        }));
      }

      if (completedPage === 1) {
        setLocalTasks((prev) => ({ ...prev, completed: data.completed }));
      } else {
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
        setLocalTasks((prev) => ({ ...prev, unscheduled: data.unscheduled }));
      } else {
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

      if (inprogressPage === 1) {
        setLocalTasks((prev) => ({ ...prev, inprogress: data.inprogress }));
      } else {
        const existingIds = new Set(
          localTasks.inprogress.map((task) => task.id)
        );
        const newTasks = data.inprogress.filter(
          (task) => !existingIds.has(task.id)
        );
        setLocalTasks((prev) => ({
          ...prev,
          inprogress: [...prev.inprogress, ...newTasks],
        }));
      }
    }
  }, [data, todoPage, completedPage, unscheduledPage, inprogressPage]);

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
  const hasMoreInprogress = data?.inprogressTotal
    ? data.inprogressTotal > inprogressPage * pageSize
    : false;

  // Handler for "Load More" buttons
  const handleLoadMoreTodo = () => setTodoPage((prev) => prev + 1);
  const handleLoadMoreCompleted = () => setCompletedPage((prev) => prev + 1);
  const handleLoadMoreUnscheduled = () =>
    setUnscheduledPage((prev) => prev + 1);
  const handleLoadMoreInprogress = () => setInprogressPage((prev) => prev + 1);

  // Reset pagination when filters change
  React.useEffect(() => {
    setTodoPage(1);
    setCompletedPage(1);
    setUnscheduledPage(1);
    setInprogressPage(1);
  }, [searchQuery, categoryFilter, scheduledFilter, priorityFilter, dateRange]);

  // Setup drag and drop
  const {
    draggingTaskId,
    dragOverTaskId,
    dragOverColumnId,
    dragPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useDragAndDrop({
    onDragComplete: () => refetch(),
  });

  const categories = ["all"];

  const generateId = () =>
    `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Handle creating/editing a task
  const handleSaveTask = () => {
    if (!taskFormData.title?.trim()) return;

    if (editingTask) {
      // Update existing task - in a real app, this would call an API
      // For now, just update the local state
      const taskToUpdate = {
        ...localTasks.todo.find((t) => t.id === editingTask),
        ...localTasks.completed.find((t) => t.id === editingTask),
        ...localTasks.unscheduled.find((t) => t.id === editingTask),
        ...taskFormData,
      };

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

  const handleToggleComplete = async (taskId: string) => {
    try {
      const isCompleted =
        localTasks.todo.find((t) => t.id === taskId)?.completed ||
        localTasks.completed.find((t) => t.id === taskId)?.completed ||
        localTasks.unscheduled.find((t) => t.id === taskId)?.completed ||
        false;

      // Refetch tasks to update the UI
      refetch();
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleToggleScheduled = async (taskId: string) => {
    try {
      const isScheduled =
        localTasks.todo.find((t) => t.id === taskId)?.scheduled ||
        localTasks.completed.find((t) => t.id === taskId)?.scheduled ||
        localTasks.unscheduled.find((t) => t.id === taskId)?.scheduled ||
        false;

      await updateTaskScheduled(taskId, !isScheduled);
      // Refetch tasks to update the UI
      refetch();
    } catch (error) {
      console.error("Error updating task scheduling status:", error);
    }
  };

  const handleTaskMove = (taskId: string, columnId: string) => {
    // In a real app, this would call an API to update the task column
    // For now, just refetch the data
    refetch();
  };

  const getTasksForColumn = (columnId: string) => {
    // Map our API task lists to the appropriate columns
    if (columnId === "todo") {
      return localTasks.todo.filter((t) => !t.completed);
    } else if (columnId === "completed") {
      return localTasks.completed;
    } else if (columnId === "unscheduled") {
      return localTasks.unscheduled;
    } else if (columnId === "inprogress") {
      return localTasks.inprogress;
    }
    return [];
  };

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
                dragOverColumnId={dragOverColumnId}
                dragOverTaskId={dragOverTaskId}
                dragPosition={dragPosition}
                draggingTaskId={draggingTaskId}
                isLoading={isLoading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFilterByColumn={setColumnFilter}
                onAddTask={handleAddTask}
                onDeleteColumn={handleDeleteColumn}
                onTaskClick={setSelectedTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTaskDragOver={handleDragOver}
                onEditTask={handleEditTask}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                handleTaskMove={handleTaskMove}
              />
            );
          })}
        </div>
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
