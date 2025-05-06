export type MoodType = "great" | "good" | "neutral" | "bad" | "awful";

export interface MoodEntry {
  id?: string;
  userId?: string;
  mood: string;
  energy: number;
  note?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MoodHistoryResponse {
  success: boolean;
  data: MoodEntry[];
  message?: string;
}

export interface MoodResponse {
  success: boolean;
  data: MoodEntry | null;
  message?: string;
}
