import { TaskType } from "@/types/task";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { format } from "date-fns";
import { useLocale } from "next-intl";
import { enUS, fr } from "date-fns/locale";

const TaskCard = ({
  task,
  getPriorityColor,
  onClick,
}: {
  task: TaskType;
  getPriorityColor: (priority: string) => string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const locale = useLocale() as "fr" | "en";
  return (
    <Card className="overflow-hidden cursor-pointer" onClick={onClick}>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {format(new Date(task.startTime || task.date!), "h:mm a", {
              locale: locale === "fr" ? fr : enUS,
            })}
          </span>
          <div
            className={`h-2 w-2 rounded-full ${
              task.priority === "high"
                ? "bg-red-500"
                : task.priority === "medium"
                ? "bg-amber-500"
                : "bg-green-500"
            }`}
          />
        </div>
        <CardTitle className="text-sm mt-1.5">{task.title}</CardTitle>
      </CardHeader>
      {(task.description || task.assignedTo?.length) && (
        <CardContent className="p-3 pt-0">
          {task.description && (
            <p className="text-xs text-muted-foreground mb-2">
              {task.description}
            </p>
          )}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {task.assignedTo[0].name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {task.assignedTo[0].name}
              </span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TaskCard;
