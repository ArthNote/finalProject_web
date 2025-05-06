import React from "react";
import { Separator } from "@/components/ui/separator";
import { SchedulingMode } from "@/types/mode";
import { useTranslations } from "next-intl";

interface ViewModeDetailsProps {
  selectedMode: SchedulingMode;
}

const ViewModeDetails = ({ selectedMode }: ViewModeDetailsProps) => {
  const t = useTranslations("settings.preferences.modeDetails");
  return (
    <div className="space-y-6">
      {/* Task scheduling and priority limits section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-3">{t("taskScheduling")}</h4>
          <ul className="space-y-2">
            <ListItem
              label={t("defaultDurationLabel")}
              value={t("defaultDurationValue", {
                duration: selectedMode.config.defaultDuration,
              })}
            />
            <ListItem
              label={t("considerMoodLabel")}
              value={selectedMode.config.considerMood ? t("yes") : t("no")}
              valueClass={
                selectedMode.config.considerMood
                  ? "text-green-600"
                  : "text-red-500"
              }
            />
            <ListItem
              label={t("maxTasksPerDayLabel")}
              value={selectedMode.config.maxTasksPerDay.toString()}
            />
            <ListItem
              label={t("maxHoursPerDayLabel")}
              value={selectedMode.config.maxHoursPerDay.toString()}
            />
            <ListItem
              label={t("breakBetweenTasksLabel")}
              value={t("breakBetweenTasksValue", {
                duration: selectedMode.config.breakBetweenTasks,
              })}
            />
            <ListItem
              label={t("timeSlotIntervalLabel")}
              value={t("timeSlotIntervalValue", {
                duration: selectedMode.config.timeSlotInterval,
              })}
            />
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">{t("priorityLimits")}</h4>
          <div className="grid grid-cols-2 gap-3">
            <PriorityItem
              label={t("urgentTasks")}
              value={selectedMode.config.priorityLimits.urgent}
            />
            <PriorityItem
              label={t("highTasks")}
              value={selectedMode.config.priorityLimits.high}
            />
            <PriorityItem
              label={t("mediumTasks")}
              value={selectedMode.config.priorityLimits.medium}
            />
            <PriorityItem
              label={t("lowTasks")}
              value={selectedMode.config.priorityLimits.low}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Optimization settings section */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          {t("optimizationSettings")}
        </h4>
        <ul className="space-y-2">
          <ListItem
            label={t("respectFixedAppointments")}
            value={
              selectedMode.config.optimization.respectFixedAppointments
                ? t("yes")
                : t("no")
            }
            valueClass={
              selectedMode.config.optimization.respectFixedAppointments
                ? "text-green-600"
                : "text-red-500"
            }
          />
          <ListItem
            label={t("addBreaks")}
            value={
              selectedMode.config.optimization.addBreaks.enabled
                ? t("yes")
                : t("no")
            }
            valueClass={
              selectedMode.config.optimization.addBreaks.enabled
                ? "text-green-600"
                : "text-red-500"
            }
          />
          {selectedMode.config.optimization.addBreaks.enabled && (
            <>
              <ListItem
                label={t("lunchBreakLabel")}
                value={t("lunchBreakValue", {
                  start:
                    selectedMode.config.optimization.addBreaks.lunchBreak
                      ?.start || "N/A",
                  duration:
                    selectedMode.config.optimization.addBreaks.lunchBreak
                      ?.duration || "N/A",
                })}
                indent={true}
              />
              <ListItem
                label={t("shortBreakLabel")}
                value={t("shortBreakValue", {
                  frequency:
                    selectedMode.config.optimization.addBreaks.shortBreaks
                      ?.frequency || "N/A",
                  duration:
                    selectedMode.config.optimization.addBreaks.shortBreaks
                      ?.duration || "N/A",
                })}
                indent={true}
              />
            </>
          )}
          <ListItem
            label={t("optimizeFocusTime")}
            value={
              selectedMode.config.optimization.optimizeFocusTime
                ? t("yes")
                : t("no")
            }
            valueClass={
              selectedMode.config.optimization.optimizeFocusTime
                ? "text-green-600"
                : "text-red-500"
            }
          />
        </ul>
      </div>

      <Separator />

      {/* Energy level hours section */}
      <div>
        <h4 className="text-sm font-medium mb-3">{t("energyLevelHours")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnergyItem
            label={t("highEnergyHours")}
            hours={selectedMode.config.energyLevels.highEnergyHours}
            dot="bg-green-500"
            noneLabel={t("notSet")}
          />
          <EnergyItem
            label={t("mediumEnergyHours")}
            hours={selectedMode.config.energyLevels.mediumEnergyHours}
            dot="bg-amber-500"
            noneLabel={t("notSet")}
          />
          <EnergyItem
            label={t("lowEnergyHours")}
            hours={selectedMode.config.energyLevels.lowEnergyHours}
            dot="bg-red-500"
            noneLabel={t("notSet")}
          />
        </div>
      </div>
    </div>
  );
};

// Simple list item with label and value
const ListItem = ({
  label,
  value,
  indent = false,
  valueClass = "",
}: {
  label: string;
  value: string;
  indent?: boolean;
  valueClass?: string;
}) => (
  <li className={`text-sm flex justify-between ${indent ? "pl-4" : ""}`}>
    <span className="text-muted-foreground">{label}:</span>
    <span className={valueClass || ""}>{value}</span>
  </li>
);

// Priority item with slightly more visual emphasis
const PriorityItem = ({ label, value }: { label: string; value: number }) => (
  <div className="border rounded-md p-2.5 flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

// Energy level hours with subtle indicator
const EnergyItem = ({
  label,
  hours,
  dot,
  noneLabel,
}: {
  label: string;
  hours: string[];
  dot: string;
  noneLabel: string;
}) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      <div className={`w-2 h-2 rounded-full ${dot}`}></div>
      <span className="text-sm text-muted-foreground">{label}:</span>
    </div>
    <div className="text-sm pl-3.5">
      {hours.length > 0 ? hours.join(", ") : noneLabel}
    </div>
  </div>
);

export default ViewModeDetails;
