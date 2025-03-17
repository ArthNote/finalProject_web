import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
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
  BarChart2,
  BrainCircuit,
  Calendar as CalendarIcon, // Fix naming conflict with the Calendar component
  CalendarDays,
  CalendarRange,
  Check,
  ChevronLeft,
  Clock4,
  Coffee,
  Focus,
  KanbanSquare,
  Keyboard,
  LayoutGrid,
  List,
  ListFilter,
  Mic,
  Package,
  Plus,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/lib/state/useCalendarStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TimelineCalendar from "@/components/tasks/side_calendar/TimelineCalendar";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/dateFormate";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

// Define interfaces for props to fix TypeScript errors
interface ScopeOptionProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  active: boolean;
  onClick: () => void;
  color: string;
  activeColor: string;
}

interface TimeOptionProps {
  title: string;
  date: string;
  active: boolean;
  onClick: () => void;
  isCustom?: boolean;
}

interface OptimizeScheduleProps {
  onClose: () => void;
  optimizationMode: "balanced" | "productivity" | "wellbeing" | "custom";
  setOptimizationMode: (
    mode: "balanced" | "productivity" | "wellbeing" | "custom"
  ) => void;
  optimizationPeriod: "custom" | "today" | "tomorrow" | "week";
  setOptimizationPeriod: (
    period: "custom" | "today" | "tomorrow" | "week"
  ) => void;
  optimizationTaskScope: string;
  setOptimizationTaskScope: (scope: string) => void;
  optimizationRange: { from: Date | undefined; to: Date | undefined };
  setOptimizationRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  locale: string;
}

interface TaskScopeStepProps {
  optimizationTaskScope: string;
  setOptimizationTaskScope: (scope: string) => void;
}

interface TimePeriodStepProps {
  optimizationPeriod: "custom" | "today" | "tomorrow" | "week";
  setOptimizationPeriod: (
    period: "custom" | "today" | "tomorrow" | "week"
  ) => void;
  optimizationRange: { from: Date | undefined; to: Date | undefined };
  setOptimizationRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  locale: string;
}

interface OptimizationStyleStepProps {
  optimizationMode: "balanced" | "productivity" | "wellbeing" | "custom";
  setOptimizationMode: (
    mode: "balanced" | "productivity" | "wellbeing" | "custom"
  ) => void;
}

interface OptionsStepProps {
  config: {
    respectFixedAppointments: boolean;
    addBreaks: boolean;
    optimizeForFocus: boolean;
  };
  setConfig: React.Dispatch<
    React.SetStateAction<{
      respectFixedAppointments: boolean;
      addBreaks: boolean;
      optimizeForFocus: boolean;
    }>
  >;
}

const FloatingToolbar = () => {
  // Get all state and actions from the store

  const locale = useLocale() as "en" | "fr";
  const {
    aiTaskInput,
    setAiTaskInput,
    isRecording,
    toggleRecording,
    processAiTask,
    optimizationMode,
    setOptimizationMode,
    optimizationPeriod,
    setOptimizationPeriod,
    showPriorityLevels,
    setShowPriorityLevels,
    viewMode,
    setViewMode,
    optimizationRange,
    setOptimizationRange,
    showOptimizeRangePicker,
    setShowOptimizeRangePicker,
    showOptimizeModes,
    setShowOptimizeModes,
  } = useCalendarStore() as {
    aiTaskInput: string;
    setAiTaskInput: (input: string) => void;
    isRecording: boolean;
    toggleRecording: () => void;
    processAiTask: () => void;
    optimizationMode: "balanced" | "productivity" | "wellbeing" | "custom";
    setOptimizationMode: (
      mode: "balanced" | "productivity" | "wellbeing" | "custom"
    ) => void;
    optimizationPeriod: "custom" | "today" | "tomorrow" | "week";
    setOptimizationPeriod: (
      period: "custom" | "today" | "tomorrow" | "week"
    ) => void;
    showPriorityLevels: { high: boolean; medium: boolean; low: boolean };
    setShowPriorityLevels: (levels: {
      high: boolean;
      medium: boolean;
      low: boolean;
    }) => void;
    viewMode: "grid" | "list" | "kanban";
    setViewMode: (mode: "grid" | "list" | "kanban") => void;
    optimizationRange: { from: Date | undefined; to: Date | undefined };
    setOptimizationRange: (range: {
      from: Date | undefined;
      to: Date | undefined;
    }) => void;
    showOptimizeRangePicker: boolean;
    setShowOptimizeRangePicker: (show: boolean) => void;
    showOptimizeModes: boolean;
    setShowOptimizeModes: (show: boolean) => void;
  };

  // Add a new state variable for optimization task scope
  const [optimizationTaskScope, setOptimizationTaskScope] =
    React.useState("unscheduled");

  // State for the calendar sheet
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // State to control toolbar visibility
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(true);

  // Determine if we're on mobile
  const [isMobile, setIsMobile] = React.useState(false);

  // Update isMobile state based on window width
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in Tailwind
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add keyboard shortcut to toggle toolbar visibility
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "t" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsToolbarVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Add a state variable for optimization sheet
  const [isOptimizationSheetOpen, setIsOptimizationSheetOpen] =
    React.useState(false);

  return (
    <>
      {/* Toggle button shown when toolbar is hidden */}
      <AnimatePresence>
        {!isToolbarVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 sm:bottom-6 right-4 z-40"
          >
            <Button
              onClick={() => setIsToolbarVisible(true)}
              size="icon"
              className="rounded-full shadow-lg"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toolbar */}
      <AnimatePresence>
        {isToolbarVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40"
          >
            {/* Use smaller gap and padding for mobile */}
            <div
              className={`bg-background/95 backdrop-blur-sm border rounded-full shadow-lg ${
                isMobile ? "p-1 gap-1" : "p-1.5 gap-2"
              } flex items-center`}
            >
              <TooltipProvider delayDuration={300}>
                {/* Hide button - only visible on small screens */}
                {isMobile && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsToolbarVisible(false)}
                        className="rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"}`}
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Hide Toolbar</TooltipContent>
                  </Tooltip>
                )}

                {/* Create Task Button - Always visible */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Plus
                            className={`${
                              isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
                            }`}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Create Task</TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent
                    align="start"
                    side="top"
                    className="w-56 mb-4"
                  >
                    <DropdownMenuLabel>Create Task</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* AI Task Creation */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <BrainCircuit className="mr-2 h-4 w-4" />
                          Create with AI
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                            Create Task with AI
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            Describe your task in natural language and our AI
                            will schedule it appropriately.
                          </p>
                          <div className="relative">
                            <Textarea
                              placeholder="Example: Schedule a 1-hour team meeting tomorrow afternoon"
                              className="pr-10 min-h-[100px]"
                              value={aiTaskInput}
                              onChange={(e) => setAiTaskInput(e.target.value)}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              type="button"
                              className={`absolute right-2 bottom-2 ${
                                isRecording ? "text-red-500 animate-pulse" : ""
                              }`}
                              onClick={toggleRecording}
                            >
                              <Mic className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <DialogFooter className="flex justify-between gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              className="gap-2"
                              disabled={!aiTaskInput.trim()}
                              onClick={processAiTask}
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Create with AI
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Manual Task Creation */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Keyboard className="mr-2 h-4 w-4" />
                          Create Manually
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Task Title
                            </label>
                            <Input placeholder="Enter task title" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Description
                            </label>
                            <Textarea placeholder="Enter task description" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Start Time
                              </label>
                              <Input type="time" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                End Time
                              </label>
                              <Input type="time" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="flex justify-between gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button>Create Task</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Optimize Button - Now opens a sheet instead of dropdown */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={isMobile ? "icon" : "default"}
                      variant="outline"
                      className={`rounded-full hover:bg-secondary border-primary/20 ${
                        isMobile ? "px-2" : "px-4 gap-2"
                      }`}
                      onClick={() => setIsOptimizationSheetOpen(true)}
                    >
                      <Zap className={`${"h-4 w-4"} text-primary`} />
                      {!isMobile && <span className="text-sm">Optimize</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Optimize Schedule</TooltipContent>
                </Tooltip>

                {/* View Toggle - Updated with Kanban view */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                        >
                          {viewMode === "list" ? (
                            <List
                              className={`${
                                isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
                              }`}
                            />
                          ) : viewMode === "kanban" ? (
                            <KanbanSquare
                              className={`${
                                isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
                              }`}
                            />
                          ) : (
                            <LayoutGrid
                              className={`${
                                isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
                              }`}
                            />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Change View</TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent align="center" className="w-40">
                    <DropdownMenuRadioGroup
                      value={viewMode}
                      onValueChange={(value) =>
                        setViewMode(value as "grid" | "list" | "kanban")
                      }
                    >
                      <DropdownMenuRadioItem value="list">
                        <List className="mr-2 h-4 w-4" /> List View
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="grid">
                        <LayoutGrid className="mr-2 h-4 w-4" /> Grid View
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="kanban">
                        <KanbanSquare className="mr-2 h-4 w-4" /> Kanban
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Calendar Toggle - Only visible on mobile/tablet */}
                {isMobile && (
                  <Sheet open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                          >
                            <CalendarRange
                              className={`${
                                isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
                              } text-primary`}
                            />
                          </Button>
                        </SheetTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Calendar</TooltipContent>
                    </Tooltip>

                    <SheetContent
                      side="left"
                      className="p-0 pt-6 w-[90vw] border-r bg-background"
                    >
                      <TimelineCalendar />
                    </SheetContent>
                  </Sheet>
                )}
              </TooltipProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optimization Sheet */}
      <Sheet
        open={isOptimizationSheetOpen}
        onOpenChange={setIsOptimizationSheetOpen}
      >
        <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l">
          <OptimizeSchedule
            onClose={() => setIsOptimizationSheetOpen(false)}
            optimizationMode={optimizationMode}
            setOptimizationMode={setOptimizationMode}
            optimizationPeriod={optimizationPeriod}
            setOptimizationPeriod={setOptimizationPeriod}
            optimizationTaskScope={optimizationTaskScope}
            setOptimizationTaskScope={setOptimizationTaskScope}
            optimizationRange={optimizationRange}
            setOptimizationRange={setOptimizationRange}
            locale={locale}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

// Add these reusable components outside the main component but within the file
// This needs to be placed at the end of your file but before the final closing brackets

// Helper component for Optimization Mode cards

function OptimizeSchedule({
  onClose,
  optimizationMode,
  setOptimizationMode,
  optimizationPeriod,
  setOptimizationPeriod,
  optimizationTaskScope,
  setOptimizationTaskScope,
  optimizationRange,
  setOptimizationRange,
  locale,
}: OptimizeScheduleProps) {
  const [step, setStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [config, setConfig] = React.useState({
    respectFixedAppointments: true,
    addBreaks: true,
    optimizeForFocus: false,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Process optimization
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <TaskScopeStep
            optimizationTaskScope={optimizationTaskScope}
            setOptimizationTaskScope={setOptimizationTaskScope}
          />
        );
      case 2:
        return (
          <TimePeriodStep
            optimizationPeriod={optimizationPeriod}
            setOptimizationPeriod={setOptimizationPeriod}
            optimizationRange={optimizationRange}
            setOptimizationRange={setOptimizationRange}
            locale={locale}
          />
        );
      case 3:
        return (
          <OptimizationStyleStep
            optimizationMode={optimizationMode}
            setOptimizationMode={setOptimizationMode}
          />
        );
      case 4:
        return <OptionsStep config={config} setConfig={setConfig} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Optimize Your Schedule</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Let AI find the perfect time slots for your tasks
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <React.Fragment key={i}>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  i + 1 === step
                    ? "bg-primary text-primary-foreground"
                    : i + 1 < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1 < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i + 1 < step ? "bg-primary" : "bg-muted"
                  )}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {renderStepContent()}
      </div>

      {/* Footer with navigation buttons */}
      <div className="border-t p-6">
        <div className="flex justify-between">
          <Button variant="outline" onClick={step > 1 ? handleBack : onClose}>
            {step > 1 ? "Back" : "Cancel"}
          </Button>
          <Button onClick={handleNext} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-b-transparent border-current"></div>
                Processing...
              </>
            ) : step < totalSteps ? (
              "Continue"
            ) : (
              "Optimize Schedule"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TaskScopeStep({
  optimizationTaskScope,
  setOptimizationTaskScope,
}: TaskScopeStepProps) {
  const options = [
    {
      id: "unscheduled",
      title: "Unscheduled Tasks",
      description: "Find optimal time slots for tasks without a schedule",
      icon: <Plus className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "scheduled",
      title: "Scheduled Tasks",
      description:
        "Reorganize your existing scheduled tasks for better efficiency",
      icon: <Clock4 className="h-5 w-5 text-green-500" />,
    },
    {
      id: "all",
      title: "All Tasks",
      description: "Complete reorganization of your entire schedule",
      icon: <CalendarRange className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          What would you like to optimize?
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Choose which tasks you want the AI to organize in your schedule
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "flex p-4 border rounded-lg transition-all cursor-pointer",
              optimizationTaskScope === option.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/30 hover:bg-muted/50"
            )}
            onClick={() => setOptimizationTaskScope(option.id)}
          >
            <div className="mr-4 mt-0.5">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  optimizationTaskScope === option.id
                    ? "bg-primary/10"
                    : "bg-muted"
                )}
              >
                {option.icon}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{option.title}</h4>
                {optimizationTaskScope === option.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimePeriodStep({
  optimizationPeriod,
  setOptimizationPeriod,
  optimizationRange,
  setOptimizationRange,
  locale,
}: TimePeriodStepProps) {
  const [showCalendar, setShowCalendar] = React.useState(false);

  const options = [
    {
      id: "today",
      title: "Today",
      description: `${format(new Date(), "EEEE, MMMM d")}`,
      icon: <CalendarDays className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "tomorrow",
      title: "Tomorrow",
      description: `${format(addDays(new Date(), 1), "EEEE, MMMM d")}`,
      icon: <CalendarDays className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: "week",
      title: "This Week",
      description: "From today to the next 7 days",
      icon: <CalendarRange className="h-5 w-5 text-teal-500" />,
    },
    {
      id: "custom",
      title: "Custom Range",
      description:
        optimizationRange.from && optimizationRange.to
          ? `${format(optimizationRange.from, "MMM d")} - ${format(
              optimizationRange.to,
              "MMM d"
            )}`
          : "Select specific dates",
      icon: <CalendarIcon className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Time Period</h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Choose the days you want to optimize in your schedule
        </p>
      </div>

      {showCalendar ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalendar(false)}
            className="mb-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to options
          </Button>

          <Calendar
            mode="range"
            locale={locale === "en" ? enUS : fr}
            selected={optimizationRange}
            onSelect={(range) => {
              if (range) {
                setOptimizationRange({
                  from: range.from,
                  to: range.to,
                });
                if (range.from && range.to) {
                  setOptimizationPeriod("custom");
                  setShowCalendar(false);
                }
              }
            }}
            numberOfMonths={1}
            className="w-full border rounded-md p-2 bg-background shadow-sm mx-auto"
          />

          <div className="text-center text-sm text-muted-foreground">
            Select a range of dates to optimize
          </div>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex p-4 border rounded-lg transition-all cursor-pointer",
                optimizationPeriod === option.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/30 hover:bg-muted/50"
              )}
              onClick={() => {
                if (option.id === "custom") {
                  setShowCalendar(true);
                } else {
                  setOptimizationPeriod(
                    option.id as "today" | "tomorrow" | "week" | "custom"
                  );
                }
              }}
            >
              <div className="mr-4 mt-0.5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    optimizationPeriod === option.id
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  {option.icon}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{option.title}</h4>
                  {optimizationPeriod === option.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OptimizationStyleStep({
  optimizationMode,
  setOptimizationMode,
}: OptimizationStyleStepProps) {
  const options = [
    {
      id: "balanced",
      title: "Balanced",
      description: "Distribute tasks evenly with regular breaks",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      details: [
        "Equal distribution of tasks",
        "Regular breaks between activities",
        "Balance of different task types",
      ],
    },
    {
      id: "productivity",
      title: "Productivity Focus",
      description: "Group similar tasks to minimize context switching",
      icon: <BarChart2 className="h-5 w-5 text-purple-500" />,
      details: [
        "Deep work time blocks",
        "Minimal context switching",
        "Grouped similar tasks",
      ],
    },
    {
      id: "wellbeing",
      title: "Wellbeing Focus",
      description: "Prioritize breaks and prevent overloading",
      icon: <Sun className="h-5 w-5 text-amber-500" />,
      details: [
        "Regular breaks throughout the day",
        "Prevent meeting overload",
        "Buffer time between activities",
      ],
    },
    {
      id: "custom",
      title: "Custom Rules",
      description: "Apply your personalized scheduling preferences",
      icon: <Settings className="h-5 w-5 text-gray-500" />,
      details: [
        "Your saved preferences",
        "Personalized scheduling rules",
        "Custom time blocks",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Optimization Style</h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Choose how the AI should prioritize your tasks and time
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "p-4 border rounded-lg transition-all cursor-pointer",
              optimizationMode === option.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/30 hover:bg-muted/50"
            )}
            onClick={() =>
              setOptimizationMode(
                option.id as
                  | "balanced"
                  | "productivity"
                  | "wellbeing"
                  | "custom"
              )
            }
          >
            <div className="flex mb-3">
              <div className="mr-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    optimizationMode === option.id
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  {option.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{option.title}</h4>
                  {optimizationMode === option.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>

            {optimizationMode === option.id && (
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-xs font-medium mb-2">This style includes:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {option.details.map((detail, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-3 w-3 mr-1.5 text-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OptionsStep({ config, setConfig }: OptionsStepProps) {
  const toggleOption = (key: keyof typeof config) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const options = [
    {
      id: "respectFixedAppointments" as keyof typeof config,
      title: "Respect fixed appointments",
      description: "Keep scheduled meetings and appointments as they are",
      icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
    },
    {
      id: "addBreaks" as keyof typeof config,
      title: "Add breaks",
      description: "Schedule lunch break and smaller breaks throughout the day",
      icon: <Coffee className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "optimizeForFocus" as keyof typeof config,
      title: "Optimize for focus time",
      description: "Group similar tasks to minimize context switching",
      icon: <Focus className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Final Options</h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Customize how your schedule will be optimized
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {options.map((option) => {
          const isChecked = config[option.id];

          return (
            <div
              key={option.id}
              className="flex p-4 border rounded-lg transition-all hover:border-primary/30"
              onClick={() => toggleOption(option.id)}
            >
              <div className="mr-4 mt-0.5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isChecked ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  {option.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{option.title}</h4>
                  <button
                    role="switch"
                    aria-checked={isChecked}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isChecked ? "bg-primary" : "bg-input"
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                        isChecked ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-md bg-muted p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">AI-powered optimization</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our AI will find the optimal schedule based on your preferences
              and task requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingToolbar;
