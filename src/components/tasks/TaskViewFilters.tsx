import React, { useState } from "react";
import { Search, Filter, CalendarRange, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DateRangeType = {
  type: "none" | "today" | "tomorrow" | "week" | "custom";
  from: Date | undefined;
  to: Date | undefined;
};

interface TaskViewFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  scheduledFilter: string;
  setScheduledFilter: (scheduled: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  dateRange: DateRangeType;
  setDateRange: (dateRange: DateRangeType) => void;
  categories: string[];
  onFilterChange?: () => void;
}

const TaskViewFilters: React.FC<TaskViewFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  scheduledFilter,
  setScheduledFilter,
  priorityFilter,
  setPriorityFilter,
  dateRange,
  setDateRange,
  categories,
  onFilterChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Check if any filters are active
  const isFilterActive =
    categoryFilter !== "all" ||
    scheduledFilter !== "all" ||
    priorityFilter !== "all";

  const isDateFilterActive = dateRange.type !== "none";

  // Filter clearing
  const clearFilters = () => {
    setCategoryFilter("all");
    setPriorityFilter("all");
    setScheduledFilter("all");
    if (onFilterChange) onFilterChange();
  };

  // Date filter operations
  const clearDateFilter = () => {
    setDateRange({
      type: "none",
      from: undefined,
      to: undefined,
    });
    setIsCalendarOpen(false);
    if (onFilterChange) onFilterChange();
  };

  // Set date filters for today
  const setTodayFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setDateRange({
      type: "today",
      from: today,
      to: today,
    });
    setIsCalendarOpen(false);
    if (onFilterChange) onFilterChange();
  };

  // Set date filters for tomorrow
  const setTomorrowFilter = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    setDateRange({
      type: "tomorrow",
      from: tomorrow,
      to: tomorrow,
    });
    setIsCalendarOpen(false);
    if (onFilterChange) onFilterChange();
  };

  // Set date filters for this week
  const setThisWeekFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    const dayOfWeek = endOfWeek.getDay();
    const daysUntilEndOfWeek = 6 - dayOfWeek; // Until Sunday
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilEndOfWeek);
    endOfWeek.setHours(23, 59, 59, 999);

    setDateRange({
      type: "week",
      from: today,
      to: endOfWeek,
    });
    setIsCalendarOpen(false);
    if (onFilterChange) onFilterChange();
  };

  // Handle custom date range selection
  const handleCustomDateRange = (
    from: Date | undefined,
    to: Date | undefined
  ) => {
    if (!from) {
      clearDateFilter();
      return;
    }

    setDateRange({
      type: "custom",
      from,
      to: to || from,
    });
    if (onFilterChange) onFilterChange();
  };

  // Format the date range for display
  const formatDateRange = () => {
    switch (dateRange.type) {
      case "today":
        return "Today";
      case "tomorrow":
        return "Tomorrow";
      case "week":
        return "This Week";
      case "custom":
        if (
          dateRange.from &&
          dateRange.to &&
          dateRange.from.toDateString() === dateRange.to.toDateString()
        ) {
          return format(dateRange.from, "MMM d, yyyy");
        } else if (dateRange.from && dateRange.to) {
          return `${format(dateRange.from, "MMM d")} - ${format(
            dateRange.to,
            "MMM d, yyyy"
          )}`;
        } else if (dateRange.from) {
          return `From ${format(dateRange.from, "MMM d, yyyy")}`;
        }
        return "Custom Range";
      default:
        return "All Dates";
    }
  };

  // Get color for priority filter display
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

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onFilterChange) onFilterChange();
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Selector */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={isDateFilterActive ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-1.5",
                  isDateFilterActive && "bg-primary text-primary-foreground"
                )}
              >
                <CalendarRange className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{formatDateRange()}</span>
                {isDateFilterActive && (
                  <X
                    className="h-3.5 w-3.5 ml-1 hover:bg-background/20 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateFilter();
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Filter by date</h4>

                <div className="flex flex-col gap-2">
                  <Button
                    variant={dateRange.type === "today" ? "default" : "outline"}
                    size="sm"
                    onClick={setTodayFilter}
                    className="justify-start"
                  >
                    Today
                  </Button>
                  <Button
                    variant={
                      dateRange.type === "tomorrow" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={setTomorrowFilter}
                    className="justify-start"
                  >
                    Tomorrow
                  </Button>
                  <Button
                    variant={dateRange.type === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={setThisWeekFilter}
                    className="justify-start"
                  >
                    This Week
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Custom range</h4>
                  <Calendar
                    mode="range"
                    variant="compact"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      handleCustomDateRange(range?.from, range?.to);
                    }}
                    initialFocus
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant={isFilterActive ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-1.5",
                  isFilterActive && "bg-primary text-primary-foreground"
                )}
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filters</span>
                {isFilterActive && (
                  <span className="ml-1 rounded-full bg-primary-foreground text-primary w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {[
                      categoryFilter !== "all" ? 1 : 0,
                      priorityFilter !== "all" ? 1 : 0,
                      scheduledFilter !== "all" ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {isFilterActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={clearFilters}
                    >
                      <X className="mr-1 h-3 w-3" /> Clear all
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => {
                      setCategoryFilter(value);
                      if (onFilterChange) onFilterChange();
                    }}
                  >
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(value) => {
                      setPriorityFilter(value);
                      if (onFilterChange) onFilterChange();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={scheduledFilter}
                    onValueChange={(value) => {
                      setScheduledFilter(value);
                      if (onFilterChange) onFilterChange();
                    }}
                  >
                    <SelectTrigger>
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
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active filters display */}
      {(isFilterActive || isDateFilterActive) && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {categoryFilter !== "all" && (
            <Badge variant="secondary" className="px-2 flex gap-1 items-center">
              Category: {categoryFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setCategoryFilter("all");
                  if (onFilterChange) onFilterChange();
                }}
              />
            </Badge>
          )}
          {priorityFilter !== "all" && (
            <Badge variant="secondary" className="px-2 flex gap-1 items-center">
              <div
                className={`h-2 w-2 rounded-full mr-1 ${getPriorityColor(
                  priorityFilter
                )}`}
              />
              Priority: {priorityFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setPriorityFilter("all");
                  if (onFilterChange) onFilterChange();
                }}
              />
            </Badge>
          )}
          {scheduledFilter !== "all" && (
            <Badge variant="secondary" className="px-2 flex gap-1 items-center">
              Status:{" "}
              {scheduledFilter === "scheduled" ? "Scheduled" : "Unscheduled"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setScheduledFilter("all");
                  if (onFilterChange) onFilterChange();
                }}
              />
            </Badge>
          )}
          {isDateFilterActive && (
            <Badge variant="secondary" className="px-2 flex gap-1 items-center">
              Date: {formatDateRange()}
              <X className="h-3 w-3 cursor-pointer" onClick={clearDateFilter} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskViewFilters;
