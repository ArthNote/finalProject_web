import React, { useState } from "react";
import {
  Check,
  Clock,
  Calendar,
  MoreHorizontal,
  Star,
  AlertCircle,
  Tag,
  Plus,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Sample task data
const sampleTasks = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finalize the Q3 marketing proposal for client review",
    priority: "high",
    dueDate: "2023-06-15T14:00",
    completed: false,
    category: "Work",
    tags: ["client", "proposal"],
    scheduled: true,
  },
  {
    id: "2",
    title: "Weekly team meeting",
    description: "Discuss progress on ongoing projects and assign new tasks",
    priority: "medium",
    dueDate: "2023-06-14T10:00",
    completed: false,
    category: "Meetings",
    tags: ["team", "weekly"],
    scheduled: true,
  },
  {
    id: "3",
    title: "Update portfolio website",
    description: "Add recent projects and update skills section",
    priority: "low",
    dueDate: "2023-06-20T23:59",
    completed: false,
    category: "Personal",
    tags: ["website", "portfolio"],
    scheduled: false,
  },
  {
    id: "4",
    title: "Schedule dentist appointment",
    description: "Call Dr. Smith for annual checkup",
    priority: "medium",
    dueDate: "2023-06-18T12:00",
    completed: true,
    category: "Health",
    tags: ["appointment", "health"],
    scheduled: true,
  },
  {
    id: "5",
    title: "Prepare presentation slides",
    description: "Create slides for the upcoming conference",
    priority: "high",
    dueDate: "2023-06-16T17:00",
    completed: false,
    category: "Work",
    tags: ["presentation", "conference"],
    scheduled: false,
  },
];

const ListView = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduledFilter, setScheduledFilter] = useState("all"); // "all", "scheduled", "unscheduled"
  const [tasksOpen, setTasksOpen] = useState({
    todo: true,
    completed: true,
  });

  // Count tasks by status
  const todoTasksCount = tasks.filter((task) => !task.completed).length;
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const unscheduledTasksCount = tasks.filter(
    (task) => !task.scheduled && !task.completed
  ).length;

  // Filter tasks based on search query, category, and scheduled status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;

    const matchesScheduledStatus =
      scheduledFilter === "all" ||
      (scheduledFilter === "scheduled" && task.scheduled) ||
      (scheduledFilter === "unscheduled" && !task.scheduled);

    return matchesSearch && matchesCategory && matchesScheduledStatus;
  });

  const todoTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleToggleScheduled = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, scheduled: !task.scheduled } : task
      )
    );
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

  // Get unique categories from tasks
  const categories = ["all", ...new Set(tasks.map((task) => task.category))];

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={scheduledFilter} onValueChange={setScheduledFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Task Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="unscheduled">Unscheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Unscheduled Tasks Section - Only show when there are unscheduled tasks */}
      {unscheduledTasksCount > 0 && scheduledFilter !== "scheduled" && (
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between border-b pb-2">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <h3 className="font-medium text-base">Unscheduled</h3>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                >
                  {unscheduledTasksCount}
                </Badge>
                <ChevronDown className="h-4 w-4 transition-transform" />
              </div>
            </CollapsibleTrigger>
            <Select defaultValue="priority">
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Sort by Priority</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CollapsibleContent>
            <div className="space-y-3 mt-3">
              {todoTasks
                .filter((task) => !task.scheduled)
                .map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start gap-3 p-4 border rounded-lg hover:shadow-sm transition-all bg-card"
                  >
                    {/* Priority indicator */}
                    <div className="mt-1.5 flex flex-col items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      />
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                      />
                    </div>

                    {/* Task details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-base truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge
                            variant="outline"
                            className="bg-secondary/50 h-6"
                          >
                            {task.category}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleScheduled(task.id)}
                              >
                                Schedule Task
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>Set Priority</DropdownMenuItem>
                              <DropdownMenuItem>
                                Add to Calendar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleToggleScheduled(task.id)}
                        >
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          Schedule
                        </Button>

                        {task.tags?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            {task.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs px-1.5 py-0.5 bg-muted rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Todo Tasks Section */}
      <Collapsible
        open={tasksOpen.todo}
        onOpenChange={(open) => setTasksOpen({ ...tasksOpen, todo: open })}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <h3 className="font-medium text-base">To Do</h3>
              <Badge variant="secondary">
                {scheduledFilter === "unscheduled"
                  ? 0
                  : todoTasks.filter((t) => t.scheduled).length}
              </Badge>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  tasksOpen.todo ? "rotate-0" : "-rotate-90"
                }`}
              />
            </div>
          </CollapsibleTrigger>
          <Select defaultValue="priority">
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Sort by Priority</SelectItem>
              <SelectItem value="date">Sort by Due Date</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CollapsibleContent>
          <div className="space-y-3 mt-3">
            {todoTasks.filter(
              (task) => scheduledFilter !== "unscheduled" && task.scheduled
            ).length === 0 ? (
              <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                <p className="text-muted-foreground">
                  {scheduledFilter === "scheduled"
                    ? "No scheduled tasks to do. Schedule some tasks to get started!"
                    : "No tasks to do. Create a new task to get started!"}
                </p>
              </div>
            ) : (
              todoTasks
                .filter(
                  (task) => scheduledFilter !== "unscheduled" && task.scheduled
                )
                .map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start gap-3 p-4 border rounded-lg hover:shadow-sm transition-all bg-card"
                  >
                    {/* Priority indicator */}
                    <div className="mt-1.5 flex flex-col items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      />
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                      />
                    </div>

                    {/* Task details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-base truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge
                            variant="outline"
                            className="bg-secondary/50 h-6"
                          >
                            {task.category}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleScheduled(task.id)}
                              >
                                Unschedule Task
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>Set Priority</DropdownMenuItem>
                              <DropdownMenuItem>
                                Add to Calendar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>

                        {task.tags?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            {task.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs px-1.5 py-0.5 bg-muted rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Completed Tasks Section */}
      <Collapsible
        open={tasksOpen.completed}
        onOpenChange={(open) => setTasksOpen({ ...tasksOpen, completed: open })}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <h3 className="font-medium text-base">Completed</h3>
              <Badge variant="secondary">{completedTasksCount}</Badge>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  tasksOpen.completed ? "rotate-0" : "-rotate-90"
                }`}
              />
            </div>
          </CollapsibleTrigger>
          {completedTasks.length > 0 && (
            <Button variant="ghost" size="sm">
              Clear All
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="space-y-2 mt-3">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8 bg-muted/40 border border-dashed rounded-md">
                <p className="text-muted-foreground">No completed tasks yet.</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start gap-3 p-3 border rounded-lg bg-muted/50"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task.id)}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm text-muted-foreground line-through truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 opacity-50">
                        <Badge
                          variant="outline"
                          className="bg-secondary/30 h-6"
                        >
                          {task.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>
                          Completed on {formatDate(new Date().toISOString())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ListView;
