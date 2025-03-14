"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  CalendarIcon,
  Tag,
  Users,
  Plus,
  Mic,
  BrainCircuit,
  Settings,
  Sparkles,
  Zap,
  Sun,
  CalendarDays,
  Keyboard,
  ArrowUpDown,
  ListFilter,
  Clock4,
  PieChart,
  Package,
  ShieldAlert,
  List,
  LayoutGrid,
  KanbanSquare,
  BarChart2,
  Coffee,
  Focus,
  Moon,
  Timer,
  Check,
  PanelLeft,
  Palette,
  EyeIcon,
  Undo2,
  CalendarRange,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isToday,
  setHours,
  setMinutes,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventItem } from "@/components/calendar/EventItem";
import { MOCK_EVENTS, EventType } from "@/components/calendar/calendarData";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EventDetailsSheet from "./EventDetailsSheet";
import CalendarSettingsDialog, {
  CalendarSettings,
} from "./CalendarSettingsDialog";
import FloatingToolbar from "./FloatingToolbar";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CURRENT_TIME = new Date();
const CURRENT_HOUR = CURRENT_TIME.getHours();

const TimelineCalendar = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [openSidebar, setOpenSidebar] = React.useState(true);
  const [selectedEvent, setSelectedEvent] = React.useState<EventType | null>(
    null
  );
  const [events, setEvents] = React.useState<EventType[]>(MOCK_EVENTS);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<HTMLDivElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  // New state variables for floating toolbar functionality
  const [aiTaskInput, setAiTaskInput] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [optimizationMode, setOptimizationMode] = React.useState("balanced");
  const [optimizationPeriod, setOptimizationPeriod] = React.useState("today");
  const [showPriorityLevels, setShowPriorityLevels] = React.useState({
    high: true,
    medium: true,
    low: true,
  });
  const [viewMode, setViewMode] = React.useState("timeline");
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [calendarSettings, setCalendarSettings] =
    React.useState<CalendarSettings>({
      showWeekends: true,
      colorScheme: "default",
      showCompletedTasks: true,
      timeFormat: "12h",
      startHour: 8,
      endHour: 18,
      expandAllDay: false,
    });
  const [optimizationRange, setOptimizationRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showOptimizeRangePicker, setShowOptimizeRangePicker] =
    React.useState(false);
  const [showOptimizeModes, setShowOptimizeModes] = React.useState(false);

  // Simulated recording state
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setAiTaskInput(
          "Schedule a meeting with the design team to discuss new features"
        );
        setIsRecording(false);
      }, 2000);
    } else {
      setAiTaskInput("");
    }
  };

  // Simulated AI task processing
  const processAiTask = () => {
    // In a real application, this would call an API to process the AI task
    const newTask = {
      id: `task-${Date.now()}`,
      title: aiTaskInput.split(" ").slice(0, 5).join(" ") + "...",
      description: aiTaskInput,
      start: setMinutes(setHours(new Date(), CURRENT_HOUR + 1), 0),
      end: setMinutes(setHours(new Date(), CURRENT_HOUR + 2), 0),
      color: "bg-primary",
    };

    setEvents([...events, newTask]);
    setAiTaskInput("");
  };

  React.useEffect(() => {
    if (scrollContainerRef.current && isToday(selectedDate)) {
      const currentTimePosition = ((CURRENT_HOUR * 60) / (24 * 60)) * 1440;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        currentTimePosition - 100
      );
    }
  }, [selectedDate]);

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());

    // Scroll to current time
    if (scrollContainerRef.current) {
      const currentTimePosition = ((CURRENT_HOUR * 60) / (24 * 60)) * 1440;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        currentTimePosition - 100
      );
    }
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // Filter events for the selected date
  const eventsForSelectedDay = events.filter(
    (event) =>
      format(event.start, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  // Update event after drag or resize
  const updateEvent = (updatedEvent: EventType) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  // Handler for date selection from the calendar popover
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle saving calendar settings
  const handleSaveSettings = () => {
    // Here you would save the settings to persistent storage
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex h-full">
      {/* Main Calendar */}
      <div className="flex flex-col flex-1 h-full bg-white dark:bg-background">
        {/* Date Navigation */}
        <div className="flex flex-col md:flex-row items-center px-6 py-4 border-b gap-y-3 relative">
          {/* Date Controls with repositioned calendar button */}
          <div className="flex items-center gap-2.5 md:mx-auto">
            {/* Date Picker Popover - Moved to the left side */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-neutral-100 dark:hover:bg-neutral-800/30"
                >
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousDay}
              className="h-7 w-7 hover:bg-neutral-100 dark:hover:bg-neutral-800/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <button
              onClick={!isToday(selectedDate) ? handleToday : undefined}
              className={cn(
                "flex flex-col items-center min-w-[140px] px-2 rounded-md transition-colors",
                !isToday(selectedDate) &&
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800/30 cursor-pointer"
              )}
            >
              <h3 className="text-[13px] font-medium tracking-tight">
                {format(selectedDate, "EEEE")}
              </h3>
              <p
                className={cn(
                  "text-[11px] leading-tight",
                  isToday(selectedDate)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {format(selectedDate, "MMMM d")}
              </p>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              className="h-7 w-7 hover:bg-neutral-100 dark:hover:bg-neutral-800/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <ScrollArea
          className="flex-1 [&>div>div]:!block"
          ref={scrollContainerRef}
        >
          <div className="relative px-2">
            {/* Current Time Indicator */}
            {isToday(selectedDate) && (
              <>
                <div
                  className="absolute left-[60px] w-1.5 h-1.5 rounded-full bg-primary z-10 shadow-[0_0_6px_var(--shadow-color)]"
                  style={
                    {
                      top: `${
                        ((CURRENT_TIME.getHours() * 60 +
                          CURRENT_TIME.getMinutes()) /
                          (24 * 60)) *
                        100
                      }%`,
                      transform: "translate(-50%, -50%)",
                      "--shadow-color": "hsl(var(--primary) / 0.5)",
                    } as React.CSSProperties
                  }
                />
                <div
                  className="absolute left-[68px] right-6 h-[1.5px] bg-gradient-to-r from-primary to-transparent z-10"
                  style={{
                    top: `${
                      ((CURRENT_TIME.getHours() * 60 +
                        CURRENT_TIME.getMinutes()) /
                        (24 * 60)) *
                      100
                    }%`,
                  }}
                />
              </>
            )}

            {/* Events Layer */}
            <div
              className="absolute left-[68px] right-6 top-0 bottom-0 pointer-events-none z-10"
              ref={timelineRef}
            >
              {eventsForSelectedDay.map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  selectedDate={selectedDate}
                  timelineRef={timelineRef}
                  onSelect={setSelectedEvent}
                  onUpdate={updateEvent}
                />
              ))}
            </div>

            {/* Time Slots */}
            <div className="relative min-h-[1440px] pr-6">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className={`flex items-start h-[60px] relative group transition-colors
                      ${
                        hour === CURRENT_HOUR && isToday(selectedDate)
                          ? "bg-gradient-to-r from-primary/5 to-transparent"
                          : ""
                      }`}
                >
                  <div
                    className={`w-[60px] pr-4 py-2 text-[11px] font-medium tracking-wide text-right sticky left-0
                        ${
                          hour === CURRENT_HOUR && isToday(selectedDate)
                            ? "text-primary"
                            : "text-muted-foreground"
                        } 
                        bg-white dark:bg-background`}
                  >
                    {hour === 0
                      ? "12 AM"
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
                  </div>
                  <div className="flex-1 relative">
                    {hour > 0 && (
                      <div className="absolute left-0 right-0 top-0 h-[1px] border-t-0 bg-neutral-100 dark:bg-neutral-800" />
                    )}
                    {/* 30 minute mark */}
                    <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-neutral-100 dark:border-neutral-800" />
                    {/* Hover effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-800/30 dark:to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Floating Toolbar */}
        <FloatingToolbar
          aiTaskInput={aiTaskInput}
          setAiTaskInput={setAiTaskInput}
          isRecording={isRecording}
          toggleRecording={toggleRecording}
          processAiTask={processAiTask}
          optimizationMode={optimizationMode}
          setOptimizationMode={setOptimizationMode}
          optimizationPeriod={optimizationPeriod}
          setOptimizationPeriod={setOptimizationPeriod}
          showPriorityLevels={showPriorityLevels}
          setShowPriorityLevels={setShowPriorityLevels}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setIsSettingsOpen={setIsSettingsOpen}
          optimizationRange={optimizationRange}
          setOptimizationRange={setOptimizationRange}
          showOptimizeRangePicker={showOptimizeRangePicker}
          setShowOptimizeRangePicker={setShowOptimizeRangePicker}
          showOptimizeModes={showOptimizeModes}
          setShowOptimizeModes={setShowOptimizeModes}
          events={events}
          setEvents={setEvents}
        />

        {/* Settings Dialog - Now using the extracted component */}
        <CalendarSettingsDialog
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          settings={calendarSettings}
          onSettingsChange={setCalendarSettings}
          onSave={handleSaveSettings}
        />

        {/* Event Details Sheet - Now extracted to a separate component */}
        <EventDetailsSheet
          event={selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        />
      </div>
    </div>
  );
};

export default TimelineCalendar;
