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

export interface SchedulingMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isDefault: boolean;
  isBuiltIn: boolean;
  isPreferred: boolean;
  config: {
    defaultDuration: number;
    maxTasksPerDay: number;
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
    dailySchedule: DaySchedule[];
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
    considerMood: boolean;
  };
}
