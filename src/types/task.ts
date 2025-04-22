import { Project } from "./project";

export interface TaskType {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  completed: boolean;
  scheduled: boolean;
  date: Date | null; // Date can be null if not scheduled
  parentId: string | null; // Optional parent task ID for sub-tasks
  resources: TaskResources[]; // Array of resource IDs
  startTime: Date | null; // Start time ISO string
  endTime: Date | null; // End time ISO string
  duration: number | null; // Changed to allow null values
  tags?: string[];
  status?: string; // Added status field for kanban view
  order?: number; // Added order field for kanban sorting
  assignedTo?: AssignedUser[]; // Changed to include user details
  projectId?: string;
  createdAt?: Date;
  teamId?: string;
  project?: {
    id: string;
    name: string;
    ownerId: string;
  };
}

export interface AssignedUser {
  id: string;
  name: string;
  profilePic?: string;
}

export interface TaskResources {
  id: string;
  name: string;
  type: string;
  category: "file" | "link" | "note";
  url?: string;
}

export interface CrudTaskResponse {
  message: string;
  success: boolean;
}

export interface GetAiTasksResponse extends CrudTaskResponse {
  data: TaskType[];
}

// New type for task filter parameters
export interface TaskFilterParams {
  search?: string;
  category?: string;
  scheduled?: string;
  priority?: string;
  dateRange?: {
    type: string;
    from?: Date;
    to?: Date;
  };
  todoPage?: number;
  todoLimit?: number;
  completedPage?: number;
  completedLimit?: number;
  unscheduledPage?: number;
  unscheduledLimit?: number;
  inprogressPage?: number;
  inprogressLimit?: number;
}
