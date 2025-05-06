import { SchedulingMode } from "@/types/mode";
import { BarChart2, Sun, Zap, Settings } from "lucide-react";
import { SchedulerMode } from "./api/schedulerPrefs";

export const getIconForMode = (mode: any): React.ReactNode => {
  if (!mode || !mode.name) {
    return <Settings className="h-5 w-5 text-green-500" />;
  }

  const name = mode.name.toLowerCase();
  if (name.includes("productivity")) {
    return <BarChart2 className="h-5 w-5 text-purple-500" />;
  } else if (name.includes("wellbeing")) {
    return <Sun className="h-5 w-5 text-amber-500" />;
  } else if (name.includes("standard")) {
    return <Zap className="h-5 w-5 text-blue-500" />;
  } else {
    return <Settings className="h-5 w-5 text-green-500" />;
  }
};

export const BUILT_IN_MODES: SchedulingMode[] = [
  {
    id: "default",
    name: "Standard",
    description: "Balanced schedule with regular breaks",
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    isDefault: true,
    isBuiltIn: true,
    isPreferred: true,
    config: {
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
      dailySchedule: [
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
      ],
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
    },
  },
  {
    id: "productivity",
    name: "Productivity Focus",
    description: "Optimized for deep work and maximum productivity",
    icon: <BarChart2 className="h-5 w-5 text-purple-500" />,
    isDefault: false,
    isBuiltIn: true,
    isPreferred: false,
    config: {
      defaultDuration: 50,
      maxTasksPerDay: 5,
      maxHoursPerDay: 8,
      energyLevels: {
        highEnergyHours: ["08:00", "09:00", "10:00", "14:00", "15:00"],
        mediumEnergyHours: ["11:00", "16:00", "17:00"],
        lowEnergyHours: ["13:00", "18:00"],
      },
      priorityLimits: {
        urgent: 2,
        high: 3,
        medium: 2,
        low: 1,
      },
      timeSlotInterval: 25,
      breakBetweenTasks: 5,
      dailySchedule: [
        {
          day: 1,
          availableFrom: "07:00",
          availableTo: "19:00",
          blockedIntervals: [{ start: "12:30", end: "13:00" }],
        },
        {
          day: 2,
          availableFrom: "07:00",
          availableTo: "19:00",
          blockedIntervals: [{ start: "12:30", end: "13:00" }],
        },
        {
          day: 3,
          availableFrom: "07:00",
          availableTo: "19:00",
          blockedIntervals: [{ start: "12:30", end: "13:00" }],
        },
        {
          day: 4,
          availableFrom: "07:00",
          availableTo: "19:00",
          blockedIntervals: [{ start: "12:30", end: "13:00" }],
        },
        {
          day: 5,
          availableFrom: "07:00",
          availableTo: "19:00",
          blockedIntervals: [{ start: "12:30", end: "13:00" }],
        },
      ],
      optimization: {
        respectFixedAppointments: true,
        addBreaks: {
          enabled: true,
          lunchBreak: {
            start: "12:30",
            duration: 30,
          },
          shortBreaks: {
            frequency: 120,
            duration: 5,
          },
        },
        optimizeFocusTime: true,
      },
    },
  },
  {
    id: "wellbeing",
    name: "Wellbeing Focus",
    description: "Balanced workday with plenty of breaks",
    icon: <Sun className="h-5 w-5 text-amber-500" />,
    isDefault: false,
    isBuiltIn: true,
    isPreferred: false,
    config: {
      defaultDuration: 30,
      maxTasksPerDay: 5,
      maxHoursPerDay: 6,
      energyLevels: {
        highEnergyHours: ["09:00", "10:00", "15:00"],
        mediumEnergyHours: ["11:00", "14:00", "16:00"],
        lowEnergyHours: ["08:00", "12:00", "17:00"],
      },
      priorityLimits: {
        urgent: 1,
        high: 2,
        medium: 3,
        low: 3,
      },
      timeSlotInterval: 15,
      breakBetweenTasks: 15,
      dailySchedule: [
        {
          day: 1,
          availableFrom: "09:00",
          availableTo: "17:00",
          blockedIntervals: [{ start: "12:00", end: "13:30" }],
        },
        {
          day: 2,
          availableFrom: "09:00",
          availableTo: "17:00",
          blockedIntervals: [{ start: "12:00", end: "13:30" }],
        },
        {
          day: 3,
          availableFrom: "09:00",
          availableTo: "17:00",
          blockedIntervals: [{ start: "12:00", end: "13:30" }],
        },
        {
          day: 4,
          availableFrom: "09:00",
          availableTo: "17:00",
          blockedIntervals: [{ start: "12:00", end: "13:30" }],
        },
        {
          day: 5,
          availableFrom: "09:00",
          availableTo: "17:00",
          blockedIntervals: [{ start: "12:00", end: "13:30" }],
        },
      ],
      optimization: {
        respectFixedAppointments: true,
        addBreaks: {
          enabled: true,
          lunchBreak: {
            start: "12:00",
            duration: 90,
          },
          shortBreaks: {
            frequency: 60,
            duration: 15,
          },
        },
        optimizeFocusTime: false,
      },
    },
  },
];

// Convert API SchedulerMode to UI SchedulingMode
export function adaptApiModeToUiMode(apiMode: SchedulerMode): SchedulingMode {
  return {
    ...apiMode,
    icon: getIconForMode(apiMode),
  };
}

// Convert array of API modes to UI modes
export function adaptApiModesToUiModes(
  apiModes: SchedulerMode[]
): SchedulingMode[] {
  return apiModes.map((mode) => adaptApiModeToUiMode(mode));
}
