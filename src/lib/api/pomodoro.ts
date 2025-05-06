import {
  FocusSessionType,
  FocusSessionResponse,
  FocusSessionsResponse,
  FocusSessionStatsResponse,
} from "@/types/pomodoro";
import { consts } from "../constants";

/**
 * Save a completed focus session to the database
 */
export async function saveFocusSession(
  sessionData: FocusSessionType
): Promise<FocusSessionResponse> {
  try {
    const response = await fetch(`${consts.backend}/pomodoro/sessions`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error("Failed to save focus session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving focus session:", error);
    throw error;
  }
}

/**
 * Get focus session history for the current user
 */
export async function getFocusSessions(
  timeframe: "day" | "week" | "month" | "all" = "week"
): Promise<FocusSessionsResponse> {
  try {
    const params = new URLSearchParams({ timeframe });

    const response = await fetch(
      `${consts.backend}/pomodoro/sessions?${params}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch focus sessions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching focus sessions:", error);
    throw error;
  }
}

/**
 * Get focus session statistics for the current user
 */
export async function getFocusSessionStats(
  timeframe: "day" | "week" | "month" | "all" = "week"
): Promise<FocusSessionStatsResponse> {
  try {
    const params = new URLSearchParams({ timeframe });

    const response = await fetch(`${consts.backend}/pomodoro/stats?${params}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch focus session stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching focus session stats:", error);
    throw error;
  }
}
