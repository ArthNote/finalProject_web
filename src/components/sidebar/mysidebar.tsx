"use client";

import { AppSidebar } from "./sidebar";
import {
  Calendar,
  CheckSquare,
  Folder,
  Folders,
  GoalIcon,
  LayoutDashboard,
  MessageSquareMore,
  Users,
} from "lucide-react";
import { type NavItem } from "@/types/navigation";
import { useTranslations } from "next-intl";
import { useProjects } from "@/hooks/useProjects";

export function MySidebar() {
  const t = useTranslations("nav.sidebar");

  // Fetch projects with sorting by updatedAt
  const { data: projects } = useProjects({
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  // Get latest 3 updated projects
  const latestProjects = projects?.slice(0, 3) || [];

  const baseNavigationItems: NavItem[] = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
      type: "",
    },
    {
      title: t("tasks"),
      url: "/tasks",
      icon: CheckSquare,
      type: "",
      isActive: false,
    },
    {
      title: t("projects"),
      url: "/projects",
      icon: Folders,
      type: "",
      isActive: false,
    },
    {
      title: t("calendar"),
      url: "/calendar",
      icon: Calendar,
      type: "",
      isActive: false,
    },
    {
      title: t("goals"),
      url: "/goals",
      icon: GoalIcon,
      type: "",
      isActive: false,
    },
    {
      title: t("team"),
      url: "/team",
      icon: Users,
      type: "",
      isActive: false,
    },
    {
      title: t("chats"),
      url: "/chats",
      icon: MessageSquareMore,
      type: "",
      isActive: false,
    },
  ];

  // Create navigation items for latest projects
  const latestProjectItems: NavItem[] = latestProjects.map((project) => ({
    title: project.name,
    url: `/projects/project-${project.id}`,
    icon: Folder,
    type: t("latestProjects"),
    isActive: false,
  }));

  // Combine base navigation items with latest project items
  const navigationItems = [...baseNavigationItems, ...latestProjectItems];

  return <AppSidebar navItems={navigationItems} />;
}
