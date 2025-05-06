export interface UserProgress {
  id: string;
  level: number;
  currentXP: number;
  totalXP: number;
  streakDays: number;
  longestStreak: number;
  lastStreakDate: string;
  goals: Goal[];
  rewards: UserReward[];
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  type: "DAILY" | "WEEKLY" | "MONTHLY" | "MILESTONE";
  xpReward: number;
  progress: number;
  status: "in-progress" | "completed";
  startDate: string;
  endDate: string | null;
  completedAt: string | null;
}

export interface UserReward {
  id: string;
  rewardId: string;
  unlocked: boolean;
  equipped: boolean;
  unlockedAt: string | null;
  reward: Reward;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type:
    | "THEME"
    | "AVATAR"
    | "BADGE"
    | "POWER_UP"
    | "TITLE"
    | "BACKGROUND"
    | "WIDGET"
    | "FEATURE";
  unlockLevel: number | null;
  cost: number | null;
  icon: string;
  userRewards?: UserReward[];
}
