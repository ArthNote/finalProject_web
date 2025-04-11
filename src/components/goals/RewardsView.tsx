import React, { useState } from "react";
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
import { RewardItem, UserProgress, UserRewards, PowerUp } from "@/types/goals";
import {
  rewardItems,
  userRewards,
  getNextUnlockableRewards,
  getRewardsByCategory,
  getUnlockedRewards,
  getHighlightedRewards,
} from "@/lib/mock-rewards";
import { toast } from "sonner";

interface RewardsViewProps {
  userProgress: UserProgress;
}

const RewardsView: React.FC<RewardsViewProps> = ({ userProgress }) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cosmetic":
        return <PaintBucket className="h-4 w-4" />;
      case "functional":
        return <Layers className="h-4 w-4" />;
      case "power-up":
        return <Zap className="h-4 w-4" />;
      case "social":
        return <Users className="h-4 w-4" />;
      case "motivational":
        return <Star className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const handleUseCoins = (reward: RewardItem) => {
    if (!reward.coinCost) return;

    if (userRewards.coins >= reward.coinCost) {
      toast.success(`You purchased ${reward.name}!`);
    } else {
      toast.error(
        `Not enough coins. You need ${
          reward.coinCost - userRewards.coins
        } more coins.`
      );
    }
  };

  const handleActivatePowerUp = (reward: RewardItem) => {
    toast.success(`${reward.name} activated!`);
  };

  const nextLevelRewards = getRewardsByCategory(
    activeTab === "all" ? "all" : activeTab
  )
    .filter((reward) => !reward.unlocked)
    .sort((a, b) => a.unlockLevel - b.unlockLevel);

  const unlockedRewards = getRewardsByCategory(
    activeTab === "all" ? "all" : activeTab
  ).filter((reward) => reward.unlocked);

  const nextUnlocks = getNextUnlockableRewards(userProgress.level, 3);
  const highlightedRewards = getHighlightedRewards();

  return (
    <div className="space-y-8 p-4 sm:p-0">
      {/* Active Power-ups Section */}
      {userRewards.activePowerUps.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-amber-500" /> Active Power-ups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRewards.activePowerUps.map((powerUp) => (
              <PowerUpCard key={powerUp.id} powerUp={powerUp} />
            ))}
          </div>
        </div>
      )}

      {/* Next Level Unlocks Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Rocket className="mr-2 h-5 w-5 text-blue-500" /> Coming Soon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextUnlocks.map((reward) => (
            <NextUnlockCard
              key={reward.id}
              reward={reward}
              currentLevel={userProgress.level}
            />
          ))}
        </div>
      </div>

      {/* Highlighted Rewards */}
      {highlightedRewards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Award className="mr-2 h-5 w-5 text-purple-500" /> Premium Rewards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlightedRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                currentLevel={userProgress.level}
                coins={userRewards.coins}
                onUseCoins={() => handleUseCoins(reward)}
                onActivate={() => handleActivatePowerUp(reward)}
                highlighted
              />
            ))}
          </div>
        </div>
      )}

      {/* Reward Categories */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Gift className="mr-2 h-5 w-5 text-primary" /> All Rewards
          </h3>
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="font-semibold">{userRewards.coins} coins</span>
          </div>
        </div>

        <TabsList className="mb-4 grid grid-cols-3 grid-rows-2 md:grid-cols-6 md:grid-rows-1 gap-2 md:gap-0 h-auto">
          <TabsTrigger value="all" className="text-xs md:text-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="cosmetic" className="text-xs md:text-sm">
            Cosmetic
          </TabsTrigger>
          <TabsTrigger value="power-up" className="text-xs md:text-sm">
            Power-ups
          </TabsTrigger>
          <TabsTrigger value="functional" className="text-xs md:text-sm">
            Functional
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs md:text-sm">
            Social
          </TabsTrigger>
          <TabsTrigger value="motivational" className="text-xs md:text-sm">
            Motivational
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="mb-6">
            <h4 className="text-muted-foreground font-medium mb-3 flex items-center">
              <Unlock className="mr-2 h-4 w-4" /> Unlocked (
              {unlockedRewards.length})
            </h4>
            {unlockedRewards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {unlockedRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    currentLevel={userProgress.level}
                    coins={userRewards.coins}
                    onUseCoins={() => handleUseCoins(reward)}
                    onActivate={() => handleActivatePowerUp(reward)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/40 rounded-md">
                <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No {activeTab !== "all" ? activeTab : ""} rewards unlocked yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep leveling up to unlock more rewards
                </p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-muted-foreground font-medium mb-3 flex items-center">
              <Lock className="mr-2 h-4 w-4" /> Locked (
              {nextLevelRewards.length})
            </h4>
            {nextLevelRewards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {nextLevelRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    currentLevel={userProgress.level}
                    coins={userRewards.coins}
                    onUseCoins={() => handleUseCoins(reward)}
                    onActivate={() => handleActivatePowerUp(reward)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/40 rounded-md">
                <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  You've unlocked all {activeTab !== "all" ? activeTab : ""}{" "}
                  rewards!
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// PowerUp Card Component
const PowerUpCard: React.FC<{ powerUp: PowerUp }> = ({ powerUp }) => {
  const startTime = powerUp.startTime
    ? new Date(powerUp.startTime)
    : new Date();
  const endTime = new Date(
    startTime.getTime() + powerUp.duration * 60 * 60 * 1000
  );
  const now = new Date();

  const totalMilliseconds = endTime.getTime() - startTime.getTime();
  const elapsedMilliseconds = now.getTime() - startTime.getTime();
  const percentageLeft = 100 - (elapsedMilliseconds / totalMilliseconds) * 100;

  const hoursLeft = Math.max(
    0,
    Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60 * 60))
  );
  const minutesLeft = Math.max(
    0,
    Math.floor(
      ((endTime.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60)
    )
  );

  return (
    <Card className="border-2 border-amber-200 bg-amber-50/30 dark:bg-amber-950/10 dark:border-amber-900/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="text-2xl mr-2">{powerUp.icon}</div>
            <CardTitle className="text-base">{powerUp.name}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
          >
            <Zap className="h-3 w-3 mr-1" /> Active
          </Badge>
        </div>
        <CardDescription>{powerUp.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" /> Time left
            </span>
            <span className="font-medium">
              {hoursLeft}h {minutesLeft}m
            </span>
          </div>
          <Progress value={percentageLeft} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

// Next Unlock Card Component
const NextUnlockCard: React.FC<{
  reward: RewardItem;
  currentLevel: number;
}> = ({ reward, currentLevel }) => {
  const levelsToGo = reward.unlockLevel - currentLevel;

  return (
    <Card className="bg-muted/30 overflow-hidden">
      <div className="h-1.5 bg-primary/20 w-full">
        <div
          className="h-full bg-primary"
          style={{
            width: `${Math.min(
              100,
              (currentLevel / reward.unlockLevel) * 100
            )}%`,
          }}
        ></div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl mr-2">{reward.icon}</div>
            <div>
              <CardTitle className="text-base">{reward.name}</CardTitle>
              <div className="text-xs text-muted-foreground">
                Unlocks at Level {reward.unlockLevel}
              </div>
            </div>
          </div>
          <Badge variant="outline">
            {levelsToGo > 0
              ? `${levelsToGo} levels to go`
              : "Available next level"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{reward.description}</p>
      </CardContent>
    </Card>
  );
};

// Reward Card Component
const RewardCard: React.FC<{
  reward: RewardItem;
  currentLevel: number;
  coins: number;
  onUseCoins: () => void;
  onActivate: () => void;
  highlighted?: boolean;
}> = ({
  reward,
  currentLevel,
  coins,
  onUseCoins,
  onActivate,
  highlighted = false,
}) => {
  const isUnlocked = reward.unlocked || currentLevel >= reward.unlockLevel;
  const canPurchase = isUnlocked && reward.coinCost && coins >= reward.coinCost;
  const isPowerUp = reward.type === "power-up";

  // Calculate the border and background classes based on status
  let cardClasses = "transition-all";
  if (highlighted) {
    cardClasses += " border-purple-300 dark:border-purple-800/30";
    if (isUnlocked) {
      cardClasses += " bg-purple-50/30 dark:bg-purple-950/10";
    }
  } else if (isUnlocked) {
    cardClasses +=
      " border-green-200 dark:border-green-900/30 bg-green-50/30 dark:bg-green-950/10";
  }

  return (
    <Card className={cardClasses}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{reward.icon}</div>
            <CardTitle className="text-base">{reward.name}</CardTitle>
          </div>
          <Badge
            variant={isUnlocked ? "secondary" : "outline"}
            className="flex items-center gap-1"
          >
            {isUnlocked ? (
              <>
                <Unlock className="h-3 w-3" /> Unlocked
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" /> Level {reward.unlockLevel}
              </>
            )}
          </Badge>
        </div>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        {reward.coinCost && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Coins className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
            <span>{reward.coinCost} coins</span>
          </div>
        )}
      </CardContent>
      {isUnlocked && (
        <CardFooter className="pt-0">
          {reward.coinCost ? (
            <Button
              variant={canPurchase ? "default" : "outline"}
              size="sm"
              className="w-full"
              disabled={!canPurchase}
              onClick={onUseCoins}
            >
              {canPurchase ? (
                <>Use {reward.coinCost} coins</>
              ) : (
                <>Need {reward.coinCost - coins} more coins</>
              )}
            </Button>
          ) : isPowerUp ? (
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={onActivate}
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" /> Activate
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full">
              {reward.type === "theme" ? "Apply Theme" : "Use"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RewardsView;
