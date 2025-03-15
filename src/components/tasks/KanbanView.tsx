import React from "react";
import { Plus, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const KanbanView = () => {
  // Sample board data
  const columns = [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Project proposal",
          description: "Finalize the Q3 marketing proposal",
          priority: "high",
          category: "Work",
          dueDate: "2023-06-15T14:00",
        },
        {
          id: "2",
          title: "Update website content",
          description: "Refresh the about page with new team photos",
          priority: "medium",
          category: "Website",
          dueDate: "2023-06-18T12:00",
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        {
          id: "3",
          title: "Email client follow-up",
          description: "Send progress update to client",
          priority: "high",
          category: "Client",
          dueDate: "2023-06-14T16:00",
        },
        {
          id: "4",
          title: "Weekly team meeting",
          description: "Prepare agenda for Monday's meeting",
          priority: "medium",
          category: "Meetings",
          dueDate: "2023-06-16T10:00",
        },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      tasks: [
        {
          id: "5",
          title: "Create social media assets",
          description: "Design graphics for upcoming campaign",
          priority: "low",
          category: "Marketing",
          dueDate: "2023-06-12T17:00",
        },
      ],
    },
  ];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-base">Kanban Board</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col border rounded-lg bg-muted/30"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-medium text-sm flex items-center gap-2">
                {column.title}
                <Badge variant="secondary">{column.tasks.length}</Badge>
              </h4>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-3 flex-1 min-h-[30vh]">
              {column.tasks.length === 0 ? (
                <div className="h-20 flex items-center justify-center border-2 border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground">No tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-card border rounded-md p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          />
                          <h5 className="font-medium text-sm line-clamp-1">
                            {task.title}
                          </h5>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Move</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-xs bg-secondary/30"
                        >
                          {task.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button variant="ghost" size="sm" className="w-full mt-2">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanView;
