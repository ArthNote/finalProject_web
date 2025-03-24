import { useState, useRef } from "react";
import { TaskType } from "@/types/task";

export function useDragAndDrop({
  onDragComplete,
}: {
  onDragComplete: () => void;
}) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<"above" | "below" | null>(
    null
  );
  const ghostImageRef = useRef<HTMLDivElement | null>(null);

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

    // Call the provided callback to handle the completion of drag
    onDragComplete();

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

  return {
    draggingTaskId,
    dragOverTaskId,
    dragOverColumnId,
    dragPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}
