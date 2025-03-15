import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
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
  CalendarDays,
  CalendarRange,
  Check,
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
  Zap,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { format, addDays } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/lib/state/useCalendarStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TimelineCalendar from "@/components/calendar/TimelineCalendar";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/dateFormate";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

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
  } = useCalendarStore();

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

                {/* Optimize Button - Hide label on mobile */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={isMobile ? "icon" : "default"}
                          variant="outline"
                          className={`rounded-full hover:bg-secondary border-primary/20 ${
                            isMobile ? "px-2" : "px-4 gap-2"
                          }`}
                        >
                          <Zap className={`${"h-4 w-4"} text-primary`} />
                          {!isMobile && (
                            <span className="text-sm">Optimize</span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Optimize Schedule</TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent
                    align="center"
                    side="top"
                    className="w-96 max-h-[550px] overflow-y-auto mb-4"
                  >
                    {showOptimizeModes ? (
                      <>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium">
                              Optimization Modes
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => setShowOptimizeModes(false)}
                            >
                              Back
                            </Button>
                          </div>

                          <div className="space-y-4 mt-2">
                            <div
                              className="flex items-center gap-3 p-4 rounded-md hover:bg-muted cursor-pointer border transition-all hover:shadow-sm"
                              onClick={() => {
                                setOptimizationMode("balanced");
                                setShowOptimizeModes(false);
                              }}
                            >
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-full">
                                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Balanced</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Distribute tasks evenly with regular breaks
                                </p>
                              </div>
                              {optimizationMode === "balanced" && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>

                            <div
                              className="flex items-center gap-3 p-4 rounded-md hover:bg-muted cursor-pointer border transition-all hover:shadow-sm"
                              onClick={() => {
                                setOptimizationMode("productivity");
                                setShowOptimizeModes(false);
                              }}
                            >
                              <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-full">
                                <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  Productivity Focus
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Group similar tasks and minimize context
                                  switching
                                </p>
                              </div>
                              {optimizationMode === "productivity" && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>

                            <div
                              className="flex items-center gap-3 p-4 rounded-md hover:bg-muted cursor-pointer border transition-all hover:shadow-sm"
                              onClick={() => {
                                setOptimizationMode("wellbeing");
                                setShowOptimizeModes(false);
                              }}
                            >
                              <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-full">
                                <Sun className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  Wellbeing Focus
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Ensure regular breaks and avoid overloading
                                  your schedule
                                </p>
                              </div>
                              {optimizationMode === "wellbeing" && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>

                            <div
                              className="flex items-center gap-3 p-4 rounded-md hover:bg-muted cursor-pointer border transition-all hover:shadow-sm"
                              onClick={() => {
                                setOptimizationMode("custom");
                                setShowOptimizeModes(false);
                              }}
                            >
                              <div className="bg-slate-100 dark:bg-slate-900/30 p-2.5 rounded-full">
                                <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  Custom Rules
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Apply your personalized scheduling preferences
                                </p>
                              </div>
                              {optimizationMode === "custom" && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : showOptimizeRangePicker ? (
                      <>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium">
                              Select Date Range
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => setShowOptimizeRangePicker(false)}
                            >
                              Back
                            </Button>
                          </div>
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
                                  setShowOptimizeRangePicker(false);
                                }
                              }
                            }}
                            numberOfMonths={1}
                            className="w-full border rounded-md p-2 bg-background shadow-sm mx-auto"
                          />

                          <div className="mt-3 text-center text-sm text-muted-foreground py-2 border rounded-md bg-muted/30">
                            {optimizationRange.from && optimizationRange.to ? (
                              <span>
                                {format(optimizationRange.from, "MMMM d, yyyy")}{" "}
                                - {format(optimizationRange.to, "MMMM d, yyyy")}
                              </span>
                            ) : (
                              <span>Select start and end dates</span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4 space-y-6">
                          {/* Mode Selection */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-medium">
                                Optimization Mode
                              </label>
                              <Link href="/settings?tab=prefrences">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs"
                                >
                                  Manage Modes
                                </Button>
                              </Link>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-md bg-muted/50 border">
                              <div
                                className={cn(
                                  "p-2.5 rounded-full",
                                  optimizationMode === "balanced"
                                    ? "bg-blue-100 dark:bg-blue-900/30"
                                    : optimizationMode === "productivity"
                                    ? "bg-purple-100 dark:bg-purple-900/30"
                                    : optimizationMode === "wellbeing"
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : "bg-slate-100 dark:bg-slate-900/30"
                                )}
                              >
                                {optimizationMode === "balanced" ? (
                                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                ) : optimizationMode === "productivity" ? (
                                  <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                ) : optimizationMode === "wellbeing" ? (
                                  <Sun className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {optimizationMode === "balanced"
                                    ? "Balanced"
                                    : optimizationMode === "productivity"
                                    ? "Productivity Focus"
                                    : optimizationMode === "wellbeing"
                                    ? "Wellbeing Focus"
                                    : "Custom Rules"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {optimizationMode === "balanced"
                                    ? "Distribute tasks evenly with regular breaks"
                                    : optimizationMode === "productivity"
                                    ? "Group similar tasks and minimize context switching"
                                    : optimizationMode === "wellbeing"
                                    ? "Ensure regular breaks and avoid overloading"
                                    : "Apply your personalized scheduling preferences"}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => setShowOptimizeModes(true)}
                              >
                                Change
                              </Button>
                            </div>
                          </div>

                          {/* Date Range Selection */}
                          <div className="space-y-4">
                            <label className="text-sm font-medium">
                              Time Period
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                variant={
                                  optimizationPeriod === "today"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="justify-start h-14"
                                onClick={() => setOptimizationPeriod("today")}
                              >
                                <div className="flex flex-col items-start text-left">
                                  <span className="flex items-center text-xs font-medium">
                                    <CalendarDays className="mr-2 h-3.5 w-3.5" />
                                    Today Only
                                  </span>
                                  <span className="text-[10px] ml-6 mt-1">
                                    {formatDate(
                                      new Date(),
                                      "weekdayShort",
                                      locale
                                    )}
                                  </span>
                                </div>
                              </Button>

                              <Button
                                variant={
                                  optimizationPeriod === "tomorrow"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="justify-start h-14"
                                onClick={() =>
                                  setOptimizationPeriod("tomorrow")
                                }
                              >
                                <div className="flex flex-col items-start text-left">
                                  <span className="flex items-center text-xs font-medium">
                                    <CalendarDays className="mr-2 h-3.5 w-3.5" />
                                    Tomorrow
                                  </span>
                                  <span className="text-[10px] ml-6 mt-1">
                                    {formatDate(
                                      addDays(new Date(), 1),
                                      "weekdayShort",
                                      locale
                                    )}
                                  </span>
                                </div>
                              </Button>

                              <Button
                                variant={
                                  optimizationPeriod === "week"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="justify-start h-14"
                                onClick={() => setOptimizationPeriod("week")}
                              >
                                <div className="flex flex-col items-start text-left text-wrap">
                                  <span className="flex items-center text-xs font-medium">
                                    <CalendarRange className="mr-2 h-3.5 w-3.5" />
                                    This Week
                                  </span>
                                  <span className="text-[10px] ml-6 mt-1">
                                    Next 7 days
                                  </span>
                                </div>
                              </Button>

                              <Button
                                variant={
                                  optimizationPeriod === "custom"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="justify-start h-14"
                                onClick={() => {
                                  setShowOptimizeRangePicker(true);
                                }}
                              >
                                <div className="flex flex-col items-start text-left">
                                  <span className="flex items-center text-xs font-medium">
                                    <CalendarRange className="mr-2 h-3.5 w-3.5" />
                                    Custom Range
                                  </span>
                                  <span className="text-[10px]  ml-6 mt-1">
                                    Select specific dates
                                  </span>
                                </div>
                              </Button>
                            </div>

                            {optimizationPeriod === "custom" &&
                              optimizationRange.from &&
                              optimizationRange.to && (
                                <div className="text-xs mt-2 text-center bg-muted py-2 rounded-md border">
                                  Selected range:{" "}
                                  <span className="font-medium">
                                    {format(optimizationRange.from, "MMMM d")} -{" "}
                                    {format(optimizationRange.to, "MMMM d")}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Apply button */}
                        <div className="p-4 pt-0">
                          <Button className="w-full">
                            <Sparkles className="h-4 w-4" />
                            Apply Optimization
                          </Button>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Prioritize/Filter Tasks */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                        >
                          <ListFilter
                            className={`${
                              isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
                            }`}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Filter & Prioritize</TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuLabel>Task Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                        Priority Levels
                      </h4>
                      <div className="space-y-1">
                        <DropdownMenuCheckboxItem
                          checked={showPriorityLevels.high}
                          onCheckedChange={(checked) =>
                            setShowPriorityLevels({
                              ...showPriorityLevels,
                              high: !!checked,
                            })
                          }
                        >
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                            High Priority
                          </div>
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={showPriorityLevels.medium}
                          onCheckedChange={(checked) =>
                            setShowPriorityLevels({
                              ...showPriorityLevels,
                              medium: !!checked,
                            })
                          }
                        >
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                            Medium Priority
                          </div>
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={showPriorityLevels.low}
                          onCheckedChange={(checked) =>
                            setShowPriorityLevels({
                              ...showPriorityLevels,
                              low: !!checked,
                            })
                          }
                        >
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Low Priority
                          </div>
                        </DropdownMenuCheckboxItem>
                      </div>

                      <DropdownMenuSeparator className="my-2" />

                      <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                        Sort By
                      </h4>
                      <DropdownMenuRadioGroup value="priority">
                        <DropdownMenuRadioItem value="priority">
                          <ShieldAlert className="mr-2 h-4 w-4" /> Priority
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="time">
                          <Clock4 className="mr-2 h-4 w-4" /> Time
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="category">
                          <Package className="mr-2 h-4 w-4" /> Category
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

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
                      onValueChange={setViewMode}
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
    </>
  );
};

export default FloatingToolbar;
