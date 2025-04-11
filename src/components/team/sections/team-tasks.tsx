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
import { toast } from "sonner";

const initialMembers = [
  { id: 1, name: "John Doe", avatar: "JD" },
  { id: 2, name: "Jane Smith", avatar: "JS" },
  { id: 3, name: "Mike Johnson", avatar: "MJ" },
  { id: 4, name: "Sarah Wilson", avatar: "SW" },
  { id: 5, name: "Alex Chen", avatar: "AC" },
];

const mockTasks: TaskType[] = [
  {
    id: "1",
    title: "Update documentation",
    description: "Update the API documentation with new endpoints",
    priority: "high",
    category: "Documentation",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 120,
    status: "In Progress",
    assignedTo: [{ id: "1", name: "John Doe" }],
  },
  {
    id: "2",
    title: "Fix navigation bug",
    description: "Investigate and fix the navigation issues",
    priority: "medium",
    category: "Development",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 180,
    status: "Todo",
    assignedTo: [{ id: "2", name: "Jane Smith" }],
  },
  {
    id: "3",
    title: "Implement user authentication",
    description: "Add OAuth2 authentication flow",
    priority: "high",
    category: "Security",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 240,
    status: "Todo",
    assignedTo: [{ id: "3", name: "Mike Johnson" }],
  },
  {
    id: "4",
    title: "Optimize database queries",
    description: "Improve performance of main dashboard queries",
    priority: "medium",
    category: "Backend",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 160,
    status: "In Progress",
    assignedTo: [{ id: "4", name: "Sarah Wilson" }],
  },
  {
    id: "5",
    title: "Design system updates",
    description: "Update component library with new design tokens",
    priority: "low",
    category: "Design",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 90,
    status: "Review",
    assignedTo: [{ id: "5", name: "Alex Chen" }],
  },
  {
    id: "6",
    title: "Mobile responsiveness",
    description: "Fix responsive layout issues on mobile devices",
    priority: "high",
    category: "Frontend",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 150,
    status: "Todo",
    assignedTo: [{ id: "6", name: "Emily Brown" }],
  },
  {
    id: "7",
    title: "Unit test coverage",
    description: "Increase test coverage to 80%",
    priority: "medium",
    category: "Testing",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 200,
    status: "In Progress",
    assignedTo: [{ id: "7", name: "David Lee" }],
  },
  {
    id: "8",
    title: "API versioning",
    description: "Implement API versioning system",
    priority: "medium",
    category: "Backend",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 180,
    status: "Todo",
    assignedTo: [{ id: "8", name: "Lisa Wang" }],
  },
  {
    id: "9",
    title: "Performance monitoring",
    description: "Set up application performance monitoring",
    priority: "low",
    category: "DevOps",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 140,
    status: "Review",
    assignedTo: [{ id: "9", name: "Tom Anderson" }],
  },
  {
    id: "10",
    title: "Security audit",
    description: "Conduct security vulnerability assessment",
    priority: "high",
    category: "Security",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 300,
    status: "Todo",
    assignedTo: [{ id: "10", name: "Rachel Kim" }],
  },
  {
    id: "11",
    title: "Code refactoring",
    description: "Refactor legacy code modules",
    priority: "medium",
    category: "Development",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 240,
    status: "In Progress",
    assignedTo: [{ id: "11", name: "Chris Martin" }],
  },
  {
    id: "12",
    title: "User feedback integration",
    description: "Implement user feedback collection system",
    priority: "low",
    category: "Frontend",
    completed: false,
    scheduled: true,
    date: new Date(),
    parentId: null,
    resources: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 160,
    status: "Todo",
    assignedTo: [{ id: "12", name: "Anna White" }],
  },
];

// Add a function to check if a user is assigned
const isUserAssigned = (task: TaskType, userId: number) => {
  return task.assignedTo?.some((user) => user.id === userId.toString());
};

const TaskStatusOptions = [
  { label: "Todo", value: "todo", icon: Circle },
  { label: "In Progress", value: "in-progress", icon: Check },
  { label: "Completed", value: "completed", icon: CheckCircle2 },
];

interface TeamTasksProps {
  limit?: number;
  compact?: boolean;
}

const columns: ColumnDef<TaskType>[] = [
  {
    accessorKey: "title",
    header: "Task",
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
    header: "Assignee",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground hidden md:block" />
        {row.original.assignedTo?.[0]?.name || "Unassigned"}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
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
        <span className="capitalize">{row.original.priority}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
  },
  {
    accessorKey: "date",
    header: "Due Date",
    cell: ({ row }) =>
      row.original.date ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(row.original.date).toLocaleDateString()}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No date set</span>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

      const handleStatusChange = (status: string) => {
        toast.success(`Task "${task.title}" status updated to ${status}`);
      };

      const handleAssign = (userId: string) => {
        // Add user to assignees if not already assigned
        if (!isUserAssigned(task, Number(userId))) {
          toast.success(`User assigned to task "${task.title}"`);
        }
      };

      const handleUnassign = (userId: string) => {
        toast.success(`User unassigned from task "${task.title}"`);
      };

      const handleClearAssignees = () => {
        toast.success(`All assignees removed from task "${task.title}"`);
      };

      const handlePriorityChange = (priority: "high" | "medium" | "low") => {
        toast.success(`Task priority changed to ${priority}`);
      };

      const handleEdit = () => {
        toast.success("Opening task edit modal");
      };

      const handleDelete = () => {
        toast.error("Task deleted");
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Status Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Check className="mr-2 h-4 w-4" />
                Change Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                {TaskStatusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                  >
                    <status.icon className="mr-2 h-4 w-4" />
                    {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Updated Assignment Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <User2 className="mr-2 h-4 w-4" />
                Assignees
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Current Assignees ({task.assignedTo?.length || 0})
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
                      Remove All
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No assignees
                  </div>
                )}
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Add Assignee
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
            </DropdownMenuSub>

            {/* Priority Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tag className="mr-2 h-4 w-4" />
                Set Priority
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem onClick={() => handlePriorityChange("high")}>
                  <Circle className="mr-2 h-4 w-4 text-red-500" />
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePriorityChange("medium")}
                >
                  <Circle className="mr-2 h-4 w-4 text-yellow-500" />
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityChange("low")}>
                  <Circle className="mr-2 h-4 w-4 text-green-500" />
                  Low Priority
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const TeamTasks = ({ limit, compact = false }: TeamTasksProps) => {
  const tasks = limit ? mockTasks.slice(0, limit) : mockTasks;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Team Tasks</CardTitle>
            <CardDescription>{mockTasks.length} active tasks</CardDescription>
          </div>
          {!compact && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={tasks} searchKey="title" />
      </CardContent>
    </Card>
  );
};

export default TeamTasks;
