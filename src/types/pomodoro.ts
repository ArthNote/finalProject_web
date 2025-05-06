export interface FocusSessionType {
  id?: string;
  userId?: string;
  duration: number; // duration in minutes
  type: "work" | "shortBreak" | "longBreak";
  completed: boolean;
  startTime: Date | string;
  endTime?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface FocusSessionResponse {
  message: string;
  success: boolean;
  data?: FocusSessionType;
}

export interface FocusSessionsResponse {
  message: string;
  success: boolean;
  data?: FocusSessionType[];
  stats?: {
    totalWorkMinutes: number;
    totalSessions: number;
    streak: number;
  };
}

export interface FocusSessionStatsResponse {
  message: string;
  success: boolean;
  data: {
    totalWorkMinutes: number;
    totalSessions: number;
    dailySessions: {
      date: string;
      minutes: number;
      sessions: number;
    }[];
    streak: number;
  };
}
