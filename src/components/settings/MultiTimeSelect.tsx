import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MultiTimeSelectProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  hourOptions: string[];
}

const MultiTimeSelect = ({
  id,
  value,
  onChange,
  hourOptions,
}: MultiTimeSelectProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("settings.preferences.editMode");

  const toggleTimeSelection = (time: string) => {
    if (value.includes(time)) {
      onChange(value.filter((t) => t !== time));
    } else {
      onChange([...value, time]);
    }
  };

  const removeTime = (time: string) => {
    onChange(value.filter((t) => t !== time));
  };

  // Generate full hour options for every 30 minutes if needed
  const allHourOptions =
    hourOptions.length >= 24 ? hourOptions : generateHourOptions();

  function generateHourOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      options.push(`${hourStr}:00`);
      options.push(`${hourStr}:30`);
    }
    return options;
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {value.length > 0
                ? `${value.length} ${t("hoursSelected")}`
                : t("selectHours")}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={t("searchHours")} />
            <CommandEmpty>{t("noHoursFound")}</CommandEmpty>
            <ScrollArea className="h-[180px]">
              <CommandGroup>
                {allHourOptions.map((hour) => (
                  <CommandItem
                    key={hour}
                    value={hour}
                    onSelect={() => toggleTimeSelection(hour)}
                    className="cursor-pointer py-1"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(hour) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {hour}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected times as badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.sort().map((time) => (
            <Badge key={time} variant="secondary" className="px-2 py-1">
              {time}
              <button
                type="button"
                onClick={() => removeTime(time)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiTimeSelect;
