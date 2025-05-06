"use client";

import { useState } from "react";
import type { TaskType } from "@/types/task";
import { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  User,
  MoreHorizontal,
  Calendar,
  Circle,
  Check,
  User2,
  CalendarRange,
  Tag,
  Edit,
  Trash,
  CheckCircle2,
  XCircle,
  X,
  BrainCircuit,
  Keyboard,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";

import { useTeam } from "../team-context";
import AiTasksSheet from "@/components/tasks/AiTasksSheet";
import CreateTaskSheet from "@/components/tasks/CreateTaskSheet";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTaskCompleteStatus,
  updateTaskPriority,
  updateTaskStatus,
} from "@/lib/api/tasks";
import { toast } from "@/hooks/use-toast";
import EditTaskSheet from "@/components/tasks/EditTaskSheet";
import TaskDetailsSheet from "@/components/tasks/side_calendar/TaskDetailsSheet";

const initialMembers = [
  { id: 1, name: "John Doe", avatar: "JD" },
  { id: 2, name: "Jane Smith", avatar: "JS" },
  { id: 3, name: "Mike Johnson", avatar: "MJ" },
  { id: 4, name: "Sarah Wilson", avatar: "SW" },
  { id: 5, name: "Alex Chen", avatar: "AC" },
];

// Add a function to check if a user is assigned
const isUserAssigned = (task: TaskType, userId: number) => {
  return task.assignedTo?.some((user) => user.id === userId.toString());
};

const TaskStatusOptions = [
  { label: "Todo", value: "todo", icon: Circle },
  { label: "In Progress", value: "inprogress", icon: Check },
  { label: "Completed", value: "completed", icon: CheckCircle2 },
];

interface TeamTasksProps {
  limit?: number;
  compact?: boolean;
}

const TeamTasks = ({ limit, compact = false }: TeamTasksProps) => {
  const t = useTranslations("team.tasks");
  const { team, orgId } = useTeam();
  const tasks = limit ? team.tasks.slice(0, limit) : team.tasks;
  const [isAiTasksSheetOpen, setIsAiTasksSheetOpen] = React.useState(false);
  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] =
    React.useState(false);
  const [aiTaskInput, setAiTaskInput] = React.useState("");
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [taskToEdit, setTaskToEdit] = React.useState<TaskType | null>(null);
  const [isEditTaskSheetOpen, setIsEditTaskSheetOpen] = React.useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const locale = useLocale() as "en" | "fr";

  const queryClient = useQueryClient();

  const { mutate: updatePriority } = useMutation({
    mutationFn: updateTaskPriority,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["team"], type: "all" }),
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

  const { mutate: updateCompleteStatus } = useMutation({
    mutationFn: updateTaskCompleteStatus,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["team"], type: "all" }),
      ]);
      toast({
        title:
          locale === "en"
            ? "Task status updated"
            : "Statut de la tâche mis à jour",
        description:
          locale === "en"
            ? "The task status has been updated successfully."
            : "Le statut de la tâche a été mis à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title:
          locale === "en"
            ? "Error updating task status"
            : "Erreur de mise à jour du statut de la tâche",
        description:
          locale === "en"
            ? "There was an error updating the task status."
            : "Il y a eu une erreur lors de la mise à jour du statut de la tâche.",
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = async (taskId: string) => {
    try {
      updateCompleteStatus(taskId);
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (params: { id: string; status: string }) => {
      const result = await updateTaskStatus(params);
      return result;
    },
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["team"], type: "all" }),
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

  const columns: ColumnDef<TaskType>[] = [
    {
      accessorKey: "title",
      header: t("table.task"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-1 hidden md:block">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: t("table.assignee"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.assignedTo && row.original.assignedTo.length > 0 ? (
            <div className="flex -space-x-2">
              {row.original.assignedTo.map((user, index) => (
                <div
                  key={user.id}
                  className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background"
                  title={user.name}
                >
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              ))}
            </div>
          ) : (
            <>
              <User className="h-4 w-4 text-muted-foreground hidden md:block" />
              {t("table.unassigned")}
            </>
          )}
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: t("table.priority.label"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Circle
            className={`h-3 w-3 ${
              row.original.priority === "high"
                ? "text-red-500"
                : row.original.priority === "medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          />
          <span className="capitalize">
            {t(`table.priority.${row.original.priority}`)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.status.label"),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {t(`table.status.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: t("table.dueDate"),
      cell: ({ row }) =>
        row.original.date ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(row.original.date).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            {t("table.noDateSet")}
          </span>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original;

        const handleStatusChange = (status: string) => {
          if (task.scheduled) {
            updateStatus({
              id: task.id,
              status: status,
            });
          } else {
            console.error("Task is not scheduled yet");
          }
        };

        const handlePriorityChange = (priority: string) => {
          updatePriority({
            id: task.id,
            priority: priority,
          });
        };

        const handleEdit = () => {
          setTaskToEdit(task);
          setIsEditTaskSheetOpen(true);
        };

        const handleViewDetails = () => {
          setSelectedTask(task);
          setDetailsSheetOpen(true);
        };

        const handleDelete = () => {
          setSelectedTask(task);
          setDetailsSheetOpen(true);
        };

        const isDisabled = (status: string) => {
          if (status === "unscheduled" && !task.scheduled) {
            return true;
          } else if (
            status === "todo" &&
            (!task.scheduled || (task.status === "todo" && !task.completed))
          ) {
            return true;
          } else if (
            status === "inprogress" &&
            (!task.scheduled ||
              (task.status === "inprogress" && !task.completed))
          ) {
            return true;
          } else if (
            status === "completed" &&
            (!task.scheduled || task.completed)
          ) {
            return true;
          } else {
            return false;
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                {t("table.viewTask")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                {t("table.editTask")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Status Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Check className="mr-2 h-4 w-4" />
                  {t("table.changeStatus")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  {TaskStatusOptions.map((status) => (
                    <DropdownMenuItem
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      disabled={isDisabled(status.value)}
                    >
                      <status.icon className="mr-2 h-4 w-4" />
                      {t(`table.status.${status.value}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Updated Assignment Submenu */}
              {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <User2 className="mr-2 h-4 w-4" />
                  {t("table.assignees")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t("table.currentAssignees", {
                        count: task.assignedTo?.length || 0,
                      })}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {task.assignedTo && task.assignedTo.length > 0 ? (
                    <>
                      {task.assignedTo.map((assignee) => (
                        <DropdownMenuItem
                          key={assignee.id}
                          onClick={() => handleUnassign(assignee.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs mr-2">
                                {assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span>{assignee.name}</span>
                            </div>
                            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleClearAssignees}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        {t("table.removeAll")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {t("table.noAssignees")}
                    </div>
                  )}
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t("table.addAssignee")}
                    </p>
                  </div>
                  {initialMembers
                    .filter((member) => !isUserAssigned(task, member.id))
                    .map((member) => (
                      <DropdownMenuItem
                        key={member.id}
                        onClick={() => handleAssign(member.id.toString())}
                      >
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs mr-2">
                            {member.avatar}
                          </div>
                          {member.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub> */}

              {/* Priority Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Tag className="mr-2 h-4 w-4" />
                  {t("table.setPriority.label")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  <DropdownMenuItem
                    onClick={() => handlePriorityChange("high")}
                    disabled={task.priority === "high"}
                  >
                    <Circle className="mr-2 h-4 w-4 text-red-500" />
                    {t("table.setPriority.high")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePriorityChange("medium")}
                    disabled={task.priority === "medium"}
                  >
                    <Circle className="mr-2 h-4 w-4 text-yellow-500" />
                    {t("table.setPriority.medium")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePriorityChange("low")}
                    disabled={task.priority === "low"}
                  >
                    <Circle className="mr-2 h-4 w-4 text-green-500" />
                    {t("table.setPriority.low")}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash className="mr-2 h-4 w-4" />
                {t("table.deleteTask")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>
                {t("description", { count: tasks.length })}
              </CardDescription>
            </div>
            {!compact && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>{t("newTask")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsAiTasksSheetOpen(true)}>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    {t("createWithAI")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsCreateTaskSheetOpen(true)}
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    {t("createManually")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tasks} searchKey="title" />
        </CardContent>
      </Card>
      {/* AI Tasks Sheet */}
      <AiTasksSheet
        open={isAiTasksSheetOpen}
        onOpenChange={(open) => {
          setIsAiTasksSheetOpen(open);
          if (!open) {
            setAiTaskInput("");
          }
        }}
        aiTaskInput={aiTaskInput}
        teamId={team.id}
        orgId={orgId}
      />
      {/* Create Task Sheet */}
      <CreateTaskSheet
        open={isCreateTaskSheetOpen}
        onOpenChange={setIsCreateTaskSheetOpen}
        teamId={team.id}
        orgId={orgId}
      />
      <EditTaskSheet
        open={isEditTaskSheetOpen}
        onOpenChange={setIsEditTaskSheetOpen}
        task={taskToEdit}
      />
      {/* TODO: make the logic for taskcomplete and task scheduled */}
      <TaskDetailsSheet
        task={detailsSheetOpen ? selectedTask : null}
        onOpenChange={setDetailsSheetOpen}
        onTaskComplete={handleToggleComplete}
        onTaskScheduled={() => {}}
      />
    </>
  );
};

export default TeamTasks;
