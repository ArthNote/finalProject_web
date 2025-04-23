// Task type definition that can be used throughout the application

import { TaskType } from "@/types/task";

// Get today's date and format it
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Helper function to create ISO date strings with specific times
const createDateISOString = (
  date: Date,
  hours: number,
  minutes: number = 0
) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

const createDateTime = (date: Date, hours: number, minutes: number = 0) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};








// Calculate task duration in minutes
export const calculateTaskDuration = (startTime: Date, endTime: Date): number => {
  return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
};

// Update task times

