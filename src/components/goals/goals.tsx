"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Plus,
  ChevronRight,
  Award,
  Target,
  Calendar,
  BarChart3,
  Flame,
  Trophy,
  Gift,
  Zap,
  Star,
  Sparkles,
  Lightbulb,
  Rocket,
  TrendingUp,
  CheckCircle2,
  Clock,
  Crown,
  Shield,
  Lock,
} from "lucide-react";
import GamedGoalsView from "./GamedGoalsView";
import { RewardsView } from "./RewardsView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProgress,
  updateGoalProgress,
  getRewards,
  unlockReward,
  generateGoals,
} from "@/lib/api/goals";

import {
  ProgressStat,
  UserProgress,
  GameMilestone,
  Goal,
  Reward,
} from "@/types/goals";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "motion/react";
import { StreakCard } from "./StreakCard";
import { GoalCard } from "./GoalCard";
import { useTranslations } from "next-intl";
import { ErrorState } from "../error_state";
import GoalsSkeleton from "./GoalsSkeleton";

const GoalsPage = () => {
  const t = useTranslations("goals");
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [activeSection, setActiveSection] = useState<"goals" | "rewards">(
    "goals"
  );
  const [showXpAnimation, setShowXpAnimation] = useState(false);

  const queryClient = useQueryClient();

  // Fetch user progress
  const {
    data: progress,
    isLoading: isLoadingProgress,
    refetch: refetchProgress,
  } = useQuery({
    queryKey: ["user-progress"],
    queryFn: getUserProgress,
  });

  // Fetch rewards
  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: getRewards,
  });

  // Update goal progress mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, progress }: { goalId: string; progress: number }) =>
      updateGoalProgress(goalId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
      setShowXpAnimation(true);
      setTimeout(() => setShowXpAnimation(false), 2000);
    },
  });

  // Unlock reward mutation
  const unlockRewardMutation = useMutation({
    mutationFn: (rewardId: string) => unlockReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
  });

  const generateGoalsMutation = useMutation({
    mutationFn: generateGoals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
  });

  const handleGenerateGoals = () => {
    generateGoalsMutation.mutate();
  };

  const handleGoalProgress = (goalId: string, newProgress: number) => {
    updateGoalMutation.mutate({ goalId, progress: newProgress });
  };

  const handleUnlockReward = (rewardId: string) => {
    unlockRewardMutation.mutate(rewardId);
  };

  if (isLoadingProgress || isLoadingRewards) {
    return <GoalsSkeleton />;
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
  };

  const xpNeeded = Math.max(0, userLevel.nextLevelXp - userLevel.xp);
  const xpProgress = Math.min(
    100,
    (userLevel.xp / userLevel.nextLevelXp) * 100
  );

  // Filter goals by type with null checks
  const dailyGoals =
    progress.data.goals?.filter((goal) => goal.type === "DAILY") || [];
  const weeklyGoals =
    progress.data.goals?.filter((goal) => goal.type === "WEEKLY") || [];
  const monthlyGoals =
    progress.data.goals?.filter((goal) => goal.type === "MONTHLY") || [];
  const milestoneGoals =
    progress.data.goals?.filter((goal) => goal.type === "MILESTONE") || [];

  // Filter rewards for next level with null checks
  const nextLevelRewards =
    rewards && Array.isArray(rewards)
      ? rewards.filter(
          (reward) => reward.unlockLevel === progress.data.level + 1
        )
      : [];

  return (
    <div className="w-full space-y-8">
      {/* Hero Section with Level and Quote */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 p-4 sm:p-0">
        <Card className="col-span-1 lg:col-span-3 relative overflow-hidden border-2 border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mt-10 -mr-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -mb-8 -ml-8" />

          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                  {t("header.level", {
                    level: progress.data.level,
                  })}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("header.levelDescription")}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-lg px-3 py-1 bg-primary/10 border-primary/20"
              >
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />{" "}
                {progress.data.currentXP} XP
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Level Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {t("header.progressToLevel", {
                    level: progress.data.level + 1,
                  })}
                </span>
                <span>
                  {progress.data.currentXP} / {XP_PER_LEVEL} XP
                </span>
              </div>
              <div className="relative">
                <Progress value={xpProgress} className="h-4" />

                {/* XP Animation */}
                <AnimatePresence>
                  {showXpAnimation && (
                    <motion.div
                      className="absolute top-0 right-1/3 -mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: -20 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <div className="text-sm font-bold text-yellow-500 flex items-center">
                        <Sparkles className="mr-1 h-4 w-4" /> +50 XP
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("header.xpNeededToLevel", {
                  xp: XP_PER_LEVEL - progress.data.currentXP,
                  level: progress.data.level + 1,
                })}
              </p>
            </div>

            {/* Next Level Rewards */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center">
                <Gift className="mr-2 h-4 w-4 text-primary" />
                {t("header.rewardsAtLevel", {
                  level: progress.data.level + 1,
                })}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {nextLevelRewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="bg-muted/50 border border-primary/10"
                  >
                    <CardContent className="p-4 flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Star className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">
                          {t(`rewards.themes.${reward.title}.title`)}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {t(`rewards.themes.${reward.title}.description`)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <StreakCard
          streak={progress.data.streakDays}
          longestStreak={progress.data.longestStreak}
        />
      </div>

      {/* Section Tabs */}
      <div className="flex items-center space-x-4 mb-6 p-4 sm:p-0">
        <div className="hidden sm:flex items-center space-x-4">
          <Button
            variant={activeSection === "goals" ? "default" : "outline"}
            className="gap-2 shadow-sm"
            onClick={() => setActiveSection("goals")}
          >
            <Target className="h-4 w-4" /> {t("tabs.goals&milestones")}
          </Button>
          <Button
            variant={activeSection === "rewards" ? "default" : "outline"}
            className="gap-2 shadow-sm"
            onClick={() => setActiveSection("rewards")}
          >
            <Gift className="h-4 w-4" /> {t("tabs.rewards&unlockables")}
          </Button>
        </div>
        <div className="sm:hidden flex items-center space-x-4">
          <Button
            variant={activeSection === "goals" ? "default" : "outline"}
            className="gap-2 shadow-sm w-full"
            onClick={() => setActiveSection("goals")}
          >
            <Target className="h-4 w-4" /> {t("tabs.goals")}
          </Button>
          <Button
            variant={activeSection === "rewards" ? "default" : "outline"}
            className="gap-2 shadow-sm w-full"
            onClick={() => setActiveSection("rewards")}
          >
            <Gift className="h-4 w-4" /> {t("tabs.rewards")}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="lg:col-span-3 space-y-6">
        {activeSection === "goals" ? (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <CardTitle>{t("goals.title")}</CardTitle>
                <CardDescription>{t("goals.description")}</CardDescription>
              </div>
              <Button onClick={handleGenerateGoals} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("goals.generate")}
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "daily" | "weekly" | "monthly")
                }
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="daily">
                    {t("goals.tabs.daily")}
                  </TabsTrigger>
                  <TabsTrigger value="weekly">
                    {t("goals.tabs.weekly")}
                  </TabsTrigger>
                  <TabsTrigger value="monthly">
                    {t("goals.tabs.monthly")}
                  </TabsTrigger>
                  {/* <TabsTrigger value="milestones">Milestones</TabsTrigger> */}
                </TabsList>

                <TabsContent value="daily" className="space-y-4">
                  {dailyGoals.length > 0 ? (
                    dailyGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onProgressUpdate={(progress) =>
                          handleGoalProgress(goal.id, progress)
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {t("goals.daily.noGoals")}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4">
                  {weeklyGoals.length > 0 ? (
                    weeklyGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onProgressUpdate={(progress) =>
                          handleGoalProgress(goal.id, progress)
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {t("goals.weekly.noGoals")}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                  {monthlyGoals.length > 0 ? (
                    monthlyGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onProgressUpdate={(progress) =>
                          handleGoalProgress(goal.id, progress)
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No monthly goals available. Click 'Generate Goals' to
                      create some!
                    </div>
                  )}
                </TabsContent>

                {/* <TabsContent value="milestones" className="space-y-4">
                  {milestoneGoals.length > 0 ? (
                    milestoneGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onProgressUpdate={(progress) =>
                          handleGoalProgress(goal.id, progress)
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No milestone goals available yet. Keep completing goals to
                      unlock milestones!
                    </div>
                  )}
                </TabsContent> */}
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <RewardsView
            rewards={rewards || []}
            userProgress={{
              id: progress.data.id,
              level: progress.data.level || 1,
              currentXP: progress.data.currentXP || 0,
              totalXP: progress.data.totalXP || 0,
              streakDays: progress.data.streakDays || 0,
              longestStreak: progress.data.longestStreak || 0,
              lastStreakDate:
                progress.data.lastStreakDate || new Date().toISOString(),
              rewards: progress.data.rewards || [],
            }}
            onUnlock={handleUnlockReward}
          />
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
