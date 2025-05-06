import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { SchedulingMode } from "@/types/mode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import MultiTimeSelect from "@/components/settings/MultiTimeSelect";

interface EditModeDialogProps {
  selectedMode: SchedulingMode;
  setSelectedMode: React.Dispatch<React.SetStateAction<SchedulingMode | null>>;
}

const EditModeDialog = ({
  selectedMode,
  setSelectedMode,
}: EditModeDialogProps) => {
  const t = useTranslations("settings.preferences.editMode");
  const hours = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  return (
    <div className="space-y-4 max-w-full">
      <div className="space-y-2">
        <Label htmlFor="edit-name">{t("name")}</Label>
        <Input
          id="edit-name"
          value={selectedMode.name}
          onChange={(e) =>
            setSelectedMode({
              ...selectedMode,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">{t("description")}</Label>
        <Textarea
          id="edit-description"
          value={selectedMode.description}
          onChange={(e) =>
            setSelectedMode({
              ...selectedMode,
              description: e.target.value,
            })
          }
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h4 className="font-medium">{t("taskScheduling")}</h4>

        <div className="space-y-2">
          <Label htmlFor="default-duration">{t("defaultTaskDuration")}</Label>
          <Input
            id="default-duration"
            type="number"
            min={5}
            max={180}
            value={selectedMode.config.defaultDuration}
            onChange={(e) =>
              setSelectedMode({
                ...selectedMode,
                config: {
                  ...selectedMode.config,
                  defaultDuration: Number(e.target.value),
                },
              })
            }
          />
        </div>

        {/* Add new mood-based scheduling option */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="consider-mood" className="flex-1">
            {t("considerMood")}
          </Label>
          <Switch
            id="consider-mood"
            checked={selectedMode.config.considerMood ?? false}
            onCheckedChange={(checked) =>
              setSelectedMode({
                ...selectedMode,
                config: {
                  ...selectedMode.config,
                  considerMood: checked,
                },
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max-tasks">{t("maxTasksPerDay")}</Label>
            <Input
              id="max-tasks"
              type="number"
              min={1}
              max={20}
              value={selectedMode.config.maxTasksPerDay}
              onChange={(e) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    maxTasksPerDay: Number(e.target.value),
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-hours">{t("maxHoursPerDay")}</Label>
            <Input
              id="max-hours"
              type="number"
              min={1}
              max={16}
              value={selectedMode.config.maxHoursPerDay}
              onChange={(e) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    maxHoursPerDay: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="break-between">{t("breakBetweenTasks")}</Label>
          <Input
            id="break-between"
            type="number"
            min={0}
            max={30}
            value={selectedMode.config.breakBetweenTasks}
            onChange={(e) =>
              setSelectedMode({
                ...selectedMode,
                config: {
                  ...selectedMode.config,
                  breakBetweenTasks: Number(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time-slot">{t("timeSlotInterval")}</Label>
          <Select
            value={selectedMode.config.timeSlotInterval.toString()}
            onValueChange={(value) =>
              setSelectedMode({
                ...selectedMode,
                config: {
                  ...selectedMode.config,
                  timeSlotInterval: Number(value),
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectInterval")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 {t("minutes")}</SelectItem>
              <SelectItem value="10">10 {t("minutes")}</SelectItem>
              <SelectItem value="15">15 {t("minutes")}</SelectItem>
              <SelectItem value="20">20 {t("minutes")}</SelectItem>
              <SelectItem value="30">30 {t("minutes")}</SelectItem>
              <SelectItem value="60">60 {t("minutes")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h4 className="font-medium">{t("optimizationSettings")}</h4>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="respect-fixed" className="flex-1">
            {t("respectFixedAppointments")}
          </Label>
          <Switch
            id="respect-fixed"
            checked={selectedMode.config.optimization.respectFixedAppointments}
            onCheckedChange={(checked) =>
              setSelectedMode({
                ...selectedMode,
                config: {
                  ...selectedMode.config,
                  optimization: {
                    ...selectedMode.config.optimization,
                    respectFixedAppointments: checked,
                  },
                },
              })
            }
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="add-breaks" className="flex-1">
            {t("addBreaks")}
          </Label>
          <Switch
            id="add-breaks"
            checked={selectedMode.config.optimization.addBreaks.enabled}
            onCheckedChange={(checked) =>
              setSelectedMode({
                ...selectedMode,
                config: {
                  ...selectedMode.config,
                  optimization: {
                    ...selectedMode.config.optimization,
                    addBreaks: {
                      ...selectedMode.config.optimization.addBreaks,
                      enabled: checked,
                    },
                  },
                },
              })
            }
          />
        </div>

        {selectedMode.config.optimization.addBreaks.enabled && (
          <div className="ml-3 md:ml-6 space-y-4 border-l-2 pl-3 md:pl-4 pt-2">
            <div className="space-y-2">
              <Label>{t("lunchBreak")}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                <div>
                  <Label htmlFor="lunch-start" className="text-xs">
                    {t("startTime")}
                  </Label>
                  <Input
                    id="lunch-start"
                    type="time"
                    value={
                      selectedMode.config.optimization.addBreaks.lunchBreak
                        ?.start || "12:00"
                    }
                    onChange={(e) =>
                      setSelectedMode({
                        ...selectedMode,
                        config: {
                          ...selectedMode.config,
                          optimization: {
                            ...selectedMode.config.optimization,
                            addBreaks: {
                              ...selectedMode.config.optimization.addBreaks,
                              lunchBreak: {
                                ...selectedMode.config.optimization.addBreaks
                                  .lunchBreak!,
                                start: e.target.value,
                              },
                            },
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lunch-duration" className="text-xs">
                    {t("duration")}
                  </Label>
                  <Input
                    id="lunch-duration"
                    type="number"
                    min={15}
                    max={120}
                    value={
                      selectedMode.config.optimization.addBreaks.lunchBreak
                        ?.duration || 60
                    }
                    onChange={(e) =>
                      setSelectedMode({
                        ...selectedMode,
                        config: {
                          ...selectedMode.config,
                          optimization: {
                            ...selectedMode.config.optimization,
                            addBreaks: {
                              ...selectedMode.config.optimization.addBreaks,
                              lunchBreak: {
                                ...selectedMode.config.optimization.addBreaks
                                  .lunchBreak!,
                                duration: Number(e.target.value),
                              },
                            },
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("shortBreaks")}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                <div>
                  <Label htmlFor="break-frequency" className="text-xs">
                    {t("every")}
                  </Label>
                  <Input
                    id="break-frequency"
                    type="number"
                    min={30}
                    max={240}
                    value={
                      selectedMode.config.optimization.addBreaks.shortBreaks
                        ?.frequency || 90
                    }
                    onChange={(e) =>
                      setSelectedMode({
                        ...selectedMode,
                        config: {
                          ...selectedMode.config,
                          optimization: {
                            ...selectedMode.config.optimization,
                            addBreaks: {
                              ...selectedMode.config.optimization.addBreaks,
                              shortBreaks: {
                                ...selectedMode.config.optimization.addBreaks
                                  .shortBreaks!,
                                frequency: Number(e.target.value),
                              },
                            },
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="break-duration" className="text-xs">
                    {t("duration")}
                  </Label>
                  <Input
                    id="break-duration"
                    type="number"
                    min={5}
                    max={30}
                    value={
                      selectedMode.config.optimization.addBreaks.shortBreaks
                        ?.duration || 10
                    }
                    onChange={(e) =>
                      setSelectedMode({
                        ...selectedMode,
                        config: {
                          ...selectedMode.config,
                          optimization: {
                            ...selectedMode.config.optimization,
                            addBreaks: {
                              ...selectedMode.config.optimization.addBreaks,
                              shortBreaks: {
                                ...selectedMode.config.optimization.addBreaks
                                  .shortBreaks!,
                                duration: Number(e.target.value),
                              },
                            },
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="optimize-focus" className="flex-1">
            {t("optimzeForFocusTime")}
          </Label>
          <Switch
            id="optimize-focus"
            checked={selectedMode.config.optimization.optimizeFocusTime}
            onCheckedChange={(checked) =>
              setSelectedMode({
                ...selectedMode,
                config: {
                  ...selectedMode.config,
                  optimization: {
                    ...selectedMode.config.optimization,
                    optimizeFocusTime: checked,
                  },
                },
              })
            }
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h4 className="font-medium">{t("energyLevels")}</h4>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="high-energy">{t("highEnergyHours")}</Label>
            <MultiTimeSelect
              id="high-energy"
              value={selectedMode.config.energyLevels.highEnergyHours}
              onChange={(hours: string[]) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    energyLevels: {
                      ...selectedMode.config.energyLevels,
                      highEnergyHours: hours,
                    },
                  },
                })
              }
              hourOptions={hours}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medium-energy">{t("mediumEnergyHours")}</Label>
            <MultiTimeSelect
              id="medium-energy"
              value={selectedMode.config.energyLevels.mediumEnergyHours}
              onChange={(hours: string[]) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    energyLevels: {
                      ...selectedMode.config.energyLevels,
                      mediumEnergyHours: hours,
                    },
                  },
                })
              }
              hourOptions={hours}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="low-energy">{t("lowEnergyHours")}</Label>
            <MultiTimeSelect
              id="low-energy"
              value={selectedMode.config.energyLevels.lowEnergyHours}
              onChange={(hours: string[]) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    energyLevels: {
                      ...selectedMode.config.energyLevels,
                      lowEnergyHours: hours,
                    },
                  },
                })
              }
              hourOptions={hours}
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h4 className="font-medium">{t("priorityLimits")}</h4>
        <p className="text-sm text-muted-foreground">
          {t("priorityLimitsDescription")}
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="urgent-limit">{t("urgentTasks")}</Label>
            <Input
              id="urgent-limit"
              type="number"
              min={1}
              max={10}
              value={selectedMode.config.priorityLimits.urgent}
              onChange={(e) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    priorityLimits: {
                      ...selectedMode.config.priorityLimits,
                      urgent: Number(e.target.value),
                    },
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="high-limit">{t("highTasks")}</Label>
            <Input
              id="high-limit"
              type="number"
              min={1}
              max={10}
              value={selectedMode.config.priorityLimits.high}
              onChange={(e) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    priorityLimits: {
                      ...selectedMode.config.priorityLimits,
                      high: Number(e.target.value),
                    },
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medium-limit">{t("mediumTasks")}</Label>
            <Input
              id="medium-limit"
              type="number"
              min={1}
              max={15}
              value={selectedMode.config.priorityLimits.medium}
              onChange={(e) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    priorityLimits: {
                      ...selectedMode.config.priorityLimits,
                      medium: Number(e.target.value),
                    },
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="low-limit">{t("lowTasks")}</Label>
            <Input
              id="low-limit"
              type="number"
              min={1}
              max={15}
              value={selectedMode.config.priorityLimits.low}
              onChange={(e) =>
                setSelectedMode({
                  ...selectedMode,
                  config: {
                    ...selectedMode.config,
                    priorityLimits: {
                      ...selectedMode.config.priorityLimits,
                      low: Number(e.target.value),
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModeDialog;
