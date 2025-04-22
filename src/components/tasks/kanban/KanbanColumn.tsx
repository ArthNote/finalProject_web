import React from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  LoaderCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TaskType } from "@/types/task";
import KanbanTaskCard from "./KanbanTaskCard";
import { Column } from "./types";
import { useLocale, useTranslations } from "next-intl";
import { Droppable } from "@hello-pangea/dnd";

interface KanbanColumnProps {
  column: Column;
  tasks: TaskType[];
  columns: Column[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onFilterByColumn: (columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onTaskClick: (task: TaskType) => void;
  onEditTask: (task: TaskType) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  handleTaskMove: (taskId: string, columnId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  columns,
  isLoading,
  hasMore,
  onLoadMore,
  onFilterByColumn,
  onAddTask,
  onDeleteColumn,
  onTaskClick,
  onEditTask,
  onToggleComplete,
  onDeleteTask,
  handleTaskMove,
}) => {
  const t = useTranslations("tasks.kanbanView");
  const locale = useLocale() as "en" | "fr";
  return (
    <div
      className={cn(
        "flex flex-col border rounded-lg transition-all bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {/* ... existing header code ... */}
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${column.color || "bg-gray-400"}`}
          ></div>
          <h4 className="font-medium text-sm flex items-center gap-2">
            {column.title}
            <Badge variant="secondary">{tasks.length}</Badge>
          </h4>
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterByColumn(column.id)}>
              <Filter className="h-3.5 w-3.5 mr-2" />
              {t("filterByColumn")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* Wrap the entire content area including placeholder in Droppable */}
      <Droppable droppableId={column.id} type="task" direction="vertical">
        {(provided, snapshot) => (
          <div
            className={cn(
              "p-3 flex-1 min-h-[50vh] flex flex-col space-y-3 transition-colors", // Added space-y-3 here
              snapshot.isDraggingOver ? "bg-muted/50" : ""
            )}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length === 0 ? (
              // Placeholder inside Droppable
              <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-md text-sm text-muted-foreground">
                {t("noTasksYet")}
              </div>
            ) : (
              // Task list inside Droppable
              <>
                {tasks.map((task, index) => (
                  <KanbanTaskCard
                    key={task.id}
                    task={task}
                    columns={columns}
                    index={index}
                    onTaskClick={onTaskClick}
                    onEditTask={onEditTask}
                    onToggleComplete={onToggleComplete}
                    onDeleteTask={onDeleteTask}
                    handleTaskMove={handleTaskMove}
                  />
                ))}
              </>
            )}

            {provided.placeholder}

            {/* Load More button - Place it after tasks or placeholder */}
            {tasks.length > 0 && hasMore && (
              <Button
                onClick={onLoadMore}
                variant="ghost"
                className="w-full text-muted-foreground mt-2" // Ensure margin top if needed
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  t("loadMore")
                )}
              </Button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
