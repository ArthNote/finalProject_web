"use client";

import React, { useState } from "react";
import { TeamProvider, useTeam } from "./team-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Users2,
  FileText,
  Plus,
  MoreVertical,
  Boxes,
  Target,
  Activity,
  Settings,
  BarChart,
  icons,
  FileIcon,
} from "lucide-react";
import TeamOverview from "./sections/team-overview";
import TeamTasks from "./sections/team-tasks";
import TeamMembers from "./sections/team-members";
import TeamResources from "./sections/team-resources";
import TeamMembersList from "./sections/team-members-list";
import TeamSettings from "./sections/team-settings";
import TeamActivity from "./sections/team-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import TeamFriends from "./sections/team-friends";
import { useTranslations } from "next-intl";

const TeamPage = () => {
  const { team, hasTeamSub } = useTeam();
  const t = useTranslations("team.overview");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const stats = [
    {
      id: "active-members",
      name: t("stats.activeMembers"),
      value: team.memberCount,
      change: "+2.1%",
      icon: Users2,
      description: t("stats.totalActiveMembers"),
    },
    {
      id: "tasks-inprogress",
      name: t("stats.tasksInProgress"),
      value:
        team.tasks?.filter(
          (task) => task.status === "inprogress" && !task.completed
        ).length || 0,
      change: (() => {
        const now = new Date();
        const thisMonth =
          team.tasks?.filter((task) => {
            const taskDate = new Date(task.createdAt!);
            return (
              taskDate.getMonth() === now.getMonth() &&
              taskDate.getFullYear() === now.getFullYear() &&
              task.status === "inprogress" &&
              !task.completed
            );
          }).length || 0;

        const lastMonth =
          team.tasks?.filter((task) => {
            const taskDate = new Date(task.createdAt!);
            return (
              taskDate.getMonth() === (now.getMonth() - 1 + 12) % 12 &&
              (taskDate.getMonth() === 0
                ? taskDate.getFullYear() === now.getFullYear() - 1
                : taskDate.getFullYear() === now.getFullYear()) &&
              task.status === "inprogress" &&
              !task.completed
            );
          }).length || 0;

        if (lastMonth === 0 && thisMonth !== 0) return "+100%";
        if (thisMonth === 0 && lastMonth !== 0) return "-100%";
        if (lastMonth === 0 && thisMonth === 0) return "0%";

        const change = ((thisMonth - lastMonth) / lastMonth) * 100;
        return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
      })(),
      icon: Target,
      description: t("stats.tasksBeingWorkedOn"),
    },
    {
      id: "tasks-completed",
      name: t("stats.completionRate"),
      value: (() => {
        const now = new Date();
        const thisMonth =
          team.tasks?.filter((task) => {
            const taskDate = new Date(task.createdAt!);
            return (
              taskDate.getMonth() === now.getMonth() &&
              taskDate.getFullYear() === now.getFullYear()
            );
          }) || [];

        const completed = thisMonth.filter((task) => task.completed).length;
        const total = thisMonth.length;

        return total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%";
      })(),
      change: (() => {
        const now = new Date();
        const thisMonth =
          team.tasks?.filter((task) => {
            const taskDate = new Date(task.createdAt!);
            return (
              taskDate.getMonth() === now.getMonth() &&
              taskDate.getFullYear() === now.getFullYear() &&
              task.completed
            );
          }).length || 0;

        const lastMonth =
          team.tasks?.filter((task) => {
            const taskDate = new Date(task.createdAt!);
            return (
              taskDate.getMonth() === (now.getMonth() - 1 + 12) % 12 &&
              (taskDate.getMonth() === 0
                ? taskDate.getFullYear() === now.getFullYear() - 1
                : taskDate.getFullYear() === now.getFullYear()) &&
              task.completed
            );
          }).length || 0;

        if (lastMonth === 0 && thisMonth !== 0) return "+100%";
        if (thisMonth === 0 && lastMonth !== 0) return "-100%";
        if (lastMonth === 0 && thisMonth === 0) return "0%";
        const change = ((thisMonth - lastMonth) / lastMonth) * 100;
        return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
      })(),
      icon: Activity,
      description: t("stats.tasksCompletedThisMonth"),
    },
    {
      id: "resources",
      name: t("stats.resources"),
      value: team.resources?.length || 0,
      change: (() => {
        const now = new Date();
        const thisMonth =
          team.resources?.filter((resource) => {
            const resourceDate = new Date(resource.createdAt!);
            return (
              resourceDate.getMonth() === now.getMonth() &&
              resourceDate.getFullYear() === now.getFullYear()
            );
          }).length || 0;

        const lastMonth =
          team.resources?.filter((resource) => {
            const resourceDate = new Date(resource.createdAt!);
            return (
              resourceDate.getMonth() === (now.getMonth() - 1 + 12) % 12 &&
              (resourceDate.getMonth() === 0
                ? resourceDate.getFullYear() === now.getFullYear() - 1
                : resourceDate.getFullYear() === now.getFullYear())
            );
          }).length || 0;

        if (lastMonth === 0 && thisMonth !== 0) return "+100%";
        if (thisMonth === 0 && lastMonth !== 0) return "-100%";
        if (lastMonth === 0 && thisMonth === 0) return "0%";
        const change = ((thisMonth - lastMonth) / lastMonth) * 100;
        return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
      })(),
      icon: Boxes,
      description: t("stats.totalResources"),
    },
  ];
  if (!hasTeamSub) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h1 className="text-3xl font-bold">{t("noTeamPlan.title")}</h1>
              <p className="text-muted-foreground text-lg">
                {t("noTeamPlan.description")}
              </p>
              <Button size="lg" className="mt-6">
                {t("noTeamPlan.action")}
              </Button>
            </div>
          </CardContent>
        </Card>
        <TeamFriends />
      </div>
    );
  }
  return (
    <TeamProvider>
      <div className="h-[90vh]">
        <header className="border-b px-4 sm:px-0 pb-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex h-16 items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold">{team.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {team.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        <div className="py-6">
          <Tabs
            value={tab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full gap-2 px-4 sm:p-0">
                {/* Mobile Select Navigation */}
                <div className="md:hidden w-full">
                  <Select value={tab} onValueChange={handleTabChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(() => {
                          const items = [
                            {
                              value: "overview",
                              label: t("tabs.overview"),
                              icon: BarChart,
                            },
                            {
                              value: "members",
                              label: t("tabs.members"),
                              icon: Users2,
                            },
                            { value: "tasks", label: "Tasks", icon: Target },
                            {
                              value: "resources",
                              label: t("tabs.resources"),
                              icon: FileText,
                            },
                            {
                              value: "friends",
                              label: t("tabs.friends"),
                              icon: Users2,
                            }
                            // {
                            //   value: "settings",
                            //   label: t("tabs.settings"),
                            //   icon: Settings,
                            // },
                          ];
                          const currentItem = items.find(
                            (item) => item.value === tab
                          );
                          if (currentItem) {
                            const Icon = currentItem.icon;
                            return (
                              <div className="flex items-center gap-2">
                                {Icon && <Icon className="h-4 w-4" />}
                                <span>{currentItem.label}</span>
                              </div>
                            );
                          }
                          return t("tabs.overview");
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          {t("tabs.overview")}
                        </div>
                      </SelectItem>
                      <SelectItem value="members">
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4" />
                          {t("tabs.members")}
                        </div>
                      </SelectItem>
                      <SelectItem value="tasks">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          {t("tabs.tasks")}
                        </div>
                      </SelectItem>
                      <SelectItem value="resources">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {t("tabs.resources")}
                        </div>
                      </SelectItem>
                      <SelectItem value="friends">
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4" />
                          {t("tabs.friends")}
                        </div>
                      </SelectItem>
                      {/* <SelectItem value="settings">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          {t("tabs.settings")}
                        </div>
                      </SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                {/* Desktop Tabs */}

                <TabsList className="hidden md:grid grid-cols-5 w-full max-w-3xl bg-background/80 p-1 ">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    {t("tabs.overview")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="members"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Users2 className="mr-2 h-4 w-4" />
                    {t("tabs.members")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    {t("tabs.tasks")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="resources"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <FileIcon className="mr-2 h-4 w-4" />
                    {t("tabs.resources")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="friends"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Users2 className="mr-2 h-4 w-4" />

                    {t("tabs.friends")}
                  </TabsTrigger>
                  {/* <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {t("tabs.settings")}
                  </TabsTrigger> */}
                </TabsList>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6 px-4 sm:p-0">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card
                    key={stat.name}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            stat.change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600",
                            stat.id === "active-members" ? "hidden" : "block"
                          )}
                        >
                          {stat.change}
                        </span>
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm font-medium">{stat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {stat.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Grid */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Main Content */}
                <div className="space-y-6">
                  <TeamOverview />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <TeamActivity limit={5} showHeader={false} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="px-4 sm:p-0">
              <TeamMembers />
            </TabsContent>

            <TabsContent value="tasks">
              <TeamTasks />
            </TabsContent>

            <TabsContent value="resources" className="px-4 sm:p-0">
              <TeamResources />
            </TabsContent>

            <TabsContent value="friends" className="px-4 sm:p-0">
              <TeamFriends />
            </TabsContent>

            {/* <TabsContent value="settings" className="px-4 sm:p-0">
              <TeamSettings />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </TeamProvider>
  );
};

export default TeamPage;
