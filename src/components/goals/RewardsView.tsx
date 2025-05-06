import React, { use, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Gift,
  Zap,
  Crown,
  Award,
  Layers,
  PaintBucket,
  Users,
  Rocket,
  Clock,
  Star,
  Lock,
  Unlock,
  Coins,
} from "lucide-react";
import {
  rewardItems,
  userRewards,
  getNextUnlockableRewards,
  getRewardsByCategory,
  getUnlockedRewards,
  getHighlightedRewards,
} from "@/lib/mock-rewards";
import { toast } from "sonner";
import { Reward, UserProgress } from "@/types/gamification";
import { useTranslations } from "next-intl";

interface RewardsViewProps {
  rewards: Reward[];
  userProgress: {
    id: string;
    level: number;
    currentXP: number;
    totalXP: number;
    streakDays: number;
    longestStreak: number;
    lastStreakDate: string;
    rewards: {
      id: string;
      rewardId: string;
      unlocked: boolean;
      unlockedAt: string | null;
    }[];
  };
  onUnlock: (rewardId: string) => void;
}

export function RewardsView({
  rewards,
  userProgress,
  onUnlock,
}: RewardsViewProps) {
  // Filter rewards based on user's unlocked status
  const unlockedRewards = rewards.filter((reward) =>
    userProgress.rewards?.some((ur) => ur.rewardId === reward.id && ur.unlocked)
  );

  const t = useTranslations("goals");

  const lockedRewards = rewards.filter(
    (reward) =>
      !userProgress.rewards?.some(
        (ur) => ur.rewardId === reward.id && ur.unlocked
      )
  );

  const renderEmptyState = (message: string) => (
    <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-4">
      <Gift className="h-12 w-12 text-muted-foreground/50" />
      <p>{message}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("rewardsTab.allRewards")}</TabsTrigger>
          <TabsTrigger value="unlocked">{t("rewardsTab.unlocked")}</TabsTrigger>
          <TabsTrigger value="locked">{t("rewardsTab.locked")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {rewards.length > 0
            ? rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  unlocked={userProgress.rewards.some(
                    (ur) => ur.rewardId === reward.id && ur.unlocked
                  )}
                  userLevel={userProgress.level}
                  onUnlock={() => onUnlock(reward.id)}
                />
              ))
            : renderEmptyState(t("rewardsTab.noRewards"))}
        </TabsContent>

        <TabsContent value="unlocked" className="space-y-4">
          {unlockedRewards.length > 0
            ? unlockedRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  unlocked={true}
                  userLevel={userProgress.level}
                  onUnlock={() => onUnlock(reward.id)}
                />
              ))
            : renderEmptyState(t("rewardsTab.noUnlockedRewards"))}
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          {lockedRewards.length > 0
            ? lockedRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  unlocked={false}
                  userLevel={userProgress.level}
                  onUnlock={() => onUnlock(reward.id)}
                />
              ))
            : renderEmptyState(t("rewardsTab.noLockedRewards"))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RewardCardProps {
  reward: Reward;
  unlocked: boolean;
  userLevel: number;
  onUnlock: () => void;
}

function RewardCard({
  reward,
  unlocked,
  userLevel,
  onUnlock,
}: RewardCardProps) {
  const canUnlock = reward.unlockLevel ? userLevel >= reward.unlockLevel : true;
  const t = useTranslations("goals");
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <Star className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">
                {t(`rewards.themes.${reward.title}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`rewards.themes.${reward.title}.description`)}
              </p>
            </div>
          </div>
          <Badge variant={unlocked ? "secondary" : "outline"}>
            {unlocked ? (
              <>
                <Unlock className="mr-1 h-3 w-3" /> {t("rewardsTab.unlocked")}
              </>
            ) : ( 
              <>
                <Lock className="mr-1 h-3 w-3" />
                {t("rewardsTab.level", { level: reward.unlockLevel! })}
              </>
            )}
          </Badge>
        </div>

        {!unlocked && canUnlock && (
          <Button onClick={onUnlock} className="mt-4 w-full" variant="outline">
            {t("rewardsTab.unlockReward")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
