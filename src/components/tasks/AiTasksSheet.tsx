import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TaskType } from "@/types/task";
import { generateTasksWithAi, saveTasks } from "@/lib/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  CircleCheck,
  Clock,
  Edit,
  Flag,
  Loader2,
  MoreHorizontal,
  PenTool,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { count } from "console";

interface AiTasksSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiTaskInput: string;
}

const AiTasksSheet = ({
  open,
  onOpenChange,
  aiTaskInput,
}: AiTasksSheetProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("tasks.aiSheet");

  // State for storing and modifying AI-generated tasks
  const [generatedTasks, setGeneratedTasks] = useState<TaskType[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(aiTaskInput);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Create mutations for generating tasks with AI
  const generateTasksMutation = useMutation({
    mutationFn: generateTasksWithAi,
    onSuccess: (data) => {
      // Add unique IDs to each generated task
      const tasksWithIds = data.data.map((task) => ({
        ...task,
        id: `temp-${Math.random().toString(36).substring(2, 9)}`, // Generate a unique temporary ID
      }));
      setGeneratedTasks(tasksWithIds);
      setIsRegenerating(false);
      toast({
        title: t("toast.aiTasksGenerated.title"),
        description: t("toast.aiTasksGenerated.description"),
      });
    },
    onError: (error) => {
      setIsRegenerating(false);
      toast({
        title: t("toast.generateError.title"),
        description: t("toast.generateError.description"),
        variant: "destructive",
      });
    },
  });

  // Create a mutation for saving tasks in bulk
  const saveTasksMutation = useMutation({
    mutationFn: (tasks: TaskType[]) => saveTasks(tasks),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["tasks"], type: "all" });
      toast({
        title: t("toast.tasksCreated.title"),
        description: t("toast.tasksCreated.description"),
      });
      // Close the sheet after saving
      onOpenChange(false);
      // Clear state
      setGeneratedTasks([]);
      setPrompt("");
    },
    onError: () => {
      toast({
        title: t("toast.saveError.title"),
        description: t("toast.saveError.description"),
        variant: "destructive",
      });
    },
  });

  // Function to clear all data and close the sheet
  const clearData = () => {
    setGeneratedTasks([]);
    setEditingTaskId(null);
    setPrompt("");
    setIsRegenerating(false);
    toast({
      title: t("toast.tasksCleared.title"),
      description: t("toast.tasksCleared.description"),
    });
    // Close the sheet after clearing
    onOpenChange(false);
  };

  // Generate tasks when the sheet is opened with non-empty input
  useEffect(() => {
    if (open && aiTaskInput && aiTaskInput.trim() !== "") {
      setPrompt(aiTaskInput);
      generateTasksMutation.mutate(aiTaskInput);
    }
  }, [open, aiTaskInput]);

  // Handle task regeneration
  const handleRegenerate = () => {
    if (!prompt.trim()) return;
    setIsRegenerating(true);
    generateTasksMutation.mutate(prompt);
  };

  // Handle task editing with the specific task ID
  const handleEditTask = (taskToEdit: TaskType) => {
    setEditingTaskId(taskToEdit.id);
  };

  // Handle task update without exiting edit mode
  const handleUpdateTask = (updatedTask: TaskType) => {
    setGeneratedTasks(
      generatedTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  // Add a new function to save and exit edit mode
  const handleSaveEdit = () => {
    setEditingTaskId(null);
  };

  // Handle task deletion with the specific task ID
  const handleDeleteTask = (idToDelete: string) => {
    setGeneratedTasks(generatedTasks.filter((task) => task.id !== idToDelete));
  };

  // Handle saving all tasks in bulk
  const handleSaveAllTasks = () => {
    // Process each task to ensure dates are properly formatted
    const processedTasks = generatedTasks.map((task) => {
      const processedTask = { ...task };

      // Convert date string to Date object if it's a string
      if (typeof processedTask.date === "string") {
        processedTask.date = new Date(processedTask.date);
      }

      // Convert startTime string to Date object if it's a string
      if (typeof processedTask.startTime === "string") {
        processedTask.startTime = new Date(processedTask.startTime);
      }

      // Convert endTime string to Date object if it's a string
      if (typeof processedTask.endTime === "string") {
        processedTask.endTime = new Date(processedTask.endTime);
      }

      return processedTask;
    });

    // Save all tasks at once with processed date fields
    saveTasksMutation.mutate(processedTasks);
  };

  // Render a task card
  const renderTaskCard = (task: TaskType, index: number) => {
    const isEditing = editingTaskId === task.id;

    const priorityColor =
      {
        high: "bg-red-500",
        medium: "bg-amber-500",
        low: "bg-green-500",
      }[task.priority] || "bg-slate-500";

    if (isEditing) {
      return (
        <Card key={task.id} className="mb-4 border-primary/20">
          <CardHeader className="pb-2">
            <Input
              className="font-medium"
              value={task.title}
              onChange={(e) => {
                const updatedTask = { ...task, title: e.target.value };
                handleUpdateTask(updatedTask);
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4 pb-2">
            <Textarea
              className="min-h-[100px]"
              value={task.description}
              onChange={(e) => {
                const updatedTask = { ...task, description: e.target.value };
                handleUpdateTask(updatedTask);
              }}
            />
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[120px]">
                <Label htmlFor={`priority-${task.id}`}>{t("priority")}</Label>
                <Select
                  value={task.priority}
                  onValueChange={(value) => {
                    const updatedTask = {
                      ...task,
                      priority: value as "high" | "medium" | "low",
                    };
                    handleUpdateTask(updatedTask);
                  }}
                >
                  <SelectTrigger id={`priority-${task.id}`}>
                    <SelectValue placeholder={t("priority")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">{t("high")}</SelectItem>
                    <SelectItem value="medium">{t("medium")}</SelectItem>
                    <SelectItem value="low">{t("low")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label htmlFor={`category-${task.id}`}>{t("category")}</Label>
                <Input
                  id={`category-${task.id}`}
                  value={task.category}
                  onChange={(e) => {
                    const updatedTask = { ...task, category: e.target.value };
                    handleUpdateTask(updatedTask);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`scheduled-${task.id}`}
                checked={task.scheduled}
                onCheckedChange={(checked) => {
                  const updatedTask = {
                    ...task,
                    scheduled: checked as boolean,
                  };
                  handleUpdateTask(updatedTask);
                }}
              />
              <Label htmlFor={`scheduled-${task.id}`}>{t("scheduled")}</Label>
            </div>
          </CardContent>
          <CardFooter className="pt-2 justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingTaskId(null)}
              disabled={saveTasksMutation.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              {t("cancel")}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveEdit}
              disabled={saveTasksMutation.isPending}
            >
              <Save className="h-4 w-4 mr-1" />
              {t("save")}
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card key={task.id} className="mb-4">
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-medium">
              {task.title}
            </CardTitle>
            <CardDescription className="truncate">
              {task.category}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={saveTasksMutation.isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditTask(task)}>
                <Edit className="h-4 w-4 mr-2" />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-3 pb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${priorityColor}`} />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            {task.scheduled ? (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t("scheduled")}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-dashed"
              >
                <Clock className="h-3 w-3" />
                {t("unscheduled")}
              </Badge>
            )}
            {task.tags?.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl p-0 flex flex-col"
      >
        <div className="flex-1 overflow-hidden flex flex-col">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t("title")}
            </SheetTitle>
            <SheetDescription>{t("description")}</SheetDescription>

            <div className="mt-4 relative">
              <Textarea
                placeholder={t("fieldPlaceholder")}
                className="pr-10 min-h-[80px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={
                  generateTasksMutation.isPending || saveTasksMutation.isPending
                }
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  className="h-7 px-2"
                  onClick={clearData}
                  disabled={
                    generateTasksMutation.isPending ||
                    saveTasksMutation.isPending
                  }
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  className="h-7 px-2"
                  onClick={handleRegenerate}
                  disabled={
                    generateTasksMutation.isPending ||
                    !prompt.trim() ||
                    saveTasksMutation.isPending
                  }
                >
                  {generateTasksMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </SheetHeader>

          <Separator />

          <div className="p-6 pt-2 flex-1 overflow-hidden">
            {generateTasksMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">
                  {t("generatingTasks")}
                </p>
              </div>
            ) : generatedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">{t("noGeneratedTasks")}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  {t("noGeneratedTasksDescription")}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div>
                  {generatedTasks.map((task, index) =>
                    renderTaskCard(task, index)
                  )}
                </div>
              </ScrollArea>
            )}
          </div>

          <Separator />

          <SheetFooter className="p-6 pt-4">
            {generatedTasks.length > 0 && (
              <div className="flex w-full justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saveTasksMutation.isPending}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleSaveAllTasks}
                  className="flex-1"
                  disabled={
                    saveTasksMutation.isPending ||
                    generateTasksMutation.isPending
                  }
                >
                  {saveTasksMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("savingTasks", {
                        count: generatedTasks.length,
                      })}
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {t("saveTasks", {
                        count: generatedTasks.length,
                      })}
                    </>
                  )}
                </Button>
              </div>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AiTasksSheet;
