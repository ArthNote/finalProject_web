import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Check, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { TaskType } from "@/types/task";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";

interface GridViewCardProps {
  task: TaskType;
  setSelectedTask: (task: TaskType) => void;
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

const GridViewCard = ({
  task,
  setSelectedTask,
  handleToggleComplete,
  handleToggleScheduled,
}: GridViewCardProps) => {
  const t = useTranslations("tasks.gridView.card");
  const locale = useLocale() as "fr" | "en";
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a", {
      locale: locale === "fr" ? fr : enUS,
    });
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
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <div className="p-1 rounded-md hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleComplete(task.id);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t("markInComplete")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedTask(task)}
    >
      <div
        className={`h-1 w-full rounded-t-md ${getPriorityColor(task.priority)}`}
      ></div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm line-clamp-1">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="p-1 rounded-md hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete(task.id);
                }}
              >
                <Check className="h-4 w-4 mr-2" />
                {t("markComplete")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleScheduled(task.id);
                }}
              >
                <Clock className="h-4 w-4 mr-2" />
                {task.scheduled ? t("unschedule") : t("schedule")}
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
                {task.date
                  ? formatDate(task.date.toString())
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
  );
};

export default GridViewCard;
