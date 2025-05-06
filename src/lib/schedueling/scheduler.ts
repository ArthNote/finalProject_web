import { TaskType } from "../../types/task";

// Keep existing types and interfaces unchanged
export type TaskSelectionMode = "unscheduled" | "reschedule" | "full";
export type TimePeriodType = "today" | "tomorrow" | "this_week" | "custom";

export interface TimePeriod {
  type: TimePeriodType;
  customRange?: {
    start: Date;
    end: Date;
  };
}

export interface OptimizationOptions {
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
}

export interface BlockedInterval {
  start: string;
  end: string;
  recurring?: boolean;
}

export interface DaySchedule {
  day: number;
  availableFrom: string;
  availableTo: string;
  blockedIntervals?: BlockedInterval[];
}

interface SchedulingOptions {
  defaultDuration?: number;
  maxTasksPerDay?: number;
  maxHoursPerDay?: number;
  energyLevels?: {
    highEnergyHours: string[];
    mediumEnergyHours: string[];
    lowEnergyHours: string[];
  };
  priorityLimits?: {
    high: number;
    medium: number;
    low: number;
    urgent: number;
  };
  timeSlotInterval?: number;
  breakBetweenTasks?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  dailySchedule?: DaySchedule[];
  taskSelectionMode?: TaskSelectionMode;
  timePeriod?: TimePeriod;
  optimization?: OptimizationOptions;
}

type BaseOptions = Required<Omit<SchedulingOptions, "dateRange">> & {
  dailySchedule: DaySchedule[];
  taskSelectionMode: TaskSelectionMode;
  timePeriod: TimePeriod;
  optimization: OptimizationOptions;
};

// Keep DEFAULT_DAILY_SCHEDULE and DEFAULT_OPTIONS unchanged
const DEFAULT_DAILY_SCHEDULE: DaySchedule[] = [
  {
    day: 1,
    availableFrom: "08:00",
    availableTo: "18:00",
    blockedIntervals: [{ start: "12:00", end: "13:00" }],
  },
  {
    day: 2,
    availableFrom: "08:00",
    availableTo: "18:00",
    blockedIntervals: [{ start: "12:00", end: "13:00" }],
  },
  {
    day: 3,
    availableFrom: "08:00",
    availableTo: "18:00",
    blockedIntervals: [{ start: "12:00", end: "13:00" }],
  },
  {
    day: 4,
    availableFrom: "08:00",
    availableTo: "18:00",
    blockedIntervals: [{ start: "12:00", end: "13:00" }],
  },
  {
    day: 5,
    availableFrom: "08:00",
    availableTo: "18:00",
    blockedIntervals: [{ start: "12:00", end: "13:00" }],
  },
];

const DEFAULT_OPTIONS: BaseOptions = {
  defaultDuration: 45,
  maxTasksPerDay: 6,
  maxHoursPerDay: 7,
  energyLevels: {
    highEnergyHours: ["08:00", "09:00", "10:00", "14:00"],
    mediumEnergyHours: ["11:00", "15:00", "16:00"],
    lowEnergyHours: ["13:00", "17:00", "18:00"],
  },
  priorityLimits: {
    urgent: 2,
    high: 2,
    medium: 3,
    low: 3,
  },
  timeSlotInterval: 15,
  breakBetweenTasks: 10,
  dailySchedule: DEFAULT_DAILY_SCHEDULE,
  taskSelectionMode: "full",
  timePeriod: { type: "today" },
  optimization: {
    respectFixedAppointments: true,
    addBreaks: {
      enabled: true,
      lunchBreak: {
        start: "12:00",
        duration: 60,
      },
      shortBreaks: {
        frequency: 90,
        duration: 10,
      },
    },
    optimizeFocusTime: true,
  },
};

// Priority mapping for sorting
const priorityMap: { [key in TaskType["priority"]]: number } = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

// Energy level requirements by priority
const priorityEnergyMap: {
  [key in TaskType["priority"]]: ("high" | "medium" | "low")[];
} = {
  high: ["high"],
  medium: ["high", "medium"],
  low: ["high", "medium", "low"],
  urgent: ["high", "medium", "low"],
};

// Utility functions for time manipulation
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Validate a date is within the scheduling range
 */
function isDateInRange(
  date: Date,
  range?: { start: Date; end: Date }
): boolean {
  if (!range) return true;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const rangeStart = new Date(range.start);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(range.end);
  rangeEnd.setHours(23, 59, 59, 999);

  return startOfDay >= rangeStart && endOfDay <= rangeEnd;
}

// Time period management
function getTimePeriodRange(
  period: TimePeriod,
  dailySchedule: DaySchedule[] = DEFAULT_DAILY_SCHEDULE
): { start: Date; end: Date } {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  switch (period.type) {
    case "today": {
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      return { start: today, end: endOfToday };
    }
    case "tomorrow": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      return { start: tomorrow, end: endOfTomorrow };
    }
    case "this_week": {
      const allowedDays = dailySchedule.map((schedule) => schedule.day).sort();
      if (allowedDays.length === 0) return { start: today, end: today };

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      let startDate = new Date(today);
      while (
        !allowedDays.includes(startDate.getDay()) &&
        startDate <= endOfWeek
      ) {
        startDate.setDate(startDate.getDate() + 1);
      }

      let endDate = new Date(endOfWeek);
      while (!allowedDays.includes(endDate.getDay()) && endDate >= today) {
        endDate.setDate(endDate.getDate() - 1);
      }

      if (startDate > endDate) {
        startDate = new Date(endOfWeek);
        startDate.setDate(startDate.getDate() + 1);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        while (
          !allowedDays.includes(startDate.getDay()) &&
          startDate <= endDate
        ) {
          startDate.setDate(startDate.getDate() + 1);
        }
        while (
          !allowedDays.includes(endDate.getDay()) &&
          endDate >= startDate
        ) {
          endDate.setDate(endDate.getDate() - 1);
        }
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return { start: startDate, end: endDate };
    }
    case "custom": {
      if (!period.customRange) {
        throw new Error("Custom time period requires date range");
      }
      const customStart = new Date(period.customRange.start);
      customStart.setHours(0, 0, 0, 0);
      const customEnd = new Date(period.customRange.end);
      customEnd.setHours(23, 59, 59, 999);
      return { start: customStart, end: customEnd };
    }
  }
}

// Task scheduling constraints checking
function isTimeBlocked(
  date: Date,
  blockedIntervals: BlockedInterval[] | undefined
): boolean {
  if (!blockedIntervals?.length) return false;

  const timeStr = date.toTimeString().slice(0, 5);
  const minutes = timeToMinutes(timeStr);

  return blockedIntervals.some((interval) => {
    const intervalStart = timeToMinutes(interval.start);
    const intervalEnd = timeToMinutes(interval.end);
    return minutes >= intervalStart && minutes < intervalEnd;
  });
}

function isBreakTime(slot: Date, options: BaseOptions): boolean {
  const timeStr = slot.toTimeString().slice(0, 5);

  if (!options.optimization.addBreaks.enabled) return false;

  if (options.optimization.addBreaks.lunchBreak) {
    const lunchStart = timeToMinutes(
      options.optimization.addBreaks.lunchBreak.start
    );
    const lunchEnd =
      lunchStart + options.optimization.addBreaks.lunchBreak.duration;
    const slotMinutes = timeToMinutes(timeStr);
    if (slotMinutes >= lunchStart && slotMinutes < lunchEnd) {
      return true;
    }
  }

  if (options.optimization.addBreaks.shortBreaks) {
    const { frequency, duration } = options.optimization.addBreaks.shortBreaks;
    const startOfDay = new Date(slot);
    startOfDay.setHours(9, 0, 0, 0);
    const minutesSinceStart = (slot.getTime() - startOfDay.getTime()) / 60000;
    if (minutesSinceStart % frequency < duration) {
      return true;
    }
  }

  return false;
}

// Helper for checking task overlap and break times
function hasTaskOverlap(
  task: TaskType,
  existingTasks: TaskType[],
  breakMinutes: number
): boolean {
  if (!task.startTime || !task.endTime) return false;

  for (const existing of existingTasks) {
    if (!existing.startTime || !existing.endTime) continue;

    const taskStart = task.startTime.getTime();
    const taskEnd = task.endTime.getTime() + breakMinutes * 60000;
    const existingStart = existing.startTime.getTime();
    const existingEnd = existing.endTime.getTime() + breakMinutes * 60000;

    if (
      (taskStart >= existingStart && taskStart < existingEnd) ||
      (taskEnd > existingStart && taskEnd <= existingEnd) ||
      (taskStart <= existingStart && taskEnd >= existingEnd)
    ) {
      return true;
    }
  }

  return false;
}

// Get daily task statistics for a specific date
function getDailyStats(
  date: Date,
  tasks: TaskType[],
  options: BaseOptions
): {
  taskCount: number;
  totalDuration: number;
  priorityCounts: Record<TaskType["priority"], number>;
  totalMinutes: number;
} {
  const stats = {
    taskCount: 0,
    totalDuration: 0,
    priorityCounts: {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    totalMinutes: 0,
  };

  // Count tasks scheduled for this date
  for (const task of tasks) {
    if (task.startTime?.toDateString() === date.toDateString()) {
      stats.taskCount++;
      const duration = task.duration || options.defaultDuration;
      stats.totalDuration += duration;
      stats.totalMinutes += duration;
      stats.priorityCounts[task.priority]++;
    }
  }

  return stats;
}

// Core scheduling algorithm components
function findBestTimeSlot(
  task: TaskType,
  date: Date,
  existingTasks: TaskType[],
  options: BaseOptions
): Date | null {
  const daySchedule = options.dailySchedule.find(
    (s) => s.day === date.getDay()
  );
  if (!daySchedule) return null;

  // Check daily limits before attempting to schedule
  const stats = getDailyStats(date, existingTasks, options);
  if (stats.taskCount >= options.maxTasksPerDay) {
    return null;
  }
  if (
    stats.priorityCounts[task.priority] >= options.priorityLimits[task.priority]
  ) {
    return null;
  }
  if (
    stats.totalMinutes + (task.duration || options.defaultDuration) >
    options.maxHoursPerDay * 60
  ) {
    return null;
  }

  const startMinutes = timeToMinutes(daySchedule.availableFrom);
  const endMinutes = timeToMinutes(daySchedule.availableTo);
  const taskDuration = task.duration || options.defaultDuration;

  let bestSlot: Date | null = null;
  let bestScore = Infinity;

  for (
    let minutes = startMinutes;
    minutes <= endMinutes - taskDuration;
    minutes += options.timeSlotInterval
  ) {
    const slot = new Date(date);
    slot.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

    if (
      isTimeBlocked(slot, daySchedule.blockedIntervals) ||
      isBreakTime(slot, options)
    ) {
      continue;
    }

    const potentialTask = {
      ...task,
      startTime: new Date(slot),
      endTime: new Date(slot.getTime() + taskDuration * 60000),
    };

    if (
      hasTaskOverlap(potentialTask, existingTasks, options.breakBetweenTasks)
    ) {
      continue;
    }

    const slotEnergy = getEnergyLevel(slot, options.energyLevels);
    if (!priorityEnergyMap[task.priority].includes(slotEnergy)) {
      continue;
    }

    const score = calculateSlotScore(slot, task, existingTasks, options);
    if (score < bestScore) {
      bestScore = score;
      bestSlot = slot;
    }
  }

  return bestSlot;
}

function calculateSlotScore(
  slot: Date,
  task: TaskType,
  existingTasks: TaskType[],
  options: BaseOptions
): number {
  let score = 0;

  // Get daily stats for this date
  const stats = getDailyStats(slot, existingTasks, options);

  // Strongly prefer days that already have tasks (to maximize day utilization)
  if (stats.taskCount > 0) {
    score -= 200; // Big bonus for using a day that's already being used
  }

  // Prefer slots close to existing tasks
  const closestTask = existingTasks
    .filter((t) => t.startTime?.toDateString() === slot.toDateString())
    .reduce((closest, t) => {
      if (!t.startTime) return closest;
      const distance = Math.abs(t.startTime.getTime() - slot.getTime());
      return distance < closest ? distance : closest;
    }, Infinity);

  if (closestTask !== Infinity) {
    score -= Math.min(100, Math.floor(100000 / closestTask)); // More bonus for closer tasks
  }

  // Prefer slots that match task priority with energy levels
  const energy = getEnergyLevel(slot, options.energyLevels);
  if (task.priority === "urgent" || task.priority === "high") {
    score += energy === "high" ? 0 : 50;
  }

  // Optimize for focus time if enabled
  if (options.optimization.optimizeFocusTime) {
    const adjacentTasks = existingTasks.filter(
      (t) =>
        t.category === task.category &&
        t.startTime &&
        Math.abs(t.startTime.getTime() - slot.getTime()) <= 60 * 60 * 1000
    );
    score -= adjacentTasks.length * 50; // Increased bonus for adjacent similar tasks
  }

  // Consider task density
  const utilizationScore =
    (stats.totalMinutes / (options.maxHoursPerDay * 60)) * 100;
  score -= utilizationScore; // Prefer days with higher utilization

  return score;
}

// Helper to score a day's suitability for a task
function getDayScore(
  date: Date,
  task: TaskType,
  existingTasks: TaskType[],
  options: BaseOptions
): number {
  const stats = getDailyStats(date, existingTasks, options);
  let score = 0;

  // Prefer days that already have tasks but aren't too full
  if (stats.taskCount > 0) {
    score += 1000 - stats.taskCount * 100; // More tasks = lower bonus
  }

  // Consider similar task categories on this day
  const similarTasks = existingTasks.filter(
    (t) =>
      t.startTime?.toDateString() === date.toDateString() &&
      t.category === task.category
  ).length;
  if (similarTasks > 0) {
    score += similarTasks * 200; // Bonus for days with similar tasks
  }

  // Consider utilization - prefer days that are moderately filled
  const utilization = stats.totalMinutes / (options.maxHoursPerDay * 60);
  if (utilization > 0) {
    score += Math.floor((1 - Math.abs(0.5 - utilization)) * 500); // Peak score at 50% utilization
  }

  return score;
}

// Find available days within the date range that can accommodate the task
function findAvailableDays(
  task: TaskType,
  existingTasks: TaskType[],
  options: BaseOptions & { dateRange?: { start: Date; end: Date } }
): Date[] {
  const dateRange =
    options.dateRange ||
    getTimePeriodRange(options.timePeriod, options.dailySchedule);
  const availableDaysWithScores: { date: Date; score: number }[] = [];

  let currentDate = new Date(dateRange.start);
  while (currentDate <= dateRange.end) {
    const daySchedule = options.dailySchedule.find(
      (s) => s.day === currentDate.getDay()
    );
    if (daySchedule) {
      const stats = getDailyStats(currentDate, existingTasks, options);
      if (
        stats.taskCount < options.maxTasksPerDay &&
        stats.priorityCounts[task.priority] <
          options.priorityLimits[task.priority] &&
        stats.totalMinutes + (task.duration || options.defaultDuration) <=
          options.maxHoursPerDay * 60
      ) {
        const score = getDayScore(currentDate, task, existingTasks, options);
        availableDaysWithScores.push({
          date: new Date(currentDate),
          score,
        });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Sort days by score (highest first) and return just the dates
  return availableDaysWithScores
    .sort((a, b) => b.score - a.score)
    .map((item) => item.date);
}

// Main scheduling logic implementation
function scheduleTask(
  task: TaskType,
  existingTasks: TaskType[],
  options: BaseOptions & { dateRange?: { start: Date; end: Date } }
): TaskType | null {
  const availableDays = findAvailableDays(task, existingTasks, options);
  if (availableDays.length === 0) return null;

  let bestSlot: Date | null = null;
  let bestDate: Date | null = null;
  let bestScore = Infinity;

  // Try scheduling on preferred date first if it exists and is available
  if (task.date) {
    const prefDateStr = task.date.toDateString();
    const availablePrefDay = availableDays.find(
      (d) => d.toDateString() === prefDateStr
    );
    if (availablePrefDay) {
      const slot = findBestTimeSlot(
        task,
        availablePrefDay,
        existingTasks,
        options
      );
      if (slot) {
        bestSlot = slot;
        bestDate = availablePrefDay;
        bestScore = -Infinity; // Prefer preferred date over others
      }
    }
  }

  // If no preferred date or couldn't schedule on it, try other available days
  if (!bestSlot) {
    for (const date of availableDays) {
      const slot = findBestTimeSlot(task, date, existingTasks, options);
      if (slot) {
        const score = calculateSlotScore(slot, task, existingTasks, options);
        if (score < bestScore) {
          bestScore = score;
          bestSlot = slot;
          bestDate = date;
        }
      }
    }
  }

  if (bestSlot && bestDate) {
    return {
      ...task,
      date: bestDate,
      startTime: bestSlot,
      endTime: new Date(
        bestSlot.getTime() + (task.duration || options.defaultDuration) * 60000
      ),
      scheduled: true,
    };
  }

  return null;
}

function getEnergyLevel(
  time: Date,
  energyLevels = DEFAULT_OPTIONS.energyLevels
): "high" | "medium" | "low" {
  const timeStr = time.toTimeString().slice(0, 5);
  if (energyLevels.highEnergyHours.includes(timeStr)) return "high";
  if (energyLevels.mediumEnergyHours.includes(timeStr)) return "medium";
  return "low";
}

// Helper to get task score for sorting
function getTaskScore(task: TaskType, options: BaseOptions): number {
  let score = priorityMap[task.priority] * 1000; // Priority is most important
  if (task.date) score -= 100; // Prefer tasks with specific dates
  score += task.duration || options.defaultDuration; // Consider duration
  return score;
}

// Main scheduling function
// export function scheduleTasks(
//   tasks: TaskType[],
//   options: SchedulingOptions = {}
// ): TaskType[] {
//   const finalOptions: BaseOptions & { dateRange?: { start: Date; end: Date } } =
//     {
//       ...DEFAULT_OPTIONS,
//       ...options,
//     };

//   if (!finalOptions.dateRange && finalOptions.timePeriod) {
//     finalOptions.dateRange = getTimePeriodRange(
//       finalOptions.timePeriod,
//       finalOptions.dailySchedule
//     );
//   }

//   // Get existing scheduled tasks in range
//   const existingScheduled = tasks.filter(
//     (task) =>
//       task.scheduled &&
//       task.startTime &&
//       task.endTime &&
//       (!finalOptions.dateRange ||
//         isDateInRange(task.startTime, finalOptions.dateRange))
//   );

//   // Initialize result array
//   const scheduledTasks: TaskType[] = [];

//   switch (finalOptions.taskSelectionMode) {
//     case "unscheduled": {
//       // Keep existing tasks and add unscheduled ones
//       scheduledTasks.push(...existingScheduled);

//       // Sort unscheduled tasks by priority and other factors
//       const unscheduledTasks = tasks
//         .filter((task) => !task.scheduled)
//         .sort(
//           (a, b) =>
//             getTaskScore(a, finalOptions) - getTaskScore(b, finalOptions)
//         );

//       // Try to schedule each unscheduled task
//       for (const task of unscheduledTasks) {
//         const scheduledTask = scheduleTask(task, scheduledTasks, finalOptions);
//         if (scheduledTask) {
//           scheduledTasks.push(scheduledTask);
//         }
//       }
//       break;
//     }

//     case "reschedule": {
//       // Sort all tasks to reschedule by priority and other factors
//       const tasksToReschedule = existingScheduled
//         .sort(
//           (a, b) =>
//             getTaskScore(a, finalOptions) - getTaskScore(b, finalOptions)
//         )
//         .map((task) => ({
//           ...task,
//           scheduled: false,
//           startTime: undefined,
//           endTime: undefined,
//         }));

//       // Try to schedule each task
//       for (const task of tasksToReschedule) {
//         const scheduledTask = scheduleTask(task, scheduledTasks, finalOptions);
//         if (scheduledTask) {
//           scheduledTasks.push(scheduledTask);
//         }
//       }
//       break;
//     }

//     case "full": {
//       // Sort ALL tasks by priority and other factors
//       const allTasks = tasks
//         .sort(
//           (a, b) =>
//             getTaskScore(a, finalOptions) - getTaskScore(b, finalOptions)
//         )
//         .map((task) => ({
//           ...task,
//           scheduled: false,
//           startTime: undefined,
//           endTime: undefined,
//         }));

//       // Try to schedule each task
//       for (const task of allTasks) {
//         const scheduledTask = scheduleTask(task, scheduledTasks, finalOptions);
//         if (scheduledTask) {
//           scheduledTasks.push(scheduledTask);
//         }
//       }
//       break;
//     }
//   }

//   return scheduledTasks;
// }
