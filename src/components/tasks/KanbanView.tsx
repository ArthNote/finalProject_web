import React, { useState, useRef } from "react";
import {
  Plus,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronsUpDown,
  Check,
  Search,
  Filter,
  X,
  CalendarRange,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { sampleTasks, updateTaskCompleted } from "@/lib/taskService";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import { TaskType } from "@/types/task";

// Define column types
interface Column {
  id: string;
  title: string;
  color?: string;
}

const KanbanView = () => {
  // Initialize with sample tasks
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    // Map all sample tasks to have a status and order
    return sampleTasks.map((task, index) => ({
      ...task,
      status: task.completed
        ? "completed"
        : task.scheduled
        ? "inprogress"
        : !task.scheduled
        ? "unscheduled"
        : "todo",
      order: index,
    }));
  });

  // State for columns
  const [columns, setColumns] = useState<Column[]>([
    { id: "unscheduled", title: "Unscheduled", color: "bg-purple-500" },
    { id: "todo", title: "To Do", color: "bg-blue-500" },
    { id: "inprogress", title: "In Progress", color: "bg-amber-500" },

    { id: "completed", title: "Completed", color: "bg-green-500" },
  ]);

  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState<Partial<TaskType>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [columnFormData, setColumnFormData] = useState({ title: "", id: "" });
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "high", "medium", "low"
  const [columnFilter, setColumnFilter] = useState("all"); // Filter by column
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

  // Enhanced dragging state
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<"above" | "below" | null>(
    null
  );
  const ghostImageRef = useRef<HTMLDivElement | null>(null);

  // Get unique categories from tasks
  const categories = ["all", ...new Set(tasks.map((task) => task.category))];

  const generateId = () =>
    `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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

  // Filter tasks based on search query, category, priority, column and date range
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || task.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      const matchesColumn =
        columnFilter === "all" || task.status === columnFilter;

      const matchesDate = isTaskInDateRange(task.date?.toISOString() || "");

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesColumn &&
        matchesDate
      );
    });
  };

  // Check if any filters are active
  const isFilterActive =
    categoryFilter !== "all" ||
    priorityFilter !== "all" ||
    columnFilter !== "all";

  const isDateFilterActive = dateRange.type !== "none";

  // Date filter operations
  const clearDateFilter = () => {
    setDateRange({
      type: "none",
      from: undefined,
      to: undefined,
    });
    setIsCalendarOpen(false);
  };

  // Filter clearing
  const clearFilters = () => {
    setCategoryFilter("all");
    setPriorityFilter("all");
    setColumnFilter("all");
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

  // Handle creating/editing a task
  const handleSaveTask = () => {
    if (!taskFormData.title?.trim()) return;

    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask
            ? {
                ...task,
                ...taskFormData,
                dueDate: taskFormData.date || task.date,
              }
            : task
        )
      );
    } else {
      const maxOrder = Math.max(
        ...tasks
          .filter((t) => t.status === (taskFormData.status || "todo"))
          .map((t) => t.order ?? 0),
        -1
      );
      const newTask: TaskType = {
        id: generateId(),
        title: taskFormData.title || "New Task",
        description: taskFormData.description || "",
        priority:
          (taskFormData.priority as "high" | "medium" | "low") || "medium",
        category: taskFormData.category || "General",
        status: taskFormData.status || "todo",
        completed: taskFormData.status === "completed",
        scheduled: true,
        date: taskFormData.date || new Date(),
        tags: [],
        order: maxOrder + 1,
        resources: [],
      };
      setTasks([...tasks, newTask]);
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
      setTasks(
        tasks.map((task) =>
          task.status === columnId ? { ...task, status: firstColumnId } : task
        )
      );
    }
    setColumns(columns.filter((column) => column.id !== columnId));
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
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed, status: completed ? "completed" : "todo" }
          : task
      )
    );
  };

  // Enhanced drag and drop functionality
  const handleDragStart = (e: React.DragEvent, task: TaskType) => {
    setDraggingTaskId(task.id);
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";

    // Create custom drag image
    const ghostElement = document.createElement("div");
    ghostElement.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "pointer-events-none",
      "z-50",
      "opacity-90",
      "bg-white",
      "dark:bg-gray-800",
      "border",
      "p-3",
      "rounded-md",
      "shadow-lg",
      "scale-105",
      "rotate-2"
    );
    ghostElement.style.width = "320px";
    ghostElement.style.maxWidth = "90vw";
    ghostElement.style.transform = "translate(-50%, -50%)";
    ghostElement.style.position = "absolute"; // Ensure it's positioned properly
    ghostElement.style.left = "-1000px"; // Move off-screen initially
    ghostElement.style.top = "-1000px";

    ghostElement.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="h-2 w-2 rounded-full ${getPriorityColor(
          task.priority
        )}"></div>
        <div class="font-medium text-sm">${task.title}</div>
      </div>
    `;

    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 160, 20);
    ghostImageRef.current = ghostElement;

    // Add dragging class to document for global styling
    document.body.classList.add("dragging-task");
  };

  const handleDragOver = (
    e: React.DragEvent,
    columnId: string,
    overTaskId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggingTaskId) return;

    // If we're hovering over a task, handle task-level dropzone
    if (overTaskId) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;
      const position = y < height / 2 ? "above" : "below";

      setDragOverTaskId(overTaskId);
      setDragOverColumnId(columnId);
      setDragPosition(position);
    } else {
      // We're hovering over a column, determine if it's top, middle, or bottom
      const columnElement = e.currentTarget as HTMLElement;
      const rect = columnElement.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;

      // Get the column's task container which has the tasks
      const taskContainer = columnElement.querySelector(".task-container");

      if (taskContainer) {
        const taskElements = taskContainer.querySelectorAll(".task-card");

        if (taskElements.length === 0) {
          // Empty column, just highlight the whole column
          setDragOverColumnId(columnId);
          setDragOverTaskId(null);
          setDragPosition(y < height / 2 ? "above" : "below");
        } else {
          // Check if we're hovering above the first task
          const firstTask = taskElements[0] as HTMLElement;
          const firstTaskRect = firstTask.getBoundingClientRect();

          if (e.clientY < firstTaskRect.top) {
            // Above the first task
            setDragOverColumnId(columnId);
            setDragOverTaskId(null);
            setDragPosition("above");
          } else {
            // Check if we're below the last task
            const lastTask = taskElements[
              taskElements.length - 1
            ] as HTMLElement;
            const lastTaskRect = lastTask.getBoundingClientRect();

            if (e.clientY > lastTaskRect.bottom) {
              // Below the last task
              setDragOverColumnId(columnId);
              setDragOverTaskId(null);
              setDragPosition("below");
            } else {
              // We're somewhere in the middle, but not directly over a task
              // Keep the column highlighted
              setDragOverColumnId(columnId);
              setDragOverTaskId(null);
              setDragPosition(null);
            }
          }
        }
      } else {
        // Fallback if task container not found
        setDragOverColumnId(columnId);
        setDragOverTaskId(null);
      }
    }

    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;

    setDragOverColumnId(null);
    setDragOverTaskId(null);
    setDragPosition(null);
  };

  const handleDrop = (
    e: React.DragEvent,
    targetColumnId: string,
    targetTaskId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const taskId = e.dataTransfer.getData("text/plain");

    if (!taskId || !draggingTaskId) return;

    const updatedTasks = [...tasks];
    const draggedTaskIndex = updatedTasks.findIndex((t) => t.id === taskId);
    if (draggedTaskIndex === -1) return; // Task not found

    const draggedTask = updatedTasks[draggedTaskIndex];

    // Remove the task from its current position
    updatedTasks.splice(draggedTaskIndex, 1);

    // If dropping onto a specific task
    if (targetTaskId && targetTaskId !== taskId) {
      const targetIndex = updatedTasks.findIndex((t) => t.id === targetTaskId);
      if (targetIndex !== -1) {
        const targetTask = updatedTasks[targetIndex];

        // Calculate new order based on drop position
        const newOrder =
          dragPosition === "above"
            ? (targetTask.order ?? 0) - 0.5
            : (targetTask.order ?? 0) + 0.5;

        draggedTask.status = targetColumnId;
        draggedTask.order = newOrder;
        updatedTasks.splice(
          targetIndex + (dragPosition === "above" ? 0 : 1),
          0,
          draggedTask
        );
      } else {
        // Target task not found (shouldn't happen)
        draggedTask.status = targetColumnId;
        updatedTasks.push(draggedTask);
      }
    } else {
      // Dropping directly onto a column (not on a task)
      const columnTasks = updatedTasks.filter(
        (t) => t.status === targetColumnId
      );

      // Get the mouse position relative to the column element
      const columnElement = e.currentTarget as HTMLElement;
      const rect = columnElement.getBoundingClientRect();
      const taskContainer = columnElement.querySelector(".task-container");

      if (taskContainer) {
        const taskElements = taskContainer.querySelectorAll(".task-card");

        if (taskElements.length === 0) {
          // Empty column - respect the drop position
          draggedTask.status = targetColumnId;
          draggedTask.order = 0; // First and only task
        } else {
          // Find if we're dropping above first task
          const firstTask = taskElements[0] as HTMLElement;
          const firstTaskRect = firstTask.getBoundingClientRect();
          const firstTaskId = firstTask.getAttribute("data-task-id");
          const firstTaskData = updatedTasks.find((t) => t.id === firstTaskId);

          if (e.clientY < firstTaskRect.top) {
            // Above the first task
            draggedTask.status = targetColumnId;
            draggedTask.order = (firstTaskData?.order ?? 0) - 1;
          } else {
            // Check if we're below the last task
            const lastTask = taskElements[
              taskElements.length - 1
            ] as HTMLElement;
            const lastTaskRect = lastTask.getBoundingClientRect();
            const lastTaskId = lastTask.getAttribute("data-task-id");
            const lastTaskData = updatedTasks.find((t) => t.id === lastTaskId);

            if (e.clientY > lastTaskRect.bottom) {
              // Below the last task
              draggedTask.status = targetColumnId;
              draggedTask.order = (lastTaskData?.order ?? 0) + 1;
            } else {
              // We're between tasks, find the right position
              let insertIndex = 0;
              let previousTaskOrder = -1;
              let nextTaskOrder = Number.MAX_SAFE_INTEGER;

              for (let i = 0; i < taskElements.length; i++) {
                const taskElement = taskElements[i] as HTMLElement;
                const taskRect = taskElement.getBoundingClientRect();

                if (
                  e.clientY > taskRect.bottom &&
                  i < taskElements.length - 1
                ) {
                  // We're below this task
                  const taskId = taskElement.getAttribute("data-task-id");
                  const taskData = updatedTasks.find((t) => t.id === taskId);
                  previousTaskOrder = taskData?.order ?? i;

                  const nextTaskElement = taskElements[i + 1] as HTMLElement;
                  const nextTaskId =
                    nextTaskElement.getAttribute("data-task-id");
                  const nextTaskData = updatedTasks.find(
                    (t) => t.id === nextTaskId
                  );
                  nextTaskOrder = nextTaskData?.order ?? i + 1;

                  insertIndex = i + 1;
                }
              }

              // Calculate order between the two tasks
              draggedTask.status = targetColumnId;
              draggedTask.order =
                previousTaskOrder + (nextTaskOrder - previousTaskOrder) / 2;
            }
          }
        }
      } else {
        // Fallback - just place at the end
        draggedTask.status = targetColumnId;
        const maxOrder =
          columnTasks.length > 0
            ? Math.max(...columnTasks.map((t) => t.order ?? 0))
            : -1;
        draggedTask.order = maxOrder + 1;
      }

      updatedTasks.push(draggedTask);
    }

    // Normalize orders to be whole numbers (1, 2, 3...) within each column
    const normalizedTasks = [...updatedTasks];

    // Group tasks by column and normalize order within each column
    columns.forEach((column) => {
      const columnTasks = normalizedTasks
        .filter((task) => task.status === column.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      columnTasks.forEach((task, index) => {
        task.order = index + 1;
      });
    });

    setTasks(normalizedTasks);
    handleDragEnd();
  };

  const handleDragEnd = () => {
    if (
      ghostImageRef.current &&
      document.body.contains(ghostImageRef.current)
    ) {
      document.body.removeChild(ghostImageRef.current);
      ghostImageRef.current = null;
    }

    document.body.classList.remove("dragging-task");
    setDraggingTaskId(null);
    setDragOverTaskId(null);
    setDragOverColumnId(null);
    setDragPosition(null);
  };

  const getTasksForColumn = (columnId: string) => {
    let columnTasks = tasks.filter((task) => task.status === columnId);

    // If we have a date filter active, filter tasks except for unscheduled ones
    if (dateRange.type !== "none" && columnId !== "unscheduled") {
      columnTasks = columnTasks.filter((task) => {
        // If the task is unscheduled, always include it
        if (!task.scheduled) return true;

        // Otherwise, check if it's in the date range
        return isTaskInDateRange(task.date?.toISOString() || "");
      });
    }

    // Sort tasks by their order property
    return [...columnTasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Handle priority label display
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

  return (
    <div className="space-y-6">
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
                        priorityFilter !== "all" ? 1 : 0,
                        columnFilter !== "all" ? 1 : 0,
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Column</label>
                    <Select
                      value={columnFilter}
                      onValueChange={setColumnFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Columns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Columns</SelectItem>
                        {columns.map((column) => (
                          <SelectItem key={column.id} value={column.id}>
                            {column.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setColumnFormData({ title: "", id: "" });
                setEditingColumn(null);
                setIsColumnFormOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 sm:mr-2" />
              <span className="hidden sm:inline">Add Column</span>
            </Button>
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
                Priority: {priorityFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setPriorityFilter("all")}
                />
              </Badge>
            )}
            {columnFilter !== "all" && (
              <Badge
                variant="secondary"
                className="px-2 flex gap-1 items-center"
              >
                Column:{" "}
                {columns.find((c) => c.id === columnFilter)?.title ||
                  columnFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setColumnFilter("all")}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={cn(
              "flex flex-col border rounded-lg transition-all",
              dragOverColumnId === column.id && !dragOverTaskId
                ? "bg-primary/5 border-primary/30 shadow-lg ring-1 ring-primary/30"
                : "bg-muted/30"
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    column.color || "bg-gray-400"
                  }`}
                ></div>
                <h4 className="font-medium text-sm flex items-center gap-2">
                  {column.title}
                  <Badge variant="secondary">
                    {getTasksForColumn(column.id).length}
                  </Badge>
                </h4>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setColumnFormData({
                        title: column.title,
                        id: column.id,
                      });
                      setEditingColumn(column.id);
                      setIsColumnFormOpen(true);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5 mr-2" />
                    Edit Column
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setColumnFilter(column.id)}
                    disabled={columnFilter === column.id}
                  >
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    Filter by Column
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => handleDeleteColumn(column.id)}
                    disabled={columns.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete Column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="p-3 flex-1 min-h-[50vh] flex flex-col">
              {getTasksForColumn(column.id).length === 0 ? (
                <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground">
                    {dragOverColumnId === column.id && draggingTaskId
                      ? dragPosition === "above"
                        ? "Drop at the top"
                        : dragPosition === "below"
                        ? "Drop at the bottom"
                        : "Drop here"
                      : "No tasks yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 flex-grow relative task-container">
                  {/* Top drop indicator for empty space above first task */}
                  {dragOverColumnId === column.id &&
                    !dragOverTaskId &&
                    dragPosition === "above" && (
                      <div className="h-1 w-full bg-primary rounded-full my-2 animate-pulse"></div>
                    )}

                  {getTasksForColumn(column.id).map((task) => (
                    <Card
                      key={task.id}
                      className={cn(
                        "bg-card border rounded-md shadow-sm transition-all cursor-pointer relative task-card",
                        task.id === draggingTaskId && "opacity-50 scale-95",
                        task.id === dragOverTaskId &&
                          dragPosition === "above" &&
                          "before:content-[''] before:block before:h-1 before:w-full before:bg-primary before:absolute before:-top-2",
                        task.id === dragOverTaskId &&
                          dragPosition === "below" &&
                          "after:content-[''] after:block after:h-1 after:w-full after:bg-primary after:absolute after:-bottom-2",
                        "transform transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                      )}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, column.id, task.id)}
                      onClick={() => setSelectedTask(task)}
                      data-task-id={task.id}
                    >
                      <div
                        className={`h-1 w-full rounded-t-md ${getPriorityColor(
                          task.priority
                        )}`}
                      ></div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="cursor-grab active:cursor-grabbing">
                              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem
                                onSelect={() => setSelectedTask(task)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleEditTask(task)}
                              >
                                <Edit className="h-3.5 w-3.5 mr-2" />
                                Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleToggleComplete(task.id, !task.completed)
                                }
                              >
                                <Check className="h-3.5 w-3.5 mr-2" />
                                {task.completed
                                  ? "Mark as Incomplete"
                                  : "Mark as Complete"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled={columns.length <= 1}>
                                Move to...
                              </DropdownMenuItem>
                              {columns.map((col) => (
                                <DropdownMenuItem
                                  key={col.id}
                                  disabled={task.status === col.id}
                                  className="pl-6"
                                  onSelect={() => {
                                    const maxOrder = Math.max(
                                      ...tasks
                                        .filter((t) => t.status === col.id)
                                        .map((t) => t.order ?? 0),
                                      -1
                                    );
                                    setTasks(
                                      tasks.map((t) =>
                                        t.id === task.id
                                          ? {
                                              ...t,
                                              status: col.id,
                                              order: maxOrder + 1000,
                                            }
                                          : t
                                      )
                                    );
                                  }}
                                >
                                  {col.title}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onSelect={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              "font-medium text-sm line-clamp-1 mb-1"
                            )}
                          >
                            {task.title}
                          </h5>

                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {task.description || "No description provided"}
                          </p>

                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="text-xs bg-secondary/30"
                            >
                              {task.category || "Uncategorized"}
                            </Badge>
                            {task.date && task.scheduled ? (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{formatDate(task.date?.toISOString() || "")}</span>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground italic">
                                Not scheduled
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Bottom drop indicator for empty space below last task */}
                  {dragOverColumnId === column.id &&
                    !dragOverTaskId &&
                    dragPosition === "below" && (
                      <div className="h-1 w-full bg-primary rounded-full my-2 animate-pulse"></div>
                    )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task form dialog */}
      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task Title</Label>
              <Input
                placeholder="Enter task title"
                value={taskFormData.title || ""}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter task description"
                value={taskFormData.description || ""}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={taskFormData.priority || "medium"}
                  onValueChange={(value) =>
                    setTaskFormData({
                      ...taskFormData,
                      priority: value as "high" | "medium" | "low",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  placeholder="Enter category"
                  value={taskFormData.category || ""}
                  onChange={(e) =>
                    setTaskFormData({
                      ...taskFormData,
                      category: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={taskFormData.status || "todo"}
                  onValueChange={(value) =>
                    setTaskFormData({ ...taskFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="datetime-local"
                  value={
                    taskFormData.date
                      ? new Date(taskFormData.date)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : new Date();
                    setTaskFormData({
                      ...taskFormData,
                      date: date ? date : null,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveTask}>
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Column form dialog */}
      <Dialog open={isColumnFormOpen} onOpenChange={setIsColumnFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingColumn ? "Edit Column" : "Add New Column"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                placeholder="Enter column title"
                value={columnFormData.title || ""}
                onChange={(e) =>
                  setColumnFormData({
                    ...columnFormData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            {!editingColumn && (
              <div className="space-y-2">
                <Label>Column ID (optional)</Label>
                <Input
                  placeholder="Enter column ID or leave blank for auto-generation"
                  value={columnFormData.id || ""}
                  onChange={(e) =>
                    setColumnFormData({ ...columnFormData, id: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  If left blank, an ID will be generated from the title
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveColumn}>
              {editingColumn ? "Update Column" : "Add Column"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Sheet */}
      <TaskDetailsSheet
        task={selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onTaskComplete={(taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            handleToggleComplete(taskId, !task.completed);
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

      {/* Add global styles for drag and drop */}
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
