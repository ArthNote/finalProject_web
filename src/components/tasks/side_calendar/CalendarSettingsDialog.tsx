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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calendar Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <EyeIcon className="h-4 w-4 text-muted-foreground" /> Display
              Options
            </h3>
            <div className="flex items-center justify-between">
              <label htmlFor="showWeekends" className="text-sm">
                Show weekends
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
                Show completed tasks
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

            <div className="flex items-center justify-between">
              <label htmlFor="expandAllDay" className="text-sm">
                Expand all-day section
              </label>
              <input
                type="checkbox"
                id="expandAllDay"
                checked={settings.expandAllDay}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    expandAllDay: e.target.checked,
                  })
                }
                className="accent-primary"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" /> Appearance
            </h3>

            <div className="space-y-1">
              <label htmlFor="colorScheme" className="text-sm">
                Color scheme
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
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="colorful">Colorful</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label htmlFor="timeFormat" className="text-sm">
                Time format
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
                  <SelectItem value="12h">12-hour (1:00 PM)</SelectItem>
                  <SelectItem value="24h">24-hour (13:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <PanelLeft className="h-4 w-4 text-muted-foreground" /> Working
              Hours
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="startHour" className="text-sm">
                  Start hour
                </label>
                <Select
                  value={settings.startHour.toString()}
                  onValueChange={(val) =>
                    onSettingsChange({
                      ...settings,
                      startHour: parseInt(val),
                    })
                  }
                >
                  <SelectTrigger id="startHour">
                    <SelectValue placeholder="Start hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i === 0
                          ? "12 AM"
                          : i < 12
                          ? `${i} AM`
                          : i === 12
                          ? "12 PM"
                          : `${i - 12} PM`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label htmlFor="endHour" className="text-sm">
                  End hour
                </label>
                <Select
                  value={settings.endHour.toString()}
                  onValueChange={(val) =>
                    onSettingsChange({
                      ...settings,
                      endHour: parseInt(val),
                    })
                  }
                >
                  <SelectTrigger id="endHour">
                    <SelectValue placeholder="End hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i === 0
                          ? "12 AM"
                          : i < 12
                          ? `${i} AM`
                          : i === 12
                          ? "12 PM"
                          : `${i - 12} PM`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarSettingsDialog;
