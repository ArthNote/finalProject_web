import { create } from "zustand";
import { EventType } from "@/components/tasks/side_calendar/calendarData";

interface CalendarState {
  // Floating toolbar related state
  aiTaskInput: string;
  isRecording: boolean;
  optimizationMode: "balanced" | "productivity" | "wellbeing" | "custom";
  optimizationPeriod: "today" | "tomorrow" | "week" | "custom";
  optimizationTaskScope: "unscheduled" | "all" | "scheduled";
  showPriorityLevels: {
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  viewMode: "list" | "grid" | "kanban";
  isSettingsOpen: boolean;
  optimizationRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  showOptimizeRangePicker: boolean;
  showOptimizeModes: boolean;
  events: EventType[];
  // Add selectedEvent property
  selectedEvent: EventType | null;

  // Actions
  setAiTaskInput: (value: string) => void;
  toggleRecording: () => void;
  setIsRecording: (value: boolean) => void;
  processAiTask: () => void;
  setOptimizationMode: (
    mode: "balanced" | "productivity" | "wellbeing" | "custom"
  ) => void;
  setOptimizationPeriod: (
    period: "today" | "tomorrow" | "week" | "custom"
  ) => void;
  setOptimizationTaskScope: (
    scope: "unscheduled" | "all" | "scheduled"
  ) => void;
  setShowPriorityLevels: (levels: {
    high: boolean;
    medium: boolean;
    low: boolean;
  }) => void;
  setViewMode: (mode: "list" | "grid" | "kanban") => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setOptimizationRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  setShowOptimizeRangePicker: (show: boolean) => void;
  setShowOptimizeModes: (show: boolean) => void;
  setEvents: (events: EventType[]) => void;
  addEvent: (event: EventType) => void;
  updateEvent: (updatedEvent: EventType) => void;
  removeEvent: (eventId: string) => void;
  // Add setSelectedEvent action
  setSelectedEvent: (event: EventType | null) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  // Initial state
  aiTaskInput: "",
  isRecording: false,
  optimizationMode: "balanced",
  optimizationPeriod: "today",
  optimizationTaskScope: "unscheduled",
  showPriorityLevels: {
    high: true,
    medium: true,
    low: true,
  },
  viewMode: "list",
  isSettingsOpen: false,
  optimizationRange: {
    from: undefined,
    to: undefined,
  },
  showOptimizeRangePicker: false,
  showOptimizeModes: false,
  events: [],
  // Initialize selectedEvent as null
  selectedEvent: null,

  // Actions
  setAiTaskInput: (value) => set({ aiTaskInput: value }),
  toggleRecording: () => {
    set((state) => {
      const newRecordingState = !state.isRecording;

      // Simulate voice recording (like in the original code)
      if (newRecordingState) {
        setTimeout(() => {
          set({
            aiTaskInput:
              "Schedule a meeting with the design team to discuss new features",
            isRecording: false,
          });
        }, 2000);
      } else {
        // Reset AI task input when stopping recording without completion
        if (state.isRecording) {
          return { isRecording: false, aiTaskInput: "" };
        }
      }

      return { isRecording: newRecordingState };
    });
  },
  setIsRecording: (value) => set({ isRecording: value }),
  processAiTask: () => {
    set((state) => {
      // Create a new task based on AI input
      const newTask = {
        id: `task-${Date.now()}`,
        title: state.aiTaskInput.split(" ").slice(0, 5).join(" ") + "...",
        description: state.aiTaskInput,
        start: new Date(
          new Date().setHours(new Date().getHours() + 1, 0, 0, 0)
        ),
        end: new Date(new Date().setHours(new Date().getHours() + 2, 0, 0, 0)),
        color: "bg-primary",
      };

      return {
        events: [...state.events, newTask],
        aiTaskInput: "",
      };
    });
  },
  setOptimizationMode: (mode) => set({ optimizationMode: mode }),
  setOptimizationPeriod: (period) => set({ optimizationPeriod: period }),
  setOptimizationTaskScope: (scope) => set({ optimizationTaskScope: scope }),
  setShowPriorityLevels: (levels) => set({ showPriorityLevels: levels }), 
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setOptimizationRange: (range) => set({ optimizationRange: range }),
  setShowOptimizeRangePicker: (show) => set({ showOptimizeRangePicker: show }),
  setShowOptimizeModes: (show) => set({ showOptimizeModes: show }),
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      ),
    })),
  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== eventId),
    })),
  // Add setSelectedEvent implementation
  setSelectedEvent: (event) => set({ selectedEvent: event }),
}));
