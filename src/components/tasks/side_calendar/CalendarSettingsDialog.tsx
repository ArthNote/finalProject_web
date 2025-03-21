import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, Palette, PanelLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export interface CalendarSettings {
  showWeekends: boolean;
  colorScheme: string;
  showCompletedTasks: boolean;
  timeFormat: string;
  startHour: number;
  endHour: number;
  expandAllDay: boolean;
}

interface CalendarSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  settings: CalendarSettings;
  onSettingsChange: (settings: CalendarSettings) => void;
  onSave: () => void;
}

const CalendarSettingsDialog: React.FC<CalendarSettingsDialogProps> = ({
  isOpen,
  onOpenChange,
  settings,
  onSettingsChange,
  onSave,
}) => {
  const t = useTranslations("tasks.sideCalendar.settings");
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
              {t("displayOptions.title")}
            </h3>
            <div className="flex items-center justify-between">
              <label htmlFor="showWeekends" className="text-sm">
                {t("displayOptions.showWeekends")}
              </label>
              <input
                type="checkbox"
                id="showWeekends"
                checked={settings.showWeekends}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    showWeekends: e.target.checked,
                  })
                }
                className="accent-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="showCompleted" className="text-sm">
                {t("displayOptions.showCompleted")}
              </label>
              <input
                type="checkbox"
                id="showCompleted"
                checked={settings.showCompletedTasks}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    showCompletedTasks: e.target.checked,
                  })
                }
                className="accent-primary"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              {t("appearance.title")}
            </h3>

            <div className="space-y-1">
              <label htmlFor="colorScheme" className="text-sm">
                {t("appearance.colorScheme")}
              </label>
              <Select
                value={settings.colorScheme}
                onValueChange={(val) =>
                  onSettingsChange({
                    ...settings,
                    colorScheme: val,
                  })
                }
              >
                <SelectTrigger id="colorScheme">
                  <SelectValue placeholder="Select a color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    {t("appearance.default")}
                  </SelectItem>
                  <SelectItem value="colorful">
                    {t("appearance.colorful")}
                  </SelectItem>
                  <SelectItem value="monochrome">
                    {t("appearance.monochrome")}
                  </SelectItem>
                  <SelectItem value="pastel">
                    {t("appearance.pastel")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label htmlFor="timeFormat" className="text-sm">
                {t("appearance.timeFormat")}
              </label>
              <Select
                value={settings.timeFormat}
                onValueChange={(val) =>
                  onSettingsChange({
                    ...settings,
                    timeFormat: val,
                  })
                }
              >
                <SelectTrigger id="timeFormat">
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">{t("appearance.12Hour")}</SelectItem>
                  <SelectItem value="24h">{t("appearance.24Hour")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button type="button" onClick={onSave}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarSettingsDialog;
