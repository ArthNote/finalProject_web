import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProjects,
  getProject,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
} from "@/lib/api/projects";
import { SortBy, SortOrder } from "@/types/projectTypes";
import { CreateProjectData, UpdateProjectData } from "@/types/project";

interface ProjectFilters {
  search?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export function useProjects(filters?: ProjectFilters) {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["projects", filters],
    queryFn: () => getProjects(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectData) => createProjectApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      updateProjectApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update project"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    },
  });

  const useProject = (id: string) =>
    useQuery({
      queryKey: ["project", id],
      queryFn: () => getProject(id),
    });

  return {
    data: data?.data || [],
    error,
    isLoading,
    createProject: createMutation.mutate,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
    useProject,
  };
}
