import { UserProgress, Goal, Reward, UserReward } from "@/types/gamification";
import { consts } from "../constants";

interface UserProgressResponse {
  message: string;
  success: boolean;
  data: UserProgress;
  allGoalsCompleted: any;
}

export async function getUserProgress(): Promise<UserProgressResponse> {
  const response = await fetch(`${consts.backend}/goals/progress`, {
    credentials: "include",
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch user progress");
  return response.json();
}

export async function getGoals(): Promise<Goal[]> {
  const response = await fetch(`${consts.backend}/goals/goals`, {
    credentials: "include",
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch goals");
  return response.json();
}

export async function updateGoalProgress(
  goalId: string,
  progress: number
): Promise<void> {
  const response = await fetch(
    `${consts.backend}/goals/goals/${goalId}/progress`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    }
  );
  if (!response.ok) throw new Error("Failed to update goal progress");
}

export async function updateStreak(): Promise<void> {
  const response = await fetch(`${consts.backend}/goals/streak`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update streak");
}

export async function getRewards(): Promise<Reward[]> {
  const response = await fetch(`${consts.backend}/goals/rewards`, {
    credentials: "include",
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch rewards");
  return response.json();
}

export async function getUnlockedRewards(): Promise<UserReward[]> {
  const response = await fetch(`${consts.backend}/goals/rewards/unlocked`, {
    credentials: "include",
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch rewards");
  return response.json();
}

export async function unlockReward(rewardId: string): Promise<void> {
  const response = await fetch(
    `${consts.backend}/goals/rewards/${rewardId}/unlock`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to unlock reward");
}

export async function generateGoals(): Promise<void> {
  const response = await fetch(`${consts.backend}/goals/generate`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to generate goals");
}
