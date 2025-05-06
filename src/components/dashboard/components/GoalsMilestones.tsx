"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  Sparkles,
  Star,
  Clock,
  Flame,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserProgress } from "@/lib/api/goals";
import { ErrorState } from "@/components/error_state";
import { useRouter } from "@/i18n/navigation";

// Define types
type Goal = {
  id: string;
  title: string;
  progress: number;
  type: "daily" | "weekly" | "monthly" | "milestone";
  dueDate?: string;
  xpReward: number;
};

type UserProgress = {
  level: number;
  currentXP: number;
  totalXP: number;
  streakDays: number;
  nextLevelXP: number;
};

const GoalsMilestones = () => {
  const t = useTranslations("dashboard.goals");

  // Fetch user's progress data
  const {
    data: progress,
    isLoading: isLoadingProgress,
    refetch: refetchProgress,
  } = useQuery({
    queryKey: ["user-progress"],
    queryFn: getUserProgress,
  });

  const router = useRouter();

  // Loading state
  if (isLoadingProgress) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <ErrorState
        action={t("errorState.action")}
        description={t("errorState.description")}
        title={t("errorState.title")}
        retryAction={refetchProgress}
      />
    );
  }

  const XP_PER_LEVEL = 1000;

  // Ensure progress values are numbers with defaults
  const userLevel = {
    current: progress.data.level || 1,
    xp: progress.data.currentXP || 0,
    nextLevelXp: XP_PER_LEVEL,
    totalXpEarned: progress.data.totalXP || 0,
    streakDays: progress.data.streakDays || 0,
  };

  const xpNeeded = Math.max(0, userLevel.nextLevelXp - userLevel.xp);
  const xpPercentage = Math.min(
    100,
    (userLevel.xp / userLevel.nextLevelXp) * 100
  );

  return (
    <div className="space-y-6">
      {/* User Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium">
              {t("level", { level: userLevel.current })}
            </span>
          </div>
          <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
            <Flame className="h-3.5 w-3.5" />
            {t("streakDays", { days: userLevel.streakDays })}
          </Badge>
        </div>

        <Progress value={xpPercentage} className="h-2.5" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            <span className="font-medium">{userLevel.xp}</span>
            <span> / {userLevel.nextLevelXp} XP</span>
          </div>
          <div>{t("totalXP", { xp: userLevel.totalXpEarned })}</div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center justify-between">
          <span>{t("activeGoals")}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 text-xs text-muted-foreground"
            onClick={() => {
              router.push("/goals");
            }}
          >
            {t("viewAll")}
            <ChevronRight className="h-3 w-3" />
          </Button>
        </h3>

        <ScrollArea className="h-[180px]">
          {progress.data.goals?.length === 0 ? (
            <div className="text-center py-6">
              <Star className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t("noGoals")}</p>
              <Button size="sm" className="mt-2 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                {t("createGoal")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.data.goals?.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-medium text-sm truncate">
                        {t(
                          `goals.${goal.title
                            .toLowerCase()
                            .replace(/ /g, "_")}.title`
                        )}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        {goal.type === "DAILY" && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1 h-4"
                          >
                            {t("daily")}
                          </Badge>
                        )}
                        {goal.type === "WEEKLY" && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-[10px] px-1 h-4"
                          >
                            {t("weekly")}
                          </Badge>
                        )}
                        {goal.type === "MONTHLY" && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] px-1 h-4"
                          >
                            {t("monthly")}
                          </Badge>
                        )}

                        {goal.endDate && (
                          <span className="text-[10px] text-muted-foreground flex items-center">
                            <Clock className="h-2.5 w-2.5 mr-0.5" />
                            {new Date(goal.endDate).toLocaleDateString()}
                          </span>
                        )}

                        <span className="text-[10px] text-amber-600 dark:text-amber-400 ml-auto flex items-center">
                          <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                          {t("xpReward", { xp: goal.xpReward })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Progress value={goal.progress} className="h-1.5 flex-1" />
                    <span className="text-xs font-medium">
                      {goal.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default GoalsMilestones;
