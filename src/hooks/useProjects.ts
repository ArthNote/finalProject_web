import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  getProjects,
  getProject,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
} from "@/lib/api/projects";
import { SortBy, SortOrder } from "@/types/projectTypes";
import { CreateProjectData, UpdateProjectData } from "@/types/project";
import { toast } from "./use-toast";

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
  const t = useTranslations("Projects");

  const { data, error, isLoading } = useQuery({
    queryKey: ["projects", filters],
    queryFn: () => getProjects(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectData) => createProjectApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"], type: "all" });
      queryClient.refetchQueries({ queryKey: ["projects"], type: "all" });
    },
    onError: (error) => {},
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      updateProjectApi(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["project", data.data.id],
        type: "all",
      });
      queryClient.refetchQueries({
        queryKey: ["project", data.data.id],
        type: "all",
      });
    },
    onError: (error) => {},
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"], type: "all" });
      queryClient.refetchQueries({ queryKey: ["projects"], type: "all" });

      toast({
        title: t("toast.deleteSuccess.title"),
        description: t("toast.deleteSuccess.description"),
      });
    },
    onError: (error) => {
      toast({
        title: t("toast.deleteError.title"),
        description: t("toast.deleteError.description") + " " + error.message,
        variant: "destructive",
      });
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
