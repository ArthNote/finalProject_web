import React, { useState } from "react";
import {
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronsUpDown,
  Check,
  Loader2,
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
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TaskType } from "@/types/task";
import { Column } from "./types";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { updateTaskPriority, updateTaskStatus } from "@/lib/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditTaskSheet from "../EditTaskSheet";
import TaskDetailsSheet from "../side_calendar/TaskDetailsSheet";
import { Draggable } from "@hello-pangea/dnd";
import Image from "next/image";

interface KanbanTaskCardProps {
  task: TaskType;
  columns: Column[];
  onTaskClick: (task: TaskType) => void;
  onEditTask: (task: TaskType) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  handleTaskMove: (taskId: string, columnId: string) => void;
  handleToggleSchedule: (taskId: string) => void;
  isScheduling?: boolean; // Optional prop for scheduling state
  index: number; // Optional index prop for Draggable
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
const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
  task,
  columns,
  index,
  onTaskClick,
  onEditTask,
  onToggleComplete,
  onDeleteTask,
  handleTaskMove,
  isScheduling,
  handleToggleSchedule,
}) => {
  const t = useTranslations("tasks.kanbanView.card");
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const locale = useLocale() as "en" | "fr";
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a", {
      locale: locale === "fr" ? fr : enUS,
    });
  };

  const queryClient = useQueryClient();

  // Add mutation for updating priority
  const { mutate: updatePriority } = useMutation({
    mutationFn: updateTaskPriority,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "all" }),
        queryClient.invalidateQueries({
          queryKey: ["tasks-by-date"],
          type: "all",
        }),
      ]).then(() => {
        toast({
          title: t("toast.updateSuccess.title"),
          description: t("toast.updateSuccess.description"),
        });
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
        queryClient.invalidateQueries({ queryKey: ["tasks"], type: "all" }),
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

  // Ensure task has status defined
  const taskStatus =
    task.status ||
    (task.completed ? "completed" : !task.scheduled ? "unscheduled" : "todo");

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

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <Card
            className={cn(
              "bg-card border rounded-md shadow-sm transition-all cursor-pointer relative task-card",

              "transform transition-transform duration-200 ease-in-out hover:scale-[1.02]"
            )}
            onClick={() => onTaskClick(task)}
            data-task-id={task.id}
            data-task-status={taskStatus}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
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
                  <DropdownMenuContent align="end">
                    {" "}
                    {/* Stop propagation on content */}
                    {/* <DropdownMenuItem
                      className={task.scheduled ? "hidden" : ""}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop propagation
                        handleToggleSchedule(task.id);
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
                        {task.startTime
                          ? formatDate(task.startTime.toString())
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
                          <Image
                            src={user.profilePic}
                            alt={user.name}
                            className="h-full w-full object-cover"
                            width={20}
                            height={20}
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
        )}
      </Draggable>
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
          onTaskComplete={onToggleComplete}
        />
      )}
    </>
  );
};

export default KanbanTaskCard;
