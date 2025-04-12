"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Heart, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { ViewMode } from "../types";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectListProps {
  projects: Project[];
  viewMode: ViewMode;
  searchQuery: string;
}

export function ProjectList({
  projects,
  viewMode,
  searchQuery,
}: ProjectListProps) {
  const { deleteProject } = useProjects();
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(
    null
  );

  const handleDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id);
        setProjectToDelete(null);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (viewMode === "list") {
    return (
      <>
        <div className="w-full overflow-x-auto">
          <div className="space-y-4">
            {projects.map((project) => (
              <ListViewProject
                key={project.id}
                project={project}
                onDelete={() => setProjectToDelete(project)}
              />
            ))}
          </div>
        </div>
        <DeleteProjectDialog
          open={!!projectToDelete}
          onOpenChange={(open) => !open && setProjectToDelete(null)}
          onConfirm={handleDelete}
          projectName={projectToDelete?.name ?? ""}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects.map((project) => (
          <GridViewProject
            key={project.id}
            project={project}
            onDelete={() => setProjectToDelete(project)}
          />
        ))}
      </div>
      <DeleteProjectDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        onConfirm={handleDelete}
        projectName={projectToDelete?.name ?? ""}
      />
    </>
  );
}

function GridViewProject({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: () => void;
}) {
  const t = useTranslations("Projects.views");
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base md:text-lg truncate">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex gap-1 md:gap-2 flex-shrink-0">
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8"
            >
              <Trash className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t("progress")}</span>
            <span>{Math.round(project.progress)}%</span>
          </div>
          <Progress value={project.progress} />
        </div>

        {/* Status and Priority */}
        <div className="flex flex-wrap gap-2">
          <Badge>{t("status." + project.status)}</Badge>
          <Badge variant={getBadgeVariant(project.priority)}>
            {t("priority." + project.priority)}
          </Badge>
        </div>

        {/* Team */}
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            <Avatar
              key={project.owner.id}
              className="border-2 border-background h-8 w-8"
            >
              <AvatarImage src={project.owner.image || undefined} />
              <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {project.members.slice(0, 2).map((member) => (
              <Avatar
                key={member.user.id}
                className="border-2 border-background h-8 w-8"
              >
                <AvatarImage src={member.user.image || undefined} />
                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 2 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm border-2 border-background">
                +{project.members.length - 2}
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {project.tasks.length} {t("tasks")}
          </div>
        </div>

        {/* Dates */}
        <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
          {project.startDate && (
            <span>
              {t("started", {
                date: format(new Date(project.startDate), "MMM d"),
              })}
            </span>
          )}
          {project.endDate && (
            <span>
              {t("due", { date: format(new Date(project.endDate), "MMM d") })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function ListViewProject({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: () => void;
}) {
  const t = useTranslations("Projects.views");
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0 w-full">
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold truncate">{project.name}</h3>
              <div className="flex gap-1 sm:hidden">
                {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4 text-gray-400" />
                </Button> */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-8 w-8"
                >
                  <Trash className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:hidden">
            <Badge>{t("status." + project.status)}</Badge>
            <Badge variant={getBadgeVariant(project.priority)}>
              {t("priority." + project.priority)}
            </Badge>
            {project.endDate && (
              <div className="text-xs text-muted-foreground">
                {t("due", {
                  date: format(new Date(project.endDate), "MMM d"),
                })}
              </div>
            )}
          </div>

          <div className="mt-2 sm:hidden w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>{t("progress")}</span>
              <span>{Math.round(project.progress)}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 md:gap-6 flex-shrink-0">
          {/* Progress */}
          <div className="hidden sm:block w-32">
            <div className="flex justify-between text-sm mb-1">
              <span>{t("progress")}</span>
              <span>{Math.round(project.progress)}%</span>
            </div>
            <Progress value={project.progress} />
          </div>

          {/* Status and Priority */}
          <div className="flex gap-2 flex-shrink-0">
            <Badge>{t("status." + project.status)}</Badge>
            <Badge variant={getBadgeVariant(project.priority)}>
              {t("priority." + project.priority)}
            </Badge>
          </div>

          {/* Team */}
          <div className="hidden md:flex -space-x-2">
            <Avatar
              key={project.owner.id}
              className="border-2 border-background h-8 w-8"
            >
              <AvatarImage src={project.owner.image || undefined} />
              <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {project.members.slice(0, 2).map((member) => (
              <Avatar
                key={member.user.id}
                className="border-2 border-background h-8 w-8"
              >
                <AvatarImage src={member.user.image || undefined} />
                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 2 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm border-2 border-background">
                +{project.members.length - 2}
              </div>
            )}
          </div>

          {/* Due Date */}
          {project.endDate && (
            <div className="hidden lg:block text-sm text-muted-foreground whitespace-nowrap">
              {t("due", {
                date: format(new Date(project.endDate), "MMM d"),
              })}
            </div>
          )}

          {/* Actions */}
          <div className="hidden sm:flex gap-1 flex-shrink-0">
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8"
            >
              <Trash className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function getBadgeVariant(
  priority: string
): "destructive" | "secondary" | "default" {
  switch (priority.toLowerCase()) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "default";
    default:
      return "default";
  }
}
