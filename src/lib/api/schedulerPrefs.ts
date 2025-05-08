import { consts } from "../constants";

export interface SchedulerModeConfig {
  defaultDuration: number;
  maxTasksPerDay: number;
  considerMood?: boolean;
  maxHoursPerDay: number;
  energyLevels: {
    highEnergyHours: string[];
    mediumEnergyHours: string[];
    lowEnergyHours: string[];
  };
  priorityLimits: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  timeSlotInterval: number;
  breakBetweenTasks: number;
  dailySchedule: Array<{
    day: number;
    availableFrom: string;
    availableTo: string;
    blockedIntervals?: Array<{
      start: string;
      end: string;
      recurring?: boolean;
    }>;
  }>;
  optimization: {
    respectFixedAppointments: boolean;
    addBreaks: {
      enabled: boolean;
      lunchBreak?: {
        start: string;
        duration: number;
      };
      shortBreaks?: {
        frequency: number;
        duration: number;
      };
    };
    optimizeFocusTime: boolean;
  };
}

export interface SchedulerMode {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  isBuiltIn: boolean;
  isPreferred: boolean;
  config: SchedulerModeConfig;
}

export interface SchedulerModeResponse {
  success: boolean;
  modes?: SchedulerMode[];
  mode?: SchedulerMode;
  message?: string;
  error?: any;
}

// Get all scheduler modes
export async function getSchedulerModes(): Promise<SchedulerModeResponse> {
  try {
    const response = await fetch(`${consts.backend}/scheduler-prefs`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch scheduler modes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching scheduler modes:", error);
    throw error;
  }
}

// Create a new scheduler mode
export async function createSchedulerMode(
  mode: Omit<SchedulerMode, "id" | "isDefault" | "isBuiltIn">
): Promise<SchedulerModeResponse> {
  try {
    const response = await fetch(`${consts.backend}/scheduler-prefs`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mode),
    });

    if (!response.ok) {
      throw new Error("Failed to create scheduler mode");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating scheduler mode:", error);
    throw error;
  }
}

// Update an existing scheduler mode
export async function updateSchedulerMode(
  id: string,
  updates: Partial<Omit<SchedulerMode, "id" | "isDefault" | "isBuiltIn">>
): Promise<SchedulerModeResponse> {
  try {
    const response = await fetch(`${consts.backend}/scheduler-prefs/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update scheduler mode");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating scheduler mode:", error);
    throw error;
  }
}

// Delete a scheduler mode
export async function deleteSchedulerMode(
  id: string
): Promise<SchedulerModeResponse> {
  try {
    const response = await fetch(`${consts.backend}/scheduler-prefs/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete scheduler mode");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting scheduler mode:", error);
    throw error;
  }
}

// Set a mode as preferred
export async function setPreferredMode(
  id: string,
  isBuiltIn: boolean
): Promise<SchedulerModeResponse> {
  try {
    const response = await fetch(
      `${consts.backend}/scheduler-prefs/preferred/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBuiltIn }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to set preferred mode");
    }

    return await response.json();
  } catch (error) {
    console.error("Error setting preferred mode:", error);
    throw error;
  }
}

// Get current preferred mode
export async function getPreferredMode(): Promise<SchedulerModeResponse> {
  try {
    const response = await fetch(
      `${consts.backend}/scheduler-prefs/preferred`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch preferred mode");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching preferred mode:", error);
    throw error;
  }
}
