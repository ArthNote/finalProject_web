import { CrudTaskResponse, TaskFilterParams, TaskType } from "@/types/task";
import { consts } from "../constants";

export async function createManualTask(
  taskData: TaskType
): Promise<CrudTaskResponse> {
  try {
    const response = await fetch(`${consts.backend}/tasks/manual`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function getTasks(params: TaskFilterParams): Promise<{
  todo: TaskType[];
  completed: TaskType[];
  unscheduled: TaskType[];
  inprogress: TaskType[];
  todoTotal: number;
  completedTotal: number;
  unscheduledTotal: number;
  inprogressTotal: number;
}> {
  try {
    const queryParams = new URLSearchParams();

    // Add all filter parameters
    if (params.search) queryParams.append("search", params.search);
    if (params.category && params.category !== "all")
      queryParams.append("category", params.category);
    if (params.scheduled && params.scheduled !== "all")
      queryParams.append("scheduled", params.scheduled);
    if (params.priority && params.priority !== "all")
      queryParams.append("priority", params.priority);

    // Add date range parameters if present
    if (params.dateRange?.from)
      queryParams.append("dateFrom", params.dateRange.from.toISOString());
    if (params.dateRange?.to)
      queryParams.append("dateTo", params.dateRange.to.toISOString());

    // Add pagination parameters for each section
    if (params.todoPage)
      queryParams.append("todoPage", params.todoPage.toString());
    if (params.todoLimit)
      queryParams.append("todoLimit", params.todoLimit.toString());

    if (params.completedPage)
      queryParams.append("completedPage", params.completedPage.toString());
    if (params.completedLimit)
      queryParams.append("completedLimit", params.completedLimit.toString());

    if (params.unscheduledPage)
      queryParams.append("unscheduledPage", params.unscheduledPage.toString());
    if (params.unscheduledLimit)
      queryParams.append(
        "unscheduledLimit",
        params.unscheduledLimit.toString()
      );

    // Add pagination parameters for in-progress tasks
    if (params.inprogressPage)
      queryParams.append("inprogressPage", params.inprogressPage.toString());
    if (params.inprogressLimit)
      queryParams.append("inprogressLimit", params.inprogressLimit.toString());

    const response = await fetch(
      `${consts.backend}/tasks?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function deleteTask(taskId: string): Promise<CrudTaskResponse> {
  try {
    const response = await fetch(`${consts.backend}/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export async function updateTask(data: {
  taskId: string;
  taskData: Partial<TaskType>;
}): Promise<CrudTaskResponse> {
  const { taskId, taskData } = data;
  try {
    const response = await fetch(`${consts.backend}/tasks/${taskId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}
