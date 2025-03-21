import { CreateTaskResponse, TaskType } from "@/types/task";
import { consts } from "../constants";


// Create a new task
export async function createManualTask(
  taskData: TaskType
): Promise<CreateTaskResponse> {
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
