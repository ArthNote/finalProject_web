"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useTranslations, useLocale } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import TaskList from "./components/TaskList";
import PomodoroTimer from "./components/PomodoroTimer";
import MoodTracker from "./components/MoodTracker";
import QuickActions from "./components/QuickActions";
import GoalsMilestones from "./components/GoalsMilestones";
import AnalyticsSnapshot from "./components/AnalyticsSnapshot";
import MotivationalTip from "./components/MotivationalTip";

import {
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  BarChart3,
  Smile,
  Sparkles,
  LightbulbIcon,
  List,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TaskType } from "@/types/task";
import { getTodaysTasks } from "@/lib/api/tasks";
import { getFocusSessionStats } from "@/lib/api/pomodoro";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

const Dashboard = () => {
  const locale = useLocale() as "en" | "fr";
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { data } = authClient.useSession();

  // Get user's first name for greeting
  const username = data?.user?.name || "User";

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greetings.morning");
    if (hour < 18) return t("greetings.afternoon");
    return t("greetings.evening");
  };

  const { data: todayTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["todayTasks"],
    queryFn: getTodaysTasks,
  });

  // Fetch focus session stats for today
  const { data: focusStats, isLoading: isLoadingFocus } = useQuery({
    queryKey: ["focusStats", "day"],
    queryFn: () => getFocusSessionStats("day"),
  });

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Calculate stats
  const completedTasks =
    todayTasks?.data?.filter((task) => task.completed).length || 0;
  const totalTasks = todayTasks?.data?.length || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate focus minutes for today
  const focusMinutes = focusStats?.data?.totalWorkMinutes || 0;

  return (
    <div className="p-4 sm:p-0 space-y-6">
      {/* Top Section - Greeting and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Greeting Card */}
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">
                  {getGreeting()}, {username}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {format(new Date(), "EEEE, MMMM d, yyyy", {
                    locale: locale === "fr" ? fr : enUS,
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigateTo("/calendar")}
              >
                <CalendarIcon className="h-4 w-4" />
                {t("viewCalendar")}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center justify-center p-3 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold">
                  {completedTasks}/{totalTasks}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("stats.tasksCompleted")}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold">
                  {isLoadingFocus ? (
                    <span className="text-muted-foreground text-sm">
                      Loading...
                    </span>
                  ) : (
                    `${focusMinutes} ${t("stats.minutesUnit")}`
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {t("stats.focusTime")}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold">{completionRate}%</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <BarChart3 className="h-3 w-3" />
                  {t("stats.efficiency")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Tip Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LightbulbIcon className="h-4 w-4 text-amber-500" />
              {t("motivationalTip.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MotivationalTip />
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-9 xl:grid-cols-9 2xl:grid-cols-12 gap-6">
        {/* Left Column - Tasks and Analytics */}
        <div className="lg:col-span-5 xl:col-span-6 space-y-6">
          {/* Tasks Card */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-muted-foreground" />
                {t("tasks.title")}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => navigateTo("/tasks")}
              >
                {t("tasks.viewAll")}
              </Button>
            </CardHeader>
            <CardContent>
              <TaskList />
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                {t("analytics.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsSnapshot />
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Pomodoro and Mood */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Pomodoro Timer Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                {t("pomodoro.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PomodoroTimer />
            </CardContent>
          </Card>

          {/* Mood Tracker Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5 text-muted-foreground" />
                {t("mood.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MoodTracker />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions and Goals */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("quickActions.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions />
            </CardContent>
          </Card>

          {/* Goals & Milestones Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                {t("goals.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GoalsMilestones />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
