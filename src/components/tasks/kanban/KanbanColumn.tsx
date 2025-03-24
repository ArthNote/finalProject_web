import React, { use } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  LoaderCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TaskType } from "@/types/task";
import KanbanTaskCard from "./KanbanTaskCard";
import { Column } from "./types";
import { useLocale, useTranslations } from "next-intl";

interface KanbanColumnProps {
  column: Column;
  tasks: TaskType[];
  columns: Column[];
  dragOverColumnId: string | null;
  dragOverTaskId: string | null;
  dragPosition: "above" | "below" | null;
  draggingTaskId: string | null;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onFilterByColumn: (columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onTaskClick: (task: TaskType) => void;
  onDragStart: (e: React.DragEvent, task: TaskType) => void;
  onDragEnd: () => void;
  onTaskDragOver: (
    e: React.DragEvent,
    columnId: string,
    taskId: string
  ) => void;
  onEditTask: (task: TaskType) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  handleTaskMove: (taskId: string, columnId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  columns,
  dragOverColumnId,
  dragOverTaskId,
  dragPosition,
  draggingTaskId,
  isLoading,
  hasMore,
  onLoadMore,
  onDragOver,
  onDragLeave,
  onDrop,
  onFilterByColumn,
  onAddTask,
  onDeleteColumn,
  onTaskClick,
  onDragStart,
  onDragEnd,
  onTaskDragOver,
  onEditTask,
  onToggleComplete,
  onDeleteTask,
  handleTaskMove,
}) => {
  const t = useTranslations("tasks.kanbanView");
  const locale = useLocale() as "en" | "fr";
  return (
    <div
      className={cn(
        "flex flex-col border rounded-lg transition-all",
        dragOverColumnId === column.id && !dragOverTaskId
          ? "bg-primary/5 border-primary/30 shadow-lg ring-1 ring-primary/30"
          : "bg-muted/30"
      )}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${column.color || "bg-gray-400"}`}
          ></div>
          <h4 className="font-medium text-sm flex items-center gap-2">
            {column.title}
            <Badge variant="secondary">{tasks.length}</Badge>
          </h4>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterByColumn(column.id)}>
              <Filter className="h-3.5 w-3.5 mr-2" />
              {t("filterByColumn")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-3 flex-1 min-h-[50vh] flex flex-col">
        {tasks.length === 0 ? (
          <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-md">
            <p className="text-sm text-muted-foreground">
              {dragOverColumnId === column.id && draggingTaskId
                ? dragPosition === "above"
                  ? t("dragAtTop")
                  : dragPosition === "below"
                  ? t("dragAtBottom")
                  : t("dropHere")
                : t("noTasksYet")}
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

            {tasks.map((task) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                columns={columns}
                draggingTaskId={draggingTaskId}
                dragOverTaskId={dragOverTaskId}
                dragPosition={dragPosition}
                onTaskClick={onTaskClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onTaskDragOver}
                onEditTask={onEditTask}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                handleTaskMove={handleTaskMove}
              />
            ))}

            {/* Bottom drop indicator for empty space below last task */}
            {dragOverColumnId === column.id &&
              !dragOverTaskId &&
              dragPosition === "below" && (
                <div className="h-1 w-full bg-primary rounded-full my-2 animate-pulse"></div>
              )}

            {/* Load More button */}
            {hasMore && (
              <Button
                onClick={onLoadMore}
                variant="ghost"
                className="w-full text-muted-foreground mt-2"
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
