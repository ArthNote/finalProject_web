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

const TeamPage = () => {
  const { team, hasTeamSub } = useTeam();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const stats = [
    {
      name: "Active Members",
      value: team.memberCount,
      change: "+2.1%",
      icon: Users2,
      description: "Total active team members",
    },
    {
      name: "Tasks in Progress",
      value: "24",
      change: "+5.2%",
      icon: Target,
      description: "Tasks currently being worked on",
    },
    {
      name: "Completion Rate",
      value: "87%",
      change: "+4.3%",
      icon: Activity,
      description: "Tasks completed this month",
    },
    {
      name: "Resources",
      value: "164",
      change: "+12.1%",
      icon: Boxes,
      description: "Total shared resources",
    },
  ];
  if (!hasTeamSub) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h1 className="text-3xl font-bold">Welcome to Teams</h1>
              <p className="text-muted-foreground text-lg">
                Upgrade to a team plan to unlock collaboration features
              </p>
              <Button size="lg" className="mt-6">
                Upgrade to Team Plan
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
                              label: "Overview",
                              icon: BarChart,
                            },
                            {
                              value: "members",
                              label: "Members",
                              icon: Users2,
                            },
                            { value: "tasks", label: "Tasks", icon: Target },
                            {
                              value: "resources",
                              label: "Resources",
                              icon: FileText,
                            },
                            {
                              value: "friends",
                              label: "Friends",
                              icon: Users2,
                            },
                            {
                              value: "settings",
                              label: "Settings",
                              icon: Settings,
                            },
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
                          return "Overview";
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          Overview
                        </div>
                      </SelectItem>
                      <SelectItem value="members">
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4" />
                          Members
                        </div>
                      </SelectItem>
                      <SelectItem value="tasks">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Tasks
                        </div>
                      </SelectItem>
                      <SelectItem value="resources">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Resources
                        </div>
                      </SelectItem>
                      <SelectItem value="friends">
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4" />
                          Friends
                        </div>
                      </SelectItem>
                      <SelectItem value="settings">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Settings
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Desktop Tabs */}

                <TabsList className="hidden md:grid grid-cols-6 w-full max-w-2xl bg-background/80 p-1">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="members"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Users2 className="mr-2 h-4 w-4" />
                    Members
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="resources"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <FileIcon className="mr-2 h-4 w-4" />
                    Resources
                  </TabsTrigger>
                  <TabsTrigger
                    value="friends"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Users2 className="mr-2 h-4 w-4" />
                    Friends
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
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
                              : "text-red-600"
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

            <TabsContent value="settings" className="px-4 sm:p-0">
              <TeamSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TeamProvider>
  );
};

export default TeamPage;
