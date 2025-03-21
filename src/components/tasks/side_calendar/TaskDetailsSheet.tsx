import React from "react";
import { format, addMinutes, differenceInMinutes } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CalendarIcon,
  Tag,
  AlertCircle,
  CalendarDays,
  Timer,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskType } from "@/types/task";

interface TaskDetailsSheetProps {
  task: TaskType | null;
  onOpenChange: (open: boolean) => void;
  onTaskComplete?: (taskId: string, completed: boolean) => void;
  onTaskScheduled?: (taskId: string, scheduled: boolean) => void;
}

const TaskDetailsSheet: React.FC<TaskDetailsSheetProps> = ({
  task,
  onOpenChange,
  onTaskComplete,
  onTaskScheduled,
}) => {
  if (!task) return null;

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

  const handleToggleScheduled = () => {
    if (onTaskScheduled) {
      onTaskScheduled(task.id, !task.scheduled);
      onOpenChange(false);
    }
  };

  // Format duration for display
  const getDurationText = () => {
    if (!task.duration && !task.startTime && !task.endTime) {
      return "Not specified";
    }

    const durationMinutes =
      task.duration ||
      (() => {
        if (task.startTime && task.endTime) {
          return differenceInMinutes(
            new Date(task.endTime),
            new Date(task.startTime)
          );
        }
        return 60; // default to 1 hour
      })();

    if (durationMinutes < 60) {
      return `${durationMinutes} minutes`;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes === 0
      ? `${hours} hour${hours !== 1 ? "s" : ""}`
      : `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
          minutes !== 1 ? "s" : ""
        }`;
  };

  // Get start and end times
  const startTime = task.startTime
    ? new Date(task.startTime)
    : task.date
    ? new Date(task.date)
    : new Date();
  const endTime = task.endTime
    ? new Date(task.endTime)
    : task.duration
    ? addMinutes(startTime, task.duration)
    : addMinutes(startTime, 60);

  return (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold pr-4">{task.title}</h2>
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) =>
                onTaskComplete && onTaskComplete(task.id, !!checked)
              }
            />
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm">
                  Date: {task.date ? format(new Date(task.date), "EEEE, MMMM d, yyyy") : "Not specified"}
                </p>
                <p className="text-sm">
                  Time: {format(startTime, "h:mm a")} -{" "}
                  {format(endTime, "h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm">Duration: {getDurationText()}</p>
            </div>

            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm flex items-center gap-2">
                Priority:
                <span className="flex items-center">
                  <div
                    className={`h-3 w-3 rounded-full mr-1 ${getPriorityColor(
                      task.priority
                    )}`}
                  />
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
              </span>
            </div>

            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                Status: {task.scheduled ? "Scheduled" : "Unscheduled"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" /> Category
            </h3>
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-2" /> Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button className="flex-1" variant="outline">
              Edit
            </Button>
            <Button
              className="flex-1"
              variant={task.scheduled ? "default" : "secondary"}
              onClick={handleToggleScheduled}
            >
              {task.scheduled ? "Unschedule" : "Schedule"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;
