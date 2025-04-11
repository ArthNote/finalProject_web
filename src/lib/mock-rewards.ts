import { RewardItem, PowerUp, UserRewards } from "@/types/goals";

// Available rewards that can be unlocked
export const rewardItems: RewardItem[] = [
  // Themes
  {
    id: "theme-1",
    name: "Dark Neon",
    description: "A sleek dark theme with neon accents",
    type: "theme",
    category: "cosmetic",
    unlockLevel: 3,
    icon: "🌙",
    unlocked: true,
    preview: "/themes/dark-neon.png",
  },
  {
    id: "theme-2",
    name: "Minimalist",
    description: "Clean, distraction-free interface",
    type: "theme",
    category: "cosmetic",
    unlockLevel: 5,
    icon: "◽",
    unlocked: false,
    preview: "/themes/minimalist.png",
  },
  {
    id: "theme-3",
    name: "Retro Wave",
    description: "80s inspired design with vibrant colors",
    type: "theme",
    category: "cosmetic",
    unlockLevel: 8,
    icon: "🌈",
    unlocked: false,
    preview: "/themes/retro.png",
  },

  // Avatars & Icons
  {
    id: "badge-1",
    name: "Task Beginner",
    description: "Your first steps in productivity",
    type: "badge",
    category: "cosmetic",
    unlockLevel: 1,
    icon: "🔰",
    unlocked: true,
  },
  {
    id: "badge-2",
    name: "Task Master",
    description: "You've become proficient at managing tasks",
    type: "badge",
    category: "cosmetic",
    unlockLevel: 10,
    icon: "🏆",
    unlocked: false,
    highlighted: true,
  },
  {
    id: "badge-3",
    name: "Productivity Beast",
    description: "You're in the top tier of productivity",
    type: "badge",
    category: "cosmetic",
    unlockLevel: 20,
    icon: "👑",
    unlocked: false,
  },
  {
    id: "avatar-1",
    name: "Rocket Avatar",
    description: "Show your productivity is skyrocketing",
    type: "avatar",
    category: "cosmetic",
    unlockLevel: 7,
    icon: "🚀",
    unlocked: false,
  },

  // Power-Ups
  {
    id: "power-1",
    name: "Double XP Boost",
    description: "Earn double XP for all completed tasks for 24 hours",
    type: "power-up",
    category: "power-up",
    unlockLevel: 5,
    coinCost: 50,
    icon: "⚡",
    unlocked: true,
  },
  {
    id: "power-2",
    name: "Streak Shield",
    description: "Protects your streak from one missed day",
    type: "power-up",
    category: "power-up",
    unlockLevel: 8,
    coinCost: 75,
    icon: "🛡️",
    unlocked: false,
  },
  {
    id: "power-3",
    name: "Focus Mode",
    description: "Boosts XP gains by 50% for deep work sessions",
    type: "power-up",
    category: "power-up",
    unlockLevel: 12,
    coinCost: 100,
    icon: "🔍",
    unlocked: false,
  },

  // Functional Upgrades
  {
    id: "widget-1",
    name: "Goal Heatmap",
    description: "Visualize your productivity patterns over time",
    type: "widget",
    category: "functional",
    unlockLevel: 6,
    icon: "📊",
    unlocked: false,
  },
  {
    id: "widget-2",
    name: "Mood Tracker",
    description: "Track your mood alongside your productivity",
    type: "widget",
    category: "functional",
    unlockLevel: 9,
    icon: "😊",
    unlocked: false,
  },
  {
    id: "analytics-1",
    name: "Advanced Analytics",
    description: "Get detailed insights into your productivity patterns",
    type: "analytics",
    category: "functional",
    unlockLevel: 15,
    icon: "📈",
    unlocked: false,
    highlighted: true,
  },

  // Social Features
  {
    id: "social-1",
    name: "Team Challenges",
    description: "Create and participate in team productivity challenges",
    type: "social",
    category: "social",
    unlockLevel: 10,
    icon: "👥",
    unlocked: false,
  },

  // Motivational
  {
    id: "quote-1",
    name: "Daily Quotes",
    description: "Start each day with an inspirational quote",
    type: "quote",
    category: "motivational",
    unlockLevel: 4,
    icon: "💭",
    unlocked: true,
  },
  {
    id: "title-1",
    name: "Task Wizard",
    description: "Add this prestigious title to your profile",
    type: "title",
    category: "cosmetic",
    unlockLevel: 12,
    icon: "🧙‍♂️",
    unlocked: false,
  },
];

// Active power-ups for the user
export const activePowerUps: PowerUp[] = [
  {
    id: "active-double-xp",
    name: "Double XP",
    description: "Earning double XP from all completed tasks",
    duration: 24,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // Started 5 hours ago
    icon: "⚡",
    effect: "xp_multiplier_2x",
  },
];

// User's reward status
export const userRewards: UserRewards = {
  coins: 285,
  equippedItems: {
    theme: "theme-1",
    badge: "badge-1",
  },
  inventory: ["theme-1", "badge-1", "power-1", "quote-1"],
  activePowerUps: activePowerUps,
};

// Helper functions
export const getRewardById = (id: string): RewardItem | undefined => {
  return rewardItems.find((item) => item.id === id);
};

export const getNextUnlockableRewards = (
  currentLevel: number,
  count: number = 3
): RewardItem[] => {
  return rewardItems
    .filter((reward) => !reward.unlocked && reward.unlockLevel > currentLevel)
    .sort((a, b) => a.unlockLevel - b.unlockLevel)
    .slice(0, count);
};

export const getRewardsByCategory = (category: string): RewardItem[] => {
  return rewardItems.filter((reward) => reward.category === category);
};

export const getUnlockedRewards = (): RewardItem[] => {
  return rewardItems.filter((reward) => reward.unlocked);
};

export const getHighlightedRewards = (): RewardItem[] => {
  return rewardItems.filter((reward) => reward.highlighted);
};
