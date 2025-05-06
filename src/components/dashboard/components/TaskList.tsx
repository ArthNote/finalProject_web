import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { TaskType } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTodaysTasks } from "@/lib/api/tasks";

const TaskList = () => {
  const t = useTranslations("dashboard.tasks");
  const queryClient = useQueryClient();

  // Get today's tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["todayTasks"],
    queryFn: getTodaysTasks,
  });

  // Handle task completion toggle
  const toggleMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // Replace with actual API call
      console.log("Toggling task:", taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggleComplete = (taskId: string) => {
    toggleMutation.mutate(taskId);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
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

  // Format time from ISO string
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return format(date, "h:mm a");
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Check className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">{t("noTasks.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("noTasks.description")}
        </p>
        <Button className="mt-4 gap-2">
          {t("noTasks.button")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Sort tasks by time and priority
  const sortedTasks = [...tasks.data].sort((a, b) => {
    const timeA = a.startTime ? new Date(a.startTime).getTime() : Infinity;
    const timeB = b.startTime ? new Date(b.startTime).getTime() : Infinity;

    // Time comes first
    if (timeA !== timeB) return timeA - timeB;

    // Then priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityA =
      priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
    const priorityB =
      priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;

    return priorityA - priorityB;
  });

  return (
    <ScrollArea className="h-[320px] pr-4">
      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start p-2 rounded-md hover:bg-accent/50 transition-colors ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            {/* <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleToggleComplete(task.id)}
              className="mt-1 mr-3"
            /> */}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4
                  className={`font-medium text-sm ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </h4>

                <div className="flex items-center gap-1">
                  {task.priority === "urgent" && (
                    <Badge variant="destructive" className="text-[10px] h-5">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t("urgent")}
                    </Badge>
                  )}
                  {task.startTime && (
                    <Badge variant="outline" className="text-[10px] h-5 gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(task.startTime.toString())}
                    </Badge>
                  )}
                  <div
                    className={`${getPriorityColor(
                      task.priority
                    )} h-2 w-2 rounded-full`}
                  />
                </div>
              </div>

              {task.description && (
                <p className="text-xs mt-0.5 text-muted-foreground truncate">
                  {task.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TaskList;
