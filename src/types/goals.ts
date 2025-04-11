export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "not-started" | "active" | "on-hold" | "completed";
  priority: "low" | "medium" | "high";
  progress: number;
  deadline: string;
  createdAt: string;
  tags: string[];
  members: Member[];
}

export interface Milestone {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "completed";
  dueDate: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  xp: number;
  progress: number;
  status: GoalStatus;
  linkedTasks?: string[];
  completedAt?: string;
  icon?: React.ReactNode;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  level: number;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: string;
}
type GoalType = "daily" | "weekly" | "monthly" | "milestone";
type GoalStatus = "in-progress" | "completed" | "locked";

// Interfaces for the gamified goals system

export interface GamifiedGoal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  xp: number;
  dueDate?: string;
  category?: string;
  tags?: string[];
}

export interface UserProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  longestStreak: number;
  completedMilestones: number;
  totalMilestones: number;
}

export interface GameMilestone {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon: string;
  xpReward: number;
}

export interface ProgressStat {
  label: string;
  value: number;
  prevValue?: number;
  change?: number;
  color?: string;
}

// Interfaces for the level-up rewards system

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  category: RewardCategory;
  unlockLevel: number;
  coinCost?: number;
  icon: string;
  unlocked: boolean;
  preview?: string; // URL or data for preview image
  highlighted?: boolean;
}

export type RewardType =
  | "theme"
  | "avatar"
  | "badge"
  | "icon"
  | "power-up"
  | "widget"
  | "analytics"
  | "task-type"
  | "sound"
  | "background"
  | "title"
  | "quote"
  | "social";

export type RewardCategory =
  | "cosmetic"
  | "functional"
  | "social"
  | "power-up"
  | "motivational";

export interface UserRewards {
  coins: number;
  equippedItems: {
    theme?: string;
    avatar?: string;
    badge?: string;
    title?: string;
    background?: string;
  };
  inventory: string[]; // IDs of unlocked reward items
  activePowerUps: PowerUp[];
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  duration: number; // in hours
  startTime?: string; // ISO date string
  icon: string;
  effect: string;
}

export interface StreakCardProps {
  streak: number;
  longestStreak: number;
}

export interface ProgressAnalyticsProps {
  stats: ProgressStat[];
}
