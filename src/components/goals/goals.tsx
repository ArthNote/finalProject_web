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
import RewardsView from "./RewardsView";
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

const GoalsPage = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const [activeSection, setActiveSection] = useState<"goals" | "rewards">(
    "goals"
  );

  // Mock data
  const userProgress: UserProgress = {
    level: 7,
    currentXP: 350,
    nextLevelXP: 500,
    streakDays: 8,
    longestStreak: 14,
    completedMilestones: 3,
    totalMilestones: 10,
  };

  const progressStats: ProgressStat[] = [
    {
      label: "Daily Goals",
      value: 85,
      prevValue: 73,
      change: 12,
      color: "blue",
    },
    {
      label: "Weekly Goals",
      value: 62,
      prevValue: 55,
      change: 7,
      color: "purple",
    },
    {
      label: "Monthly Goals",
      value: 45,
      prevValue: 40,
      change: 5,
      color: "amber",
    },
  ];

  const milestones: GameMilestone[] = [
    {
      id: "1",
      name: "First Task Completed",
      description: "Complete your first task",
      unlocked: true,
      unlockedDate: "2025-03-15",
      icon: "🚀",
      xpReward: 50,
    },
    {
      id: "2",
      name: "3-Day Streak",
      description: "Complete goals for 3 days in a row",
      unlocked: true,
      unlockedDate: "2025-03-20",
      icon: "🔥",
      xpReward: 75,
    },
    {
      id: "3",
      name: "Level 5 Reached",
      description: "Reach experience level 5",
      unlocked: true,
      unlockedDate: "2025-03-28",
      icon: "⭐",
      xpReward: 100,
    },
    {
      id: "4",
      name: "50 Tasks Done",
      description: "Complete 50 tasks in total",
      unlocked: false,
      icon: "📋",
      xpReward: 150,
    },
    {
      id: "5",
      name: "10-Day Streak",
      description: "Complete goals for 10 days in a row",
      unlocked: false,
      icon: "🔥",
      xpReward: 200,
    },
  ];

  // Mock function to open add goal modal
  const openAddGoalModal = () => {
    toast.info("Add goal functionality would open here");
  };

  // Calculate XP percentage
  const xpPercentage =
    (userProgress.currentXP / userProgress.nextLevelXP) * 100;

  // Motivational quotes
  const quotes = [
    "Consistency is the key to extraordinary results.",
    "Every task completed is a step toward mastery.",
    "Small daily improvements lead to stunning results.",
    "Your future self is watching you right now through memories.",
    "Progress is progress, no matter how small.",
  ];

  const userLevel = {
    current: 7,
    xp: 2350,
    nextLevelXp: 3000,
    totalXpEarned: 12350,
  };

  const [showXpAnimation, setShowXpAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowXpAnimation(true);
      setTimeout(() => setShowXpAnimation(false), 2000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const nextLevelRewards: Reward[] = [
    {
      id: "reward-1",
      title: "Dark Theme",
      description: "Unlock the dark theme for the app",
      level: 8,
      icon: <Lightbulb className="h-5 w-5" />,
      unlocked: false,
    },
    {
      id: "reward-2",
      title: "Custom Dashboard",
      description: "Create your own custom dashboard layout",
      level: 8,
      icon: <Rocket className="h-5 w-5" />,
      unlocked: false,
    },
    {
      id: "reward-3",
      title: "Advanced Analytics",
      description: "Access detailed productivity analytics",
      level: 8,
      icon: <TrendingUp className="h-5 w-5" />,
      unlocked: false,
    },
  ];

  const dailyGoals: Goal[] = [
    {
      id: "daily-1",
      title: "Complete 5 high-priority tasks",
      description: "Finish 5 tasks marked as high priority",
      type: "daily",
      xp: 50,
      progress: 80,
      status: "in-progress",
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: "daily-2",
      title: "Update task statuses",
      description: "Keep your task board up to date by updating statuses",
      type: "daily",
      xp: 30,
      progress: 100,
      status: "completed",
      completedAt: "Today, 2:30 PM",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    },
    {
      id: "daily-3",
      title: "Use the Pomodoro timer",
      description: "Complete at least 3 Pomodoro sessions",
      type: "daily",
      xp: 40,
      progress: 67,
      status: "in-progress",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
  ];

  const weeklyGoals: Goal[] = [
    {
      id: "weekly-1",
      title: "Complete 20 tasks",
      description: "Finish 20 tasks of any priority",
      type: "weekly",
      xp: 150,
      progress: 65,
      status: "in-progress",
      icon: <Target className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "weekly-2",
      title: "Maintain a 5-day streak",
      description:
        "Log in and complete at least one task for 5 consecutive days",
      type: "weekly",
      xp: 200,
      progress: 80,
      status: "in-progress",
      icon: <Flame className="h-5 w-5 text-orange-500" />,
    },
    {
      id: "weekly-3",
      title: "Create a weekly plan",
      description: "Use the planning feature to organize your week",
      type: "weekly",
      xp: 100,
      progress: 100,
      status: "completed",
      completedAt: "2 days ago",
      icon: <Calendar className="h-5 w-5 text-indigo-500" />,
    },
  ];

  const monthlyGoals: Goal[] = [
    {
      id: "monthly-1",
      title: "Complete a major project",
      description: "Mark a project as completed",
      type: "monthly",
      xp: 500,
      progress: 90,
      status: "in-progress",
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "monthly-2",
      title: "Achieve 80% task completion rate",
      description: "Complete at least 80% of all tasks created this month",
      type: "monthly",
      xp: 400,
      progress: 75,
      status: "in-progress",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
    },
    {
      id: "monthly-3",
      title: "Maintain a 20-day streak",
      description:
        "Log in and complete at least one task for 20 days this month",
      type: "monthly",
      xp: 600,
      progress: 50,
      status: "in-progress",
      icon: <Flame className="h-5 w-5 text-red-500" />,
    },
  ];

  const milestoneGoals: Goal[] = [
    {
      id: "milestone-1",
      title: "Productivity Master",
      description: "Complete 1000 tasks in total",
      type: "milestone",
      xp: 1000,
      progress: 72,
      status: "in-progress",
      icon: <Crown className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: "milestone-2",
      title: "Consistency Champion",
      description: "Maintain a 30-day streak",
      type: "milestone",
      xp: 1500,
      progress: 60,
      status: "in-progress",
      icon: <Shield className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "milestone-3",
      title: "Project Virtuoso",
      description: "Successfully complete 10 projects",
      type: "milestone",
      xp: 2000,
      progress: 40,
      status: "in-progress",
      icon: <Star className="h-5 w-5 text-purple-500" />,
    },
  ];

  const xpNeeded = userLevel.nextLevelXp - userLevel.xp;
  const xpProgress = (userLevel.xp / userLevel.nextLevelXp) * 100;

  return (
    <div className="w-full space-y-8 ">
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
                  Level {userLevel.current}
                </CardTitle>
                <CardDescription className="text-base">
                  Keep completing goals to level up and unlock rewards!
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-lg px-3 py-1 bg-primary/10 border-primary/20"
              >
                <Zap className="mr-2 h-5 w-5 text-yellow-500" /> {userLevel.xp}{" "}
                XP
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Level Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {userLevel.current + 1}</span>
                <span>
                  {userLevel.xp} / {userLevel.nextLevelXp} XP
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
                {xpNeeded} XP needed to reach Level {userLevel.current + 1}
              </p>
            </div>

            {/* Next Level Rewards */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center">
                <Gift className="mr-2 h-4 w-4 text-primary" />
                Rewards at Level {userLevel.current + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {nextLevelRewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="bg-muted/50 border border-primary/10"
                  >
                    <CardContent className="p-4 flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {reward.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{reward.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {reward.description}
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
          streak={userProgress.streakDays}
          longestStreak={userProgress.longestStreak}
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
            <Target className="h-4 w-4" /> Goals & Milestones
          </Button>
          <Button
            variant={activeSection === "rewards" ? "default" : "outline"}
            className="gap-2 shadow-sm"
            onClick={() => setActiveSection("rewards")}
          >
            <Gift className="h-4 w-4" /> Rewards & Unlockables
          </Button>
        </div>
        <div className="sm:hidden flex items-center space-x-4">
          <Button
            variant={activeSection === "goals" ? "default" : "outline"}
            className="gap-2 shadow-sm w-full"
            onClick={() => setActiveSection("goals")}
          >
            <Target className="h-4 w-4" /> Goals
          </Button>
          <Button
            variant={activeSection === "rewards" ? "default" : "outline"}
            className="gap-2 shadow-sm w-full"
            onClick={() => setActiveSection("rewards")}
          >
            <Gift className="h-4 w-4" /> Rewards
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="lg:col-span-3 space-y-6">
        {activeSection === "goals" ? (
          <Card>
            <CardHeader>
              <CardTitle>Goals & Challenges</CardTitle>
              <CardDescription>
                Complete these goals to earn XP and level up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "daily" | "weekly" | "monthly")
                }
              >
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4">
                  {dailyGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4">
                  {weeklyGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                  {monthlyGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </TabsContent>

                <TabsContent value="milestones" className="space-y-4">
                  {milestoneGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <RewardsView userProgress={userProgress} />
        )}
      </div>

      {/* {activeSection === "goals" && (
        <div className="mt-10 ">
          <ProgressAnalytics stats={progressStats} />
        </div>
      )} */}
    </div>
  );
};



export default GoalsPage;

