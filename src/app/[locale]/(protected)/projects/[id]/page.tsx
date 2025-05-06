"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, set } from "date-fns";
import {
  CalendarDays,
  Users,
  Clock,
  Circle,
  MoreHorizontal,
  Check,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TaskType } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ListTodo,
  Users2,
  FileText,
  Activity,
  BrainCircuit,
  Keyboard,
  Mic,
  Sparkles,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CreateTaskSheet from "@/components/tasks/CreateTaskSheet";
import AiTasksSheet from "@/components/tasks/AiTasksSheet";
import { enUS, fr, is } from "date-fns/locale";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { useRouter } from "@/i18n/navigation";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { ErrorState } from "@/components/error_state";
import ProjectLoadingPage from "./loading";
import { useState } from "react";
import EditTaskSheet from "@/components/tasks/EditTaskSheet";
import {
  updateTaskCompleteStatus,
  updateTaskPriority,
  updateTaskStatus,
} from "@/lib/api/tasks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import TaskDetailsSheet from "@/components/tasks/side_calendar/TaskDetailsSheet";
import { updateProject } from "@/lib/api/projects";

export default function ProjectDetailsPage() {
  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] =
    React.useState(false);
  const [isEditTaskSheetOpen, setIsEditTaskSheetOpen] = React.useState(false);
  const [isAiTasksSheetOpen, setIsAiTasksSheetOpen] = React.useState(false);
  const [aiTaskInput, setAiTaskInput] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [taskToEdit, setTaskToEdit] = React.useState<TaskType | null>(null);

  // Toggle recording state
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording (replace with actual voice recording logic)
      setTimeout(() => {
        setAiTaskInput("Schedule a team meeting for project review");
        setIsRecording(false);
      }, 2000);
    }
  };

  // Handle closing the AiTasksSheet
  const handleAiTasksSheetOpenChange = (open: boolean) => {
    setIsAiTasksSheetOpen(open);
    if (!open) {
      setAiTaskInput("");
    }
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id.replace("project-", "");
  const t = useTranslations("Projects");
  const locale = useLocale() as "en" | "fr";
  const { useProject, deleteProject } = useProjects();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useProject(id as string);

  const queryClient = useQueryClient();

  const { mutate: updatePriority } = useMutation({
    mutationFn: updateTaskPriority,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["projects"], type: "active" }),
        queryClient.refetchQueries({
          queryKey: ["project", id],
          type: "active",
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

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (params: { id: string; status: string }) => {
      const result = await updateTaskStatus(params);
      // After updating task status, update project progress
      const newProgress =
        taskStats.total > 0
          ? Math.round((taskStats.completed / taskStats.total) * 100)
          : 0;
      // console.log("New progress: ", newProgress);
      // await updateProject(project.id, {
      //   progress: newProgress,
      // });
      return result;
    },
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["projects"], type: "active" }),
        queryClient.refetchQueries({
          queryKey: ["project", id],
          type: "active",
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

  const { mutate: updateCompleteStatus } = useMutation({
    mutationFn: updateTaskCompleteStatus,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
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

  // Rest of the component logic
  if (isLoading) {
    return <ProjectLoadingPage />;
  }

  if (error || !response?.data) {
    return (
      <ErrorState
        title={t("errorState.title")}
        description={t("errorState.description")}
        retryAction={refetch}
        action={t("errorState.action")}
      />
    );
  }

  const project = response.data;

  // Calculate task statistics
  const taskStats = {
    total: project.tasks.length,
    completed: project.tasks.filter((t) => t.completed).length,
    inProgress: project.tasks.filter(
      (t) => !t.completed && t.status === "inprogress"
    ).length,
    unscheduled: project.tasks.filter((t) => !t.completed && !t.scheduled)
      .length,
    todo: project.tasks.filter((t) => !t.completed && t.status === "todo")
      .length,
  };

  const progress =
    taskStats.total > 0
      ? Math.round((taskStats.completed / taskStats.total) * 100)
      : 0;

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
      accessorKey: "status",
      header: t("table.status"),
      filterFn: (row, _columnId, filterValue: string) => {
        const { completed, status } = row.original;
        if (filterValue === "completed") {
          return completed === true;
        }
        // for any other status, only show if not completed AND status matches
        return completed === false && status === filterValue;
      },
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            row.original.completed
              ? "border-green-500 text-green-500"
              : row.original.status === "inprogress"
              ? "border-blue-500 text-blue-500"
              : row.original.status === "review"
              ? "border-yellow-500 text-yellow-500"
              : "border-muted text-muted-foreground"
          )}
        >
          <Circle className="h-2 w-2 mr-1" fill="currentColor" />
          {row.original.completed
            ? t("status.completed")
            : t("status." + row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "priority",
      header: t("table.priority"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Circle
            className={`h-3 w-3 ${
              row.original.priority === "high"
                ? "text-red-500"
                : row.original.priority === "medium"
                ? "text-yellow-500"
                : row.original.priority === "urgent"
                ? "text-red-700"
                : "text-green-500"
            }`}
          />
          <span className="capitalize">
            {t("priority." + row.original.priority)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: t("table.dueDate"),
      cell: ({ row }) =>
        row.original.date ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {format(new Date(row.original.date), "MMM d, yyyy", {
              locale: locale === "fr" ? fr : enUS,
            })}
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

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>
                {t("table.viewTaskDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                {t("table.editTask")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {t("table.setPriority.title")}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange("low")}
                      disabled={task.priority === "low"}
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                        {t("priority.low")}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange("medium")}
                      disabled={task.priority === "medium"}
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2" />
                        {t("priority.medium")}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange("high")}
                      disabled={task.priority === "high"}
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                        {t("priority.high")}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePriorityChange("urgent")}
                      disabled={task.priority === "urgent"}
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-700 mr-2" />
                        {t("priority.urgent")}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {t("table.setStatus.title")}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("unscheduled")}
                      disabled={!task.scheduled}
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-slate-500 mr-2" />
                        {t("status.unscheduled")}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("todo")}
                      disabled={
                        !task.scheduled ||
                        (task.status === "todo" && !task.completed)
                      }
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
                        {t("status.todo")}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("inprogress")}
                      disabled={
                        !task.scheduled ||
                        (task.status === "inprogress" && !task.completed)
                      }
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-purple-500 mr-2" />
                        {t("status.inprogress")}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("completed")}
                      disabled={!task.scheduled || task.completed}
                    >
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                        {t("status.completed")}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="text-destructive"
              >
                {t("table.deleteTask")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Rest of the component logic

  // Modify the project data to include mock tasks
  const projectWithTasks = {
    ...project,
    tasks: project.tasks,
  };

  function getBadgeVariant(
    priority: string
  ): "destructive" | "secondary" | "default" {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
      case "urgent":
        return "destructive";
      default:
        return "default";
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      deleteProject(project.id);
      queryClient.refetchQueries({ queryKey: ["projects"], type: "all" });
      queryClient.invalidateQueries({ queryKey: ["projects"], type: "all" });
      queryClient.refetchQueries({
        queryKey: ["projects", project.id],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", project.id],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks-by-date"],
        type: "all",
      }),
        router.push("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-4 sm:p-0 space-y-6 h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            {/* Left Section: Project Info */}
            <div className="space-y-4 flex-1">
              <div className="space-y-1.5 w-fit">
                <div className="flex md:items-center gap-2 text-sm text-muted-foreground mb-1 flex-col md:flex-row w-fit">
                  <span>
                    {t("createdOn", {
                      date: format(new Date(project.createdAt), "MMM d, yyyy", {
                        locale: locale === "fr" ? fr : enUS,
                      }),
                    })}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {project.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex md:items-center gap-4 flex-col md:flex-row ">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      project.status === "completed"
                        ? "border-green-500 text-green-500"
                        : project.status === "active"
                        ? "border-blue-500 text-blue-500"
                        : project.status === "on-hold"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    <Circle className="h-2 w-2 mr-1" fill="currentColor" />
                    {t(`status.${project.status}`)}
                  </Badge>
                  <Badge variant={getBadgeVariant(project.priority)}>
                    {t(`priority.${project.priority}`)}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Right Section: Actions */}
            <div className="flex items-start gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>{" "}
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t("editProject.title")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    {t("deleteProject")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Project Timeline */}
          <div className="mt-6 flex md:items-center gap-4 text-sm flex-col md:flex-row">
            {project.startDate && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">{t("timeline")}</span>{" "}
                  <span className="font-medium">
                    {format(new Date(project.startDate), "MMM d", {
                      locale: locale === "fr" ? fr : enUS,
                    })}{" "}
                    -
                    {project.endDate
                      ? format(new Date(project.endDate), "MMM d, yyyy", {
                          locale: locale === "fr" ? fr : enUS,
                        })
                      : t("ongoing")}
                  </span>
                </div>
              </div>
            )}
            {project.startDate && project.endDate && (
              <>
                <span className="text-muted-foreground hidden md:flex">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {t("daysRemaining", {
                      count: Math.ceil(
                        (new Date(project.endDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      ),
                    })}
                  </span>
                </div>
              </>
            )}
          </div>
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">
                {t("projectProgress")}
              </span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-semibold tracking-tight">
                {taskStats.completed}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {t("completed")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-semibold tracking-tight">
                {taskStats.inProgress}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {t("inprogress")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-semibold tracking-tight">
                {taskStats.unscheduled}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {t("unscheduled")}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-semibold tracking-tight">
                {taskStats.todo}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {t("todo")}
              </p>
            </div>
          </div>
        </Card>
      </div>
      {/* Tasks Section */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between md:items-center mb-4 flex-col md:flex-row gap-4">
            <h2 className="text-xl font-semibold">{t("projectTasks")}</h2>{" "}
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
          </div>
          <DataTable columns={columns} data={project.tasks} searchKey="title" />
        </div>
      </Card>
      {/* Add the EditProjectDialog */}
      <EditProjectDialog
        project={project}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />{" "}
      <DeleteProjectDialog
        isDeleting={isDeleting}
        open={isDeleteDialogOpen}
        projectName={project.name}
        onConfirm={handleDelete}
        onOpenChange={setIsDeleteDialogOpen}
        key={project.id}
      />
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
        projectId={project.id}
      />
      {/* Create Task Sheet */}
      <CreateTaskSheet
        open={isCreateTaskSheetOpen}
        onOpenChange={setIsCreateTaskSheetOpen}
        projectId={project.id}
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
    </div>
  );
}
