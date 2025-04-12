import { consts } from "../constants";
import {
  ProjectResponse,
  ProjectListResponse,
  CreateProjectData,
  UpdateProjectData,
} from "@/types/project";

export async function getProjects(params?: {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ProjectListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const response = await fetch(
      `${consts.backend}/projects?${queryParams.toString()}`,
      {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function getProject(id: string): Promise<ProjectResponse> {
  try {
    const response = await fetch(`${consts.backend}/projects/${id}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

export async function createProject(
  data: CreateProjectData
): Promise<ProjectResponse> {
  try {
    const response = await fetch(`${consts.backend}/projects`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(
  id: string,
  data: UpdateProjectData
): Promise<ProjectResponse> {
  try {
    const response = await fetch(`${consts.backend}/projects/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${consts.backend}/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete project");
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
