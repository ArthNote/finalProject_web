import { TaskType } from "@/types/task";
import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Calendar, Clock, MoreHorizontal, Tag } from "lucide-react";

interface ListViewCardProps {
  task: TaskType;
  handleViewTaskDetails: (task: TaskType) => void;
  handleToggleComplete: (taskId: string) => void;
  handleToggleScheduled: (taskId: string) => void;
}

const formatDate = (dateString: string | Date) => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

const ListViewCard = ({
  task,
  handleViewTaskDetails,
  handleToggleComplete,
  handleToggleScheduled,
}: ListViewCardProps) => {
  if (task.completed) {
    return (
      <div className="group flex items-start gap-3 p-3 border rounded-lg bg-muted/50 overflow-hidden">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => handleToggleComplete(task.id)}
          className="shrink-0 mt-0.5"
        />

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
            <h4 className="font-medium text-sm text-muted-foreground line-through truncate max-w-full">
              {task.title}
            </h4>
            <Badge
              variant="outline"
              className="bg-secondary/30 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap w-fit opacity-50"
            >
              {task.category}
            </Badge>
          </div>

          <div className="flex items-center text-xs text-muted-foreground/70 truncate">
            <Clock className="mr-1 h-3 w-3 shrink-0" />
            <span className="truncate">Completed</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="group flex items-start gap-3 p-3 sm:p-4 border rounded-lg hover:shadow-sm transition-all bg-card overflow-hidden cursor-pointer"
      onClick={() => handleViewTaskDetails(task)}
    >
      {/* Priority indicator */}
      <div className="mt-1.5 flex flex-col items-center gap-2 shrink-0">
        <div
          className={`h-3 w-3 rounded-full ${getPriorityColor(task.priority)}`}
        />
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => handleToggleComplete(task.id)}
        />
      </div>

      {/* Task details */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <h4 className="font-medium text-base truncate max-w-full">
              {task.title}
            </h4>
            <Badge
              variant="outline"
              className="bg-secondary/50 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap self-start sm:self-auto w-fit sm:hidden"
            >
              {task.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className="bg-secondary/50 h-6 text-xs px-1.5 sm:px-2.5 whitespace-nowrap hidden sm:flex"
            >
              {task.category}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-70 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleToggleScheduled(task.id)}
                >
                  {task.scheduled ? "Unschedule Task" : "Schedule Task"}
                </DropdownMenuItem>
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem>Set Priority</DropdownMenuItem>
                <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description - hidden on mobile */}
        <p className="text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 break-words hidden sm:block">
          {task.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* Schedule button - hidden on mobile */}
          {task.scheduled ? (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-none">
                {task.date ? formatDate(task.date) : "Not scheduled"}
              </span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2 hidden sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleScheduled(task.id);
              }}
            >
              <Calendar className="mr-1 h-3.5 w-3.5" />
              Schedule
            </Button>
          )}

          {/* Tags - hidden on mobile */}
          {(task.tags?.length ?? 0) > 0 && (
            <div className="hidden sm:flex items-center gap-1 max-w-full overflow-hidden">
              <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {(task.tags ?? []).slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-1.5 py-0.5 bg-muted rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {(task.tags?.length ?? 0) > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{(task.tags?.length ?? 0) - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListViewCard;
