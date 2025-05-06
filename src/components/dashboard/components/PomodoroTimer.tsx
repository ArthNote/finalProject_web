"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RefreshCw, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveFocusSession } from "@/lib/api/pomodoro";
import { FocusSessionType } from "@/types/pomodoro";
import { toast } from "sonner";

// Default timer settings
const DEFAULT_SETTINGS = {
  work: 25, // in minutes
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

// Types for timer settings
type TimerSettings = typeof DEFAULT_SETTINGS;
type TimerMode = "work" | "shortBreak" | "longBreak";
type TimerStatus = "idle" | "running" | "paused";

const PomodoroTimer = () => {
  const t = useTranslations("dashboard.pomodoro");
  const queryClient = useQueryClient();

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("pomodoroSettings");
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const [mode, setMode] = useState<TimerMode>("work");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeRemaining, setTimeRemaining] = useState(settings.work * 60);
  const [sessions, setSessions] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [formSettings, setFormSettings] = useState(settings);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Session save mutation
  const saveFocusSessionMutation = useMutation({
    mutationFn: (sessionData: FocusSessionType) =>
      saveFocusSession(sessionData),
    onSuccess: () => {
      // Use a more specific invalidation to reduce potential for cascading effects
      queryClient.invalidateQueries({
        queryKey: ["focusStats"],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["focusSessions"],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["user-progress"],
        type: "all",
      });
    },
    onError: (error) => {
      console.error("Error saving focus session:", error);
      toast.error("Failed to save your focus session");
    },
  });

  // Get current duration based on mode
  const getCurrentDuration = () => {
    return settings[mode] * 60;
  };

  // Reset timer
  const resetTimer = () => {
    setTimeRemaining(getCurrentDuration());
    setStatus("idle");
    setSessionStartTime(null);
  };

  // Change timer mode
  const changeMode = (newMode: TimerMode) => {
    // If we're switching modes while the timer is running,
    // consider this canceling the current session
    if (status === "running") {
      setStatus("idle");
      setSessionStartTime(null);
    }

    setMode(newMode);
    setTimeRemaining(settings[newMode] * 60);
  };

  // Handle timer completion
  const handleTimerComplete = React.useCallback(() => {
    // Avoid duplicate handling by checking status
    if (status !== "running") return;

    // Desktop notification if available and permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(
        mode === "work" ? "Work session complete!" : "Break time over!",
        { body: mode === "work" ? "Take a break!" : "Back to work!" }
      );
    }

    if (mode === "work") {
      const newSessions = sessions + 1;
      setSessions(newSessions);

      // Save session to database
      saveFocusSessionMutation.mutate({
        duration: settings.work,
        type: "work",
        completed: true,
        startTime:
          sessionStartTime || new Date(Date.now() - settings.work * 60 * 1000),
        endTime: new Date(),
      });

      // Determine if it's time for a long break
      if (newSessions % settings.longBreakInterval === 0) {
        changeMode("longBreak");
      } else {
        changeMode("shortBreak");
      }
    } else {
      // We're coming from a break - Switch back to work mode
      changeMode("work");
    }

    // Reset session start time and set status to idle
    setSessionStartTime(null);
    setStatus("idle");
  }, [
    mode,
    sessions,
    settings,
    sessionStartTime,
    saveFocusSessionMutation,
    changeMode,
  ]);

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let timerCompleted = false; // Flag to track if timer completed in this effect cycle

    if (status === "running") {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1 && !timerCompleted) {
            clearInterval(interval!);
            timerCompleted = true; // Set flag to prevent multiple calls

            // Use setTimeout to ensure state updates have propagated
            // before handleTimerComplete is called
            setTimeout(() => {
              handleTimerComplete();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, mode, settings]);

  // Initialize timer when mode or settings change
  useEffect(() => {
    resetTimer();
  }, [settings]);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    }
  }, [settings]);

  // Request notification permission
  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      // Deferred notification permission request
      const requestPermission = () => {
        Notification.requestPermission();
      };

      // Add listener to request permission on first user interaction
      document.addEventListener("click", requestPermission, { once: true });
      return () => {
        document.removeEventListener("click", requestPermission);
      };
    }
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = Math.round(
    ((getCurrentDuration() - timeRemaining) / getCurrentDuration()) * 100
  );

  // Handle start/pause
  const toggleTimer = () => {
    if (status === "running") {
      setStatus("paused");
    } else {
      // If starting from idle, record the session start time
      if (status === "idle") {
        setSessionStartTime(new Date());
      }
      setStatus("running");
    }
  };

  // Update settings
  const handleSaveSettings = () => {
    setSettings(formSettings);
    setSettingsOpen(false);
    resetTimer();
  };

  return (
    <div className="flex flex-col items-center">
      <Tabs
        value={mode}
        onValueChange={(v) => changeMode(v as TimerMode)}
        className="w-full mb-4"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="work">{t("work")}</TabsTrigger>
          <TabsTrigger value="shortBreak">{t("shortBreak")}</TabsTrigger>
          <TabsTrigger value="longBreak">{t("longBreak")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full mb-4">
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="text-4xl font-bold my-6">{formatTime(timeRemaining)}</div>

      <div className="flex gap-2 mb-4">
        <Button
          onClick={toggleTimer}
          className="gap-1"
          disabled={saveFocusSessionMutation.isPending}
        >
          {status === "running" ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {status === "running" ? t("pause") : t("start")}
        </Button>

        <Button
          variant="outline"
          onClick={resetTimer}
          disabled={saveFocusSessionMutation.isPending || status === "idle"}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={status === "running"}>
              <Settings2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("settings")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="workTime">{t("workDuration")}</Label>
                <Input
                  id="workTime"
                  type="number"
                  min="1"
                  value={formSettings.work}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      work: Number(e.target.value) || 25,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="shortBreakTime">
                  {t("shortBreakDuration")}
                </Label>
                <Input
                  id="shortBreakTime"
                  type="number"
                  min="1"
                  value={formSettings.shortBreak}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      shortBreak: Number(e.target.value) || 5,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="longBreakTime">{t("longBreakDuration")}</Label>
                <Input
                  id="longBreakTime"
                  type="number"
                  min="1"
                  value={formSettings.longBreak}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      longBreak: Number(e.target.value) || 15,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="longBreakInterval">
                  {t("sessionsBeforeLongBreak")}
                </Label>
                <Input
                  id="longBreakInterval"
                  type="number"
                  min="1"
                  value={formSettings.longBreakInterval}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      longBreakInterval: Number(e.target.value) || 4,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveSettings}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {sessions > 0 && (
          <span>{t("completedSessions", { count: sessions })}</span>
        )}
        {saveFocusSessionMutation.isPending && (
          <span className="ml-2 text-xs italic">Saving session...</span>
        )}
      </p>
    </div>
  );
};

export default PomodoroTimer;
