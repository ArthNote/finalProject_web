import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Sun, Sunset, Moon, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const [selectedHour, setSelectedHour] = React.useState(
    parseInt(value.split(":")[0])
  );
  const [selectedMinute, setSelectedMinute] = React.useState(
    parseInt(value.split(":")[1])
  );

  const formatAMPM = (hour: number) => {
    return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[150px] pl-3 text-left font-mono hover:bg-accent/20",
            !value && "text-muted-foreground"
          )}
        >
          {value}
          <span className="ml-1 text-xs text-muted-foreground">
            {selectedHour >= 12 ? "PM" : "AM"}
          </span>
          <Clock className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-1">
          <div className="py-2 px-3">
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Hours
            </div>
            <div className="grid grid-cols-6 gap-1">
              {hours.map((hour) => (
                <button
                  key={hour}
                  onClick={() => {
                    setSelectedHour(hour);
                    onChange(
                      `${hour.toString().padStart(2, "0")}:${selectedMinute
                        .toString()
                        .padStart(2, "0")}`
                    );
                  }}
                  className={cn(
                    "p-2 text-xs rounded-md transition-all duration-150 hover:bg-accent",
                    selectedHour === hour &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {hour.toString().padStart(2, "0")}
                  <div className="text-[10px] opacity-60">
                    {formatAMPM(hour)}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t py-2 px-3">
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Minutes
            </div>
            <div className="flex justify-between gap-1">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  onClick={() => {
                    setSelectedMinute(minute);
                    onChange(
                      `${selectedHour.toString().padStart(2, "0")}:${minute
                        .toString()
                        .padStart(2, "0")}`
                    );
                  }}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm transition-all duration-150 hover:bg-accent",
                    selectedMinute === minute &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {minute.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DAYS = [
  { id: "monday", short: "Mon", full: "Monday" },
  { id: "tuesday", short: "Tue", full: "Tuesday" },
  { id: "wednesday", short: "Wed", full: "Wednesday" },
  { id: "thursday", short: "Thu", full: "Thursday" },
  { id: "friday", short: "Fri", full: "Friday" },
  { id: "saturday", short: "Sat", full: "Saturday" },
  { id: "sunday", short: "Sun", full: "Sunday" },
] as const;

const ENERGY_BLOCKS = [
  {
    id: "early-morning",
    label: "Early Morning",
    time: "6AM - 9AM",
    icon: Sun,
    gradient: "from-yellow-500/70 to-orange-500/70",
  },
  {
    id: "morning",
    label: "Morning",
    time: "9AM - 12PM",
    icon: Sun,
    gradient: "from-yellow-400/70 to-yellow-500/70",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    time: "12PM - 3PM",
    icon: Sun,
    gradient: "from-blue-400/70 to-blue-500/70",
  },
  {
    id: "late-afternoon",
    label: "Late Afternoon",
    time: "3PM - 6PM",
    icon: Sunset,
    gradient: "from-orange-400/70 to-pink-500/70",
  },
  {
    id: "evening",
    label: "Evening",
    time: "6PM - 9PM",
    icon: Moon,
    gradient: "from-indigo-400/70 to-purple-500/70",
  },
] as const;

const ENERGY_LEVELS = [
  { id: "high", label: "High", gradient: "from-green-400 to-emerald-600" },
  { id: "medium", label: "Medium", gradient: "from-yellow-400 to-orange-500" },
  { id: "low", label: "Low", gradient: "from-red-400 to-rose-600" },
] as const;

interface Preferences {
  workDays: string[];
  workHours: {
    start: string;
    end: string;
  };
  energyLevels: {
    [key: string]: string;
  };
  taskSettings: {
    defaultDuration: number;
    breakDuration: number;
    maxTasksPerDay: number;
    minBreakBetweenTasks: number;
  };
  autoScheduling: boolean;
}

const PreferencesTab: React.FC = () => {
  const [preferences, setPreferences] = React.useState<Preferences>({
    workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    workHours: {
      start: "09:00",
      end: "17:00",
    },
    energyLevels: {
      "early-morning": "medium",
      morning: "high",
      afternoon: "medium",
      "late-afternoon": "medium",
      evening: "low",
    },
    taskSettings: {
      defaultDuration: 30,
      breakDuration: 15,
      maxTasksPerDay: 8,
      minBreakBetweenTasks: 10,
    },
    autoScheduling: true,
  });

  return (
    <div className="py-6">
      <div className="max-w-[1000px] mx-auto space-y-12">
        {/* Work Schedule */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Work Schedule</h2>
            <p className="text-muted-foreground mt-2">
              Set your working hours and available days
            </p>
          </div>

          <div className="grid gap-8">
            <div className="bg-muted/40 rounded-2xl p-6">
              <Label className="text-base mb-4 block">Working Days</Label>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => {
                      setPreferences((prev) => ({
                        ...prev,
                        workDays: prev.workDays.includes(day.id)
                          ? prev.workDays.filter((d) => d !== day.id)
                          : [...prev.workDays, day.id],
                      }));
                    }}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      preferences.workDays.includes(day.id)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/50 hover:border-border hover:bg-background"
                    )}
                  >
                    <span className="text-sm font-medium">{day.short}</span>
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-200",
                        preferences.workDays.includes(day.id)
                          ? "bg-primary scale-100"
                          : "bg-border scale-75"
                      )}
                    />
                    {preferences.workDays.includes(day.id) && (
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10 rounded-xl" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted/40 rounded-2xl p-6">
              <Label className="text-base mb-4 block">Working Hours</Label>
              <div className="flex items-center gap-4">
                <TimeSelect
                  value={preferences.workHours.start}
                  onChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      workHours: { ...prev.workHours, start: value },
                    }))
                  }
                />
                <Minus className="h-4 w-4 text-muted-foreground" />
                <TimeSelect
                  value={preferences.workHours.end}
                  onChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      workHours: { ...prev.workHours, end: value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Energy Levels */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Energy Levels</h2>
            <p className="text-muted-foreground mt-2">
              Define your typical energy levels throughout the day
            </p>
          </div>

          <div className="bg-muted/40 rounded-2xl p-6">
            <div className="grid gap-6">
              {ENERGY_BLOCKS.map((block) => (
                <div key={block.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <block.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{block.label}</span>
                    <span className="text-xs">({block.time})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {ENERGY_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => {
                          setPreferences((prev) => ({
                            ...prev,
                            energyLevels: {
                              ...prev.energyLevels,
                              [block.id]: level.id,
                            },
                          }));
                        }}
                        className={cn(
                          "group relative p-3 rounded-xl border-2 transition-all duration-200 overflow-hidden",
                          preferences.energyLevels[block.id] === level.id
                            ? "border-primary shadow-sm"
                            : "border-border/50 hover:border-border hover:bg-background"
                        )}
                      >
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {level.label}
                          </span>
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-200 group-hover:scale-110",
                              `bg-gradient-to-r ${level.gradient}`
                            )}
                          />
                        </div>
                        {preferences.energyLevels[block.id] === level.id && (
                          <div
                            className={cn(
                              "absolute inset-0 opacity-10 -z-10",
                              `bg-gradient-to-r ${level.gradient}`
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Task Settings */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Task Settings</h2>
            <p className="text-muted-foreground mt-2">
              Configure how tasks are created and scheduled
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-muted/40 rounded-2xl p-6 space-y-6">
              <div>
                <Label htmlFor="defaultDuration" className="text-base">
                  Default Task Duration
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="defaultDuration"
                    type="number"
                    min={5}
                    max={480}
                    value={preferences.taskSettings.defaultDuration}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        taskSettings: {
                          ...prev.taskSettings,
                          defaultDuration: Number(e.target.value),
                        },
                      }))
                    }
                    className="max-w-[120px]"
                  />
                  <span className="text-muted-foreground">minutes</span>
                </div>
              </div>

              <div>
                <Label htmlFor="breakDuration" className="text-base">
                  Break Duration
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="breakDuration"
                    type="number"
                    min={5}
                    max={60}
                    value={preferences.taskSettings.breakDuration}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        taskSettings: {
                          ...prev.taskSettings,
                          breakDuration: Number(e.target.value),
                        },
                      }))
                    }
                    className="max-w-[120px]"
                  />
                  <span className="text-muted-foreground">minutes</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/40 rounded-2xl p-6 space-y-6">
              <div>
                <Label htmlFor="maxTasks" className="text-base">
                  Maximum Tasks Per Day
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="maxTasks"
                    type="number"
                    min={1}
                    max={20}
                    value={preferences.taskSettings.maxTasksPerDay}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        taskSettings: {
                          ...prev.taskSettings,
                          maxTasksPerDay: Number(e.target.value),
                        },
                      }))
                    }
                    className="max-w-[120px]"
                  />
                  <span className="text-muted-foreground">tasks</span>
                </div>
              </div>

              <div>
                <Label htmlFor="minBreak" className="text-base">
                  Minimum Break Between Tasks
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="minBreak"
                    type="number"
                    min={0}
                    max={60}
                    value={preferences.taskSettings.minBreakBetweenTasks}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        taskSettings: {
                          ...prev.taskSettings,
                          minBreakBetweenTasks: Number(e.target.value),
                        },
                      }))
                    }
                    className="max-w-[120px]"
                  />
                  <span className="text-muted-foreground">minutes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Auto Scheduling</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically schedule tasks based on your preferences and
                  energy levels
                </p>
              </div>
              <Switch
                checked={preferences.autoScheduling}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    autoScheduling: checked,
                  }))
                }
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="min-w-[140px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            onClick={() => {
              // Handle save
              console.log("Saving preferences:", preferences);
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
