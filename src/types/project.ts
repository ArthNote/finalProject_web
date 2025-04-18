export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  startDate?: Date;
  endDate?: Date;
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
  members: {
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }[];
  tasks: any[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  startDate?: Date;
  endDate?: Date;
  tags: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ProjectResponse {
  data: Project;
  message: string;
  success: boolean;
}

export interface ProjectListResponse {
  data: Project[];
  message: string;
  success: boolean;
}

export interface ProjectError {
  message: string;
  success: false;
}
