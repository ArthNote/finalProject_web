export interface TaskType {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  completed: boolean;
  scheduled: boolean;
  date: Date | null; // Date can be null if not scheduled
  parentId?: string; // Optional parent task ID for sub-tasks
  resources: TaskResources[]; // Array of resource IDs
  startTime: Date | null; // Start time ISO string
  endTime: Date | null; // End time ISO string
  duration?: number; // Duration in minutes
  tags?: string[];
  status?: string; // Added status field for kanban view
  order?: number; // Added order field for kanban sorting
  assignedTo?: string[]; // Array of user IDs for task assignment
}

export interface TaskResources {
  id: string;
  name: string;
  type: string;
  category: "file" | "link" | "note";
  url?: string;
}

export interface CreateTaskResponse {
  message: string;
  success: boolean;
}