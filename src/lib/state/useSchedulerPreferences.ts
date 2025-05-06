import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SchedulerMode, SchedulerModeConfig } from "../api/schedulerPrefs";

interface SchedulerPreferencesState {
  modes: SchedulerMode[];
  preferredModeId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setModes: (modes: SchedulerMode[]) => void;
  addMode: (mode: SchedulerMode) => void;
  updateMode: (id: string, updates: Partial<SchedulerMode>) => void;
  removeMode: (id: string) => void;
  setPreferredMode: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSchedulerPreferences = create<SchedulerPreferencesState>()(
  persist(
    (set) => ({
      modes: [],
      preferredModeId: null,
      isLoading: false,
      error: null,

      // Actions
      setModes: (modes) => set({ modes }),
      addMode: (mode) =>
        set((state) => ({
          modes: [...state.modes, mode],
          // If this mode is preferred, update preferredModeId
          preferredModeId: mode.isPreferred ? mode.id : state.preferredModeId,
        })),
      updateMode: (id, updates) =>
        set((state) => ({
          modes: state.modes.map((mode) =>
            mode.id === id ? { ...mode, ...updates } : mode
          ),
          // Update preferredModeId if needed
          preferredModeId: updates.isPreferred
            ? id
            : state.preferredModeId === id && updates.isPreferred === false
            ? null
            : state.preferredModeId,
        })),
      removeMode: (id) =>
        set((state) => ({
          modes: state.modes.filter((mode) => mode.id !== id),
          // Clear preferredModeId if it was this mode
          preferredModeId:
            state.preferredModeId === id ? null : state.preferredModeId,
        })),
      setPreferredMode: (id) =>
        set((state) => {
          // Update all modes isPreferred status and set the preferredModeId
          return {
            modes: state.modes.map((mode) => ({
              ...mode,
              isPreferred: mode.id === id,
            })),
            preferredModeId: id,
          };
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "scheduler-preferences",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
