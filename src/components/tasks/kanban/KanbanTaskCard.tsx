import React from "react";
import {
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { format } from "date-fns";
import { TaskType } from "@/types/task";
import { Column } from "./types";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";

interface KanbanTaskCardProps {
  task: TaskType;
  columns: Column[];
  draggingTaskId: string | null;
  dragOverTaskId: string | null;
  dragPosition: "above" | "below" | null;
  onTaskClick: (task: TaskType) => void;
  onDragStart: (e: React.DragEvent, task: TaskType) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, columnId: string, taskId: string) => void;
  onEditTask: (task: TaskType) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  handleTaskMove: (taskId: string, columnId: string) => void;
}
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
const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
  task,
  columns,
  draggingTaskId,
  dragOverTaskId,
  dragPosition,
  onTaskClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onEditTask,
  onToggleComplete,
  onDeleteTask,
  handleTaskMove,
}) => {
  const t = useTranslations("tasks.kanbanView.card");
  const locale = useLocale() as "en" | "fr";
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a", {
      locale: locale === "fr" ? fr : enUS,
    });
  };

  // Ensure task has status defined
  const taskStatus =
    task.status ||
    (task.completed ? "completed" : !task.scheduled ? "unscheduled" : "todo");

  return (
    <Card
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
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, taskStatus, task.id)}
      onClick={() => onTaskClick(task)}
      data-task-id={task.id}
      data-task-status={taskStatus}
    >
      <div
        className={`h-1 w-full rounded-t-md ${getPriorityColor(task.priority)}`}
      ></div>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="cursor-grab active:cursor-grabbing">
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onSelect={() => onTaskClick(task)}>
                {t("viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEditTask(task)}>
                <Edit className="h-3.5 w-3.5 mr-2" />
                {t("editTask")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onToggleComplete(task.id)}>
                <Check className="h-3.5 w-3.5 mr-2" />
                {task.completed ? t("markInComplete") : t("markComplete")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={columns.length <= 1}>
                {t("moveTo")}
              </DropdownMenuItem>
              {columns.map((col) => (
                <DropdownMenuItem
                  key={col.id}
                  disabled={taskStatus === col.id}
                  className="pl-6"
                  onSelect={() => handleTaskMove(task.id, col.id)}
                >
                  {col.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onSelect={() => onDeleteTask(task.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                {t("deleteTask")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h5 className={cn("font-medium text-sm line-clamp-1 mb-1")}>
            {task.title}
          </h5>

          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {task.description || t("noDescription")}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs bg-secondary/30">
              {task.category || t("uncategorized")}
            </Badge>
            {task.date && task.scheduled ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>
                  {task.date
                    ? formatDate(task.date.toString())
                    : t("notScheduled")}
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">
                {t("notScheduled")}
              </div>
            )}
          </div>

          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="mt-2 flex items-center gap-1">
              {task.assignedTo.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="h-5 w-5 rounded-full bg-primary/20 text-xs flex items-center justify-center overflow-hidden"
                  title={user.name}
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              ))}
              {task.assignedTo.length > 3 && (
                <div className="h-5 w-5 rounded-full bg-muted text-xs flex items-center justify-center">
                  +{task.assignedTo.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanTaskCard;
