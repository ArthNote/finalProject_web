import { useEffect, useState } from "react";
import { TaskFilterParams, TaskType } from "@/types/task";
import { getTasks } from "@/lib/api/tasks";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Interface for organized tasks
export interface OrganizedTasks {
  todo: TaskType[];
  completed: TaskType[];
  unscheduled: TaskType[];
  inprogress: TaskType[];
  todoTotal: number;
  completedTotal: number;
  unscheduledTotal: number;
  inprogressTotal: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// Interface for pagination state
export interface TaskPaginationState {
  todoPage: number;
  completedPage: number;
  unscheduledPage: number;
  inprogressPage: number;
  pageSize: number;
}

// Hook to use task data with pagination and filtering
export function useTasks(
  filterParams: Omit<
    TaskFilterParams,
    | "todoPage"
    | "todoLimit"
    | "completedPage"
    | "completedLimit"
    | "unscheduledPage"
    | "unscheduledLimit"
    | "inprogressPage"
    | "inprogressLimit"
  >,
  pagination: TaskPaginationState,
  setPagination: React.Dispatch<React.SetStateAction<TaskPaginationState>>
): OrganizedTasks {
  // Create complete filter params with pagination
  const completeFilterParams: TaskFilterParams = {
    ...filterParams,
    todoPage: pagination.todoPage,
    todoLimit: pagination.pageSize,
    completedPage: pagination.completedPage,
    completedLimit: pagination.pageSize,
    unscheduledPage: pagination.unscheduledPage,
    unscheduledLimit: pagination.pageSize,
    inprogressPage: pagination.inprogressPage,
    inprogressLimit: pagination.pageSize,
  };

  // Track locally accumulated tasks
  const [localTasks, setLocalTasks] = useState<{
    todo: TaskType[];
    completed: TaskType[];
    unscheduled: TaskType[];
    inprogress: TaskType[];
  }>({
    todo: [],
    completed: [],
    unscheduled: [],
    inprogress: [],
  });

  // Use React Query to fetch tasks
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks", completeFilterParams],
    queryFn: () => getTasks(completeFilterParams),
    placeholderData: keepPreviousData,
  });

  // Reset pagination when filters change (excluding pagination changes)
  useEffect(() => {
    setPagination({
      todoPage: 1,
      completedPage: 1,
      unscheduledPage: 1,
      inprogressPage: 1,
      pageSize: pagination.pageSize,
    });
    // We're deliberately excluding pagination values from the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterParams.search,
    filterParams.category,
    filterParams.scheduled,
    filterParams.priority,
    filterParams.dateRange,
    setPagination,
  ]);

  // Update local tasks whenever data changes
  useEffect(() => {
    if (data) {
      if (pagination.todoPage === 1) {
        // Reset todo tasks when filters change or on first page
        setLocalTasks((prev) => ({ ...prev, todo: data.todo }));
      } else {
        // Append new todo tasks when loading more, avoiding duplicates
        const existingIds = new Set(localTasks.todo.map((task) => task.id));
        const newTasks = data.todo.filter((task) => !existingIds.has(task.id));
        setLocalTasks((prev) => ({
          ...prev,
          todo: [...prev.todo, ...newTasks],
        }));
      }

      if (pagination.completedPage === 1) {
        // Reset completed tasks when filters change or on first page
        setLocalTasks((prev) => ({ ...prev, completed: data.completed }));
      } else {
        // Append new completed tasks when loading more, avoiding duplicates
        const existingIds = new Set(
          localTasks.completed.map((task) => task.id)
        );
        const newTasks = data.completed.filter(
          (task) => !existingIds.has(task.id)
        );
        setLocalTasks((prev) => ({
          ...prev,
          completed: [...prev.completed, ...newTasks],
        }));
      }

      if (pagination.unscheduledPage === 1) {
        // Reset unscheduled tasks when filters change or on first page
        setLocalTasks((prev) => ({ ...prev, unscheduled: data.unscheduled }));
      } else {
        // Append new unscheduled tasks when loading more, avoiding duplicates
        const existingIds = new Set(
          localTasks.unscheduled.map((task) => task.id)
        );
        const newTasks = data.unscheduled.filter(
          (task) => !existingIds.has(task.id)
        );
        setLocalTasks((prev) => ({
          ...prev,
          unscheduled: [...prev.unscheduled, ...newTasks],
        }));
      }

      if (pagination.inprogressPage === 1) {
        // Reset in-progress tasks when filters change or on first page
        setLocalTasks((prev) => ({
          ...prev,
          inprogress: data.inprogress || [],
        }));
      } else {
        // Append new in-progress tasks when loading more, avoiding duplicates
        const existingIds = new Set(
          localTasks.inprogress.map((task) => task.id)
        );
        const newTasks = (data.inprogress || []).filter(
          (task) => !existingIds.has(task.id)
        );
        setLocalTasks((prev) => ({
          ...prev,
          inprogress: [...prev.inprogress, ...newTasks],
        }));
      }
    }
  }, [
    data,
    pagination.todoPage,
    pagination.completedPage,
    pagination.unscheduledPage,
    pagination.inprogressPage,
  ]);

  // Return organized tasks with metadata
  return {
    ...localTasks,
    todoTotal: data?.todoTotal || 0,
    completedTotal: data?.completedTotal || 0,
    unscheduledTotal: data?.unscheduledTotal || 0,
    inprogressTotal: data?.inprogressTotal || 0,
    isLoading,
    isError,
    refetch,
  };
}

// Helper function to check if there are more tasks to load
export function hasMoreTasks(
  totalItems: number,
  currentPage: number,
  pageSize: number
): boolean {
  return totalItems > currentPage * pageSize;
}

// Helper to increment page for "Load More" functionality
export function getNextPage(currentPage: number): number {
  return currentPage + 1;
}
