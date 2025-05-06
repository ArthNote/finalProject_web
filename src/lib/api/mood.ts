import { MoodEntry, MoodResponse, MoodHistoryResponse } from "@/types/mood";
import { consts } from "../constants";

/**
 * Get today's mood entry for the current user
 */
export async function getTodaysMood(): Promise<MoodResponse> {
  try {
    const response = await fetch(`${consts.backend}/mood/today`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch today's mood");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching today's mood:", error);
    throw error;
  }
}

/**
 * Get mood entries history for the current user
 */
export async function getMoodHistory(
  limit: number = 30
): Promise<MoodHistoryResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(`${consts.backend}/mood/history?${params}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mood history");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching mood history:", error);
    throw error;
  }
}

/**
 * Save a new mood entry or update an existing one
 */
export async function saveMoodEntry(
  entry: Omit<MoodEntry, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<MoodResponse> {
  try {
    const response = await fetch(`${consts.backend}/mood`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error("Failed to save mood entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving mood entry:", error);
    throw error;
  }
}

/**
 * Get mood entry for a specific date
 */
export async function getMoodByDate(date: string): Promise<MoodResponse> {
  try {
    const response = await fetch(`${consts.backend}/mood/date/${date}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mood for date");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching mood for date:", error);
    throw error;
  }
}

/**
 * Delete a mood entry
 */
export async function deleteMoodEntry(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${consts.backend}/mood/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete mood entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting mood entry:", error);
    throw error;
  }
}
