import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Check, Clock, Loader2, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { TaskType } from "@/types/task";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskPriority, updateTaskStatus } from "@/lib/api/tasks";
import { toast } from "@/hooks/use-toast";
import EditTaskSheet from "./EditTaskSheet";
import TaskDetailsSheet from "./side_calendar/TaskDetailsSheet";

interface GridViewCardProps {
  task: TaskType;
  setSelectedTask: (task: TaskType) => void;
  handleToggleComplete: (taskId: string) => void;
  handleToggleScheduled: (taskId: string) => void;
  isScheduling?: boolean;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-green-500";
    case "urgent":
      return "bg-red-700";
    default:
      return "bg-slate-500";
  }
};

const GridViewCard = ({
  task,
  setSelectedTask,
  handleToggleComplete,
  handleToggleScheduled,
  isScheduling,
}: GridViewCardProps) => {
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations("tasks.gridView.card");
  const locale = useLocale() as "fr" | "en";
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a", {
      locale: locale === "fr" ? fr : enUS,
    });
  };

  // Add mutation for updating priority
  const { mutate: updatePriority } = useMutation({
    mutationFn: updateTaskPriority,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.invalidateQueries({
          queryKey: ["tasks-by-date"],
          type: "all",
        }),
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
        queryClient.invalidateQueries({
          queryKey: ["tasks-by-date"],
          type: "all",
        }),
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
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-shadow",
          "opacity-75"
        )}
        onClick={() => setSelectedTask(task)}
      >
        <div
          className={`h-1 w-full rounded-t-md ${getPriorityColor(
            task.priority
          )}`}
        ></div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-sm line-clamp-1 line-through">
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
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
                {/* <DropdownMenuItem
                  className={task.scheduled ? "hidden" : ""}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation
                    handleToggleScheduled(task.id);
                  }}
                  disabled={isScheduling}
                >
                  {isScheduling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("scheduling")}
                    </>
                  ) : task.scheduled ? (
                    t("unscheduleTask")
                  ) : (
                    t("scheduleTask")
                  )}
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation
                    handleEditClick();
                  }}
                >
                  {t("editTask")}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                    {t("setPriority")}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePriorityChange("low");
                        }}
                        disabled={task.priority === "low"}
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
                        disabled={task.priority === "medium"}
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
                        disabled={task.priority === "high"}
                      >
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                          {t("high")}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePriorityChange("urgent");
                        }}
                        disabled={task.priority === "urgent"}
                      >
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-red-700 mr-2" />
                          {t("urgent")}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
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

          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 line-through">
            {task.description || "No description provided"}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline" className="text-xs bg-secondary/30">
              {task.category || t("uncategorized")}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t("completed")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedTask(task)}
      >
        <div
          className={`h-1 w-full rounded-t-md ${getPriorityColor(
            task.priority
          )}`}
        ></div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-sm line-clamp-1">{task.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
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
                {/* <DropdownMenuItem
                  className={task.scheduled ? "hidden" : ""}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation
                    handleToggleScheduled(task.id);
                  }}
                  disabled={isScheduling}
                >
                  {isScheduling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("scheduling")}
                    </>
                  ) : task.scheduled ? (
                    t("unscheduleTask")
                  ) : (
                    t("scheduleTask")
                  )}
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation
                    handleEditClick();
                  }}
                >
                  {t("editTask")}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                    {t("setPriority")}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePriorityChange("low");
                        }}
                        disabled={task.priority === "low"}
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
                        disabled={task.priority === "medium"}
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
                        disabled={task.priority === "high"}
                      >
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                          {t("high")}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePriorityChange("urgent");
                        }}
                        disabled={task.priority === "urgent"}
                      >
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-red-700 mr-2" />
                          {t("urgent")}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
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

          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description || t("noDescriptionProvided")}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline" className="text-xs bg-secondary/30">
              {task.category || t("uncategorized")}
            </Badge>
            {task.scheduled ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>
                  {task.startTime
                    ? formatDate(task.startTime.toString())
                    : t("noDateScheduled")}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                {t("notScheduled")}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
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

export default GridViewCard;
