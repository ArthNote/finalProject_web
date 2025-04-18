"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Input } from "@/components/ui/input";
import { Grid2X2, List, Clock, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectsLoadingSkeleton } from "@/components/projects/ProjectSkeleton";
import { useProjects } from "@/hooks/useProjects";
import { FilterState, SortBy, ViewMode } from "@/types/projectTypes";
import { Project } from "@/types/project";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyState from "@/components/empty_state";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const t = useTranslations("Projects");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<FilterState>({
    status: "all",
    priority: "all",
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const {
    data: projects,
    isLoading,
    error,
  } = useProjects({
    search: searchQuery || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    priority: filters.priority === "all" ? undefined : filters.priority,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const handlePriorityChange = (value: string) => {
    setFilters((prev) => ({ ...prev, priority: value }));
  };

  const handleSortChange = (value: SortBy) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSortOrderToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];

    return projects.filter((project: Project) => {
      const matchesSearch =
        !searchQuery ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filters.status === "all" || project.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || project.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, searchQuery, filters.status, filters.priority]);

  const projectsWithProgress = React.useMemo(
    () =>
      filteredProjects.map((project) => {
        const total = project.tasks.length;
        const completed = project.tasks.filter((t) => t.completed).length;
        const computedProgress =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        // override the server‐side progress with computedProgress
        return { ...project, progress: computedProgress };
      }),
    [filteredProjects]
  );

  return (
    <div className="p-4 sm:p-0 space-y-6 max-w-[100vw] h-[calc(100vh-4rem)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <CreateProjectDialog />
      </div>

      {/* Search and filters section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="w-full sm:w-auto sm:flex-1 max-w-md">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleSortOrderToggle}
            >
              <ArrowUpDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  filters.sortOrder === "asc" ? "rotate-0" : "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>
        <ProjectFilters
          status={filters.status}
          priority={filters.priority}
          sortBy={filters.sortBy}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Projects list */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <ProjectsLoadingSkeleton viewMode={viewMode} />
        ) : error ? (
          <div className="text-center py-8 text-red-500">{t("error")}</div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title={
              searchQuery ? t("noSearchResults.title") : t("noProjects.title")
            }
            description={
              searchQuery
                ? t("noSearchResults.description")
                : t("noProjects.description")
            }
            icon={<Search />}
          />
        ) : (
          <ProjectList
            projects={projectsWithProgress}
            viewMode={viewMode}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}
