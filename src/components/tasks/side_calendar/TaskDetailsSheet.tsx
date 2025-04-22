import React, { useState } from "react";
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
  Users,
  FileText,
  Link as LinkIcon,
  StickyNote,
  Paperclip,
  ExternalLink,
  LoaderCircle,
  Folders,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskType } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/lib/api/tasks";
import { toast } from "@/hooks/use-toast";
import EditTaskSheet from "../EditTaskSheet";
import AlertDialogDelete from "@/components/alert-dialog-delete";

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
  const t = useTranslations("tasks.detailsSheet");
  const locale = useLocale() as "fr" | "en";
  const queryClient = useQueryClient();
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({
        title: t("toast.deleteSuccess.title"),
        description: t("toast.deleteSuccess.description"),
      });

      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.refetchQueries({
          queryKey: ["calendar-tasks"],
          type: "active",
        }),
        queryClient.refetchQueries({
          queryKey: ["project", task?.projectId],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["project", task?.projectId],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["team"],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["tasks-by-date"],
        }),
      ]).then(() => {
        setTimeout(() => onOpenChange(false), 100);
      });
    },
    onError: (error) => {
      toast({
        title: t("toast.deleteError.title"),
        description: t("toast.deleteError.description"),
        variant: "destructive",
      });
      console.error("Error deleting task:", error);
    },
  });

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

  // Format duration for display
  const getDurationText = () => {
    if (!task.duration && !task.startTime && !task.endTime) {
      return t("notSpecified");
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
      return t("durationMinutes", {
        count: durationMinutes,
      });
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes === 0
      ? t("durationHours", { count: hours })
      : t("durationHoursMinutes", { hours, minutes });
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

  // Helper function to get appropriate icon for resource type
  const getResourceIcon = (category: string) => {
    switch (category) {
      case "file":
        return <FileText className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      case "note":
        return <StickyNote className="h-4 w-4" />;
      default:
        return <Paperclip className="h-4 w-4" />;
    }
  };

  const handleEditClick = () => {
    setEditSheetOpen(true);
  };

  return (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-background">
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="px-6 py-6 space-y-6">
            {/* Task title and checkbox section */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold pr-4">{task.title}</h2>
              <Checkbox
                checked={task.completed}
                disabled={!task.scheduled}
                onCheckedChange={(checked) =>
                  onTaskComplete && onTaskComplete(task.id, !!checked)
                }
              />
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {task.description}
            </p>

            <div className="space-y-3">
              {/* Add Project Info - Place this at the top of the details */}
              {task?.project && (
                <div className="flex items-center gap-2">
                  <Folders className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">
                      {t("project")}:{" "}
                      <span className="font-medium">{task.project.name}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm">
                    {t("date")}:{" "}
                    {task.date
                      ? format(new Date(task.date), "EEEE, MMMM d, yyyy", {
                          locale: locale == "en" ? enUS : fr,
                        })
                      : t("notSpecified")}
                  </p>
                  <p className="text-sm">
                    {t("time")}:{" "}
                    {format(startTime, "h:mm a", {
                      locale: locale == "en" ? enUS : fr,
                    })}{" "}
                    -{" "}
                    {format(endTime, "h:mm a", {
                      locale: locale == "en" ? enUS : fr,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm">
                  {t("duration")}: {getDurationText()}
                </p>
              </div>

              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm flex items-center gap-2">
                  {t("priority")}:{" "}
                  <span className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-1 ${getPriorityColor(
                        task.priority
                      )}`}
                    />
                    {t(task.priority)}
                  </span>
                </span>
              </div>

              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {t("status")}:{" "}
                  {task.scheduled ? t("scheduled") : t("unscheduled")}
                </span>
              </div>

              {/* Assigned Users Section */}
              {task.assignedTo && task.assignedTo.length > 0 && (
                <div className="flex items-start">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-sm block mb-1">
                      {t("assignedTo")}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {task.assignedTo.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 bg-secondary/50 rounded-full px-2 py-1"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={user.profilePic}
                              alt={user.name}
                            />
                            <AvatarFallback className="text-xs">
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {user.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Resources Section - Make sure resource display is consistent with edit form */}
              {task.resources && task.resources.length > 0 && (
                <div className="flex items-start">
                  <Paperclip className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <div className="w-full">
                    <span className="text-sm block mb-1">
                      {t("resources")}:
                    </span>
                    <div className="space-y-2 w-full">
                      {task.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between gap-2 bg-secondary/30 rounded-md px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {getResourceIcon(resource.category)}
                            <span className="font-medium truncate">
                              {resource.name}
                            </span>
                            {resource.type && (
                              <span className="text-xs text-muted-foreground">
                                ({resource.type})
                              </span>
                            )}
                          </div>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {t("category")}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {task.category}
              </Badge>
            </div>

            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2" /> {t("tags")}
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
              <Button
                className="flex-1"
                variant="outline"
                disabled={isPending}
                onClick={handleEditClick}
              >
                {t("edit")}
              </Button>
              <AlertDialogDelete
                title={t("deleteTask.title")}
                description={t("deleteTask.description")}
                cancel={t("deleteTask.cancel")}
                deleteT={t("deleteTask.confirm")}
                onDelete={() => mutate(task.id)}
                isDeleting={isPending}
              >
                <Button className="flex-1" variant="destructive">
                  {t("delete")}
                </Button>
              </AlertDialogDelete>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;
