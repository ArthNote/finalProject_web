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
import { FaTasks } from "react-icons/fa";

export function MySidebar() {
  const t = useTranslations("nav.sidebar");

  const navigationItems: NavItem[] = [
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
    {
      title: "project 1",
      url: "/projects/1",
      icon: Folder,
      type: t("latestProjects"),
      isActive: false,
    },
    {
      title: "project 2",
      url: "/projects/2",
      icon: Folder,
      type: t("latestProjects"),
      isActive: false,
    },
  ];

  return <AppSidebar navItems={navigationItems} />;
}
