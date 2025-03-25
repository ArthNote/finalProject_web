import { TaskType } from "@/types/task";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Calendar, Clock, MoreHorizontal, Tag, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLocale, useTranslations } from "next-intl";
import EditTaskSheet from "./EditTaskSheet";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";
import {
  updateTask,
  updateTaskCompleteStatus,
  updateTaskPriority,
  updateTaskStatus,
} from "@/lib/api/tasks";
import { toast } from "@/hooks/use-toast";

interface ListViewCardProps {
  task: TaskType;
  handleViewTaskDetails: (task: TaskType) => void;
  handleToggleComplete: (taskId: string) => void;
  handleToggleScheduled: (taskId: string) => void;
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "todo":
      return "bg-blue-500";
    case "inprogress":
      return "bg-purple-500";
    case "unscheduled":
      return "bg-slate-500";
    case "completed":
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
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const t = useTranslations("tasks.listView.card");
  const locale = useLocale() as "fr" | "en";
  const queryClient = useQueryClient();

  // Add mutation for updating priority
  const { mutate: updatePriority } = useMutation({
    mutationFn: updateTaskPriority,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
      ]);
      toast({
        title: t("toast.updateSuccess.title"),
        description: t("toast.updateSuccess.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toast.updateError.title"),
        description: t("toast.updateError.description"),
        variant: "destructive",
      });
    },
  });

  // Add mutation for updating status
  const { mutate: updateStatus } = useMutation({
    mutationFn: (status: string) =>
      updateTaskStatus({ id: task.id, status: status }),
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
      ]);
      toast({
        title: t("toast.updateSuccess.title"),
        description: t("toast.updateSuccess.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toast.updateError.title"),
        description: t("toast.updateError.description"),
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string | Date) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditClick = () => {
    setEditSheetOpen(true);
  };

  const handleDeleteClick = () => {
    setDetailsSheetOpen(true);
  };

  const handlePriorityChange = (priority: string) => {
    updatePriority({
      id: task.id,
      priority: priority,
    });
  };

  const handleStatusChange = (status: string) => {
    if (task.scheduled) {
      updateStatus(status);
    } else {
      toast({
        title: t("toast.unscheduledTask.title"),
        description: t("toast.unscheduledTask.description"),
        variant: "destructive",
      });
    }
  };

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
            <span className="truncate">{t("completed")}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        className="group flex items-start gap-3 p-3 sm:p-4 border rounded-lg hover:shadow-sm transition-all bg-card overflow-hidden cursor-pointer"
        onClick={() => handleViewTaskDetails(task)}
      >
        {/* Priority indicator */}
        <div className="mt-1.5 flex flex-col items-center gap-2 shrink-0">
          <div
            className={`h-3 w-3 rounded-full ${getPriorityColor(
              task.priority
            )}`}
          />
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => handleToggleComplete(task.id)}
            disabled={!task.scheduled}
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
                    onClick={(e) => e.stopPropagation()} // Stop propagation here
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  {" "}
                  {/* Stop propagation on content */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation(); // Stop propagation
                      handleToggleScheduled(task.id);
                    }}
                  >
                    {task.scheduled ? t("unscheduleTask") : t("scheduleTask")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation(); // Stop propagation
                      handleEditClick();
                    }}
                  >
                    {t("editTask")}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("setPriority")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePriorityChange("low");
                          }}
                        >
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                            {t("low")}
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePriorityChange("medium");
                          }}
                        >
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-amber-500 mr-2" />
                            {t("medium")}
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePriorityChange("high");
                          }}
                        >
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                            {t("high")}
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("setStatus")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange("unscheduled");
                          }}
                          disabled={task.status === "unscheduled"}
                        >
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-slate-500 mr-2" />
                            {t("unscheduled")}
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange("todo");
                          }}
                          disabled={task.status === "todo"}
                        >
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
                            {t("todo")}
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange("inprogress");
                          }}
                          disabled={task.status === "inprogress"}
                        >
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-purple-500 mr-2" />
                            {t("inprogress")}
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick();
                    }}
                  >
                    {t("deleteTask")}
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
            {/* Schedule info */}
            {task.scheduled ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {task.date ? formatDate(task.date) : t("notScheduled")}
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
                {t("schedule")}
              </Button>
            )}

            {/* Show assigned users */}
            {task.assignedTo && task.assignedTo.length > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="mr-1 h-3.5 w-3.5 shrink-0" />
                <div className="flex -space-x-1">
                  {task.assignedTo.slice(0, 3).map((user) => (
                    <Avatar
                      key={user.id}
                      className="h-5 w-5 border border-background"
                    >
                      <AvatarImage src={user.profilePic} alt={user.name} />
                      <AvatarFallback className="text-[8px]">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {task.assignedTo.length > 3 && (
                    <span className="ml-1 text-xs">
                      +{task.assignedTo.length - 3}
                    </span>
                  )}
                </div>
              </div>
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

      {task && (
        <EditTaskSheet
          open={editSheetOpen}
          onOpenChange={(open) => {
            setEditSheetOpen(open);
            // If edit sheet is closed, refresh task data
            if (!open) {
              queryClient.invalidateQueries({ queryKey: ["tasks"] });
            }
          }}
          task={task}
        />
      )}

      {task && (
        <TaskDetailsSheet
          task={detailsSheetOpen ? task : null}
          onOpenChange={setDetailsSheetOpen}
          onTaskComplete={handleToggleComplete}
          onTaskScheduled={handleToggleScheduled}
        />
      )}
    </>
  );
};

export default ListViewCard;
