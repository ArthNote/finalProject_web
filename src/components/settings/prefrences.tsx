import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, StarOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSchedulerModes,
  createSchedulerMode,
  updateSchedulerMode,
  deleteSchedulerMode,
  setPreferredMode,
  getPreferredMode,
} from "@/lib/api/schedulerPrefs";
import { SchedulingMode } from "@/types/mode";
import {
  adaptApiModesToUiModes,
  BUILT_IN_MODES,
  getIconForMode,
} from "@/lib/modes";
import { toast } from "@/hooks/use-toast";
import CreateModeDialog from "./createMode";
import ModeDetailsDialog from "./modeDetailsDialog";
import { useTranslations } from "next-intl";
import { Skeleton } from "../ui/skeleton";
import { ErrorState } from "../error_state";

const PreferencesTab = () => {
  const t = useTranslations("settings.preferences");
  // React Query client for cache management
  const queryClient = useQueryClient();

  // Selected mode for viewing/editing
  const [selectedMode, setSelectedMode] = useState<SchedulingMode | null>(null);

  // Edit mode flag
  const [isEditing, setIsEditing] = useState(false);

  // New mode form data
  const [newMode, setNewMode] = useState<Partial<SchedulingMode>>({
    name: "",
    description: "",
    config: { ...BUILT_IN_MODES[0].config },
  });

  // Fetch all scheduler modes
  const {
    data: modesData,
    isLoading: isLoadingModes,
    error: modesError,
    refetch: refetchModes,
  } = useQuery({
    queryKey: ["schedulerModes"],
    queryFn: getSchedulerModes,
  });

  // Get the current preferred mode
  const { data: preferredModeData, isLoading: isLoadingPreferredMode } =
    useQuery({
      queryKey: ["preferredMode"],
      queryFn: getPreferredMode,
    });

  // Update an existing mode mutation
  const updateModeMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateSchedulerMode(id, updates),
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["schedulerModes"],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["preferredMode"],
          type: "all",
        }),
      ]);
      toast({
        title: t("toast.modeUpdatedSuccess.title"),
        description: t("toast.modeUpdatedSuccess.description"),
      });

      // Exit edit mode
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: t("toast.modeUpdatedError.title"),
        description:
          error instanceof Error
            ? error.message
            : t("toast.modeUpdatedError.description"),
        variant: "destructive",
      });
    },
  });

  // Delete a mode mutation
  const deleteModeMutation = useMutation({
    mutationFn: deleteSchedulerMode,
    onSuccess: (data) => {
      toast({
        title: t("toast.modeDeletedSuccess.title"),
        description: t("toast.modeDeletedSuccess.description"),
      });

      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["schedulerModes"],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["preferredMode"],
          type: "all",
        }),
      ]);
    },
    onError: (error) => {
      toast({
        title: t("toast.modeDeletedError.title"),
        description:
          error instanceof Error
            ? error.message
            : t("toast.modeDeletedError.description"),
        variant: "destructive",
      });
    },
  });

  // Set preferred mode mutation
  const setPreferredModeMutation = useMutation({
    mutationFn: ({ id, isBuiltIn }: { id: string; isBuiltIn: boolean }) =>
      setPreferredMode(id, isBuiltIn),
    onSuccess: (data, variables) => {
      toast({
        title: "Default changed",
        description: `This is now your preferred scheduling mode`,
      });

      // Force a hard refetch of both queries
      queryClient.invalidateQueries({
        queryKey: ["schedulerModes"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["preferredMode"],
        refetchType: "all",
      });

      // Wait a moment then refetch to ensure data is fresh
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["schedulerModes"] });
        queryClient.refetchQueries({ queryKey: ["preferredMode"] });
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Error setting preferred mode",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Create a new mode mutation
  const createModeMutation = useMutation({
    mutationFn: createSchedulerMode,
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["schedulerModes"],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["preferredMode"],
          type: "all",
        }),
      ]);
      toast({
        title: t("toast.modeCreatedSuccess.title"),
        description: t("toast.modeCreatedSuccess.description"),
      });

      // Reset form
      setNewMode({
        name: "",
        description: "",
        config: { ...BUILT_IN_MODES[0].config },
      });
    },
    onError: (error) => {
      toast({
        title: t("toast.modeCreatedError.title"),
        description:
          error instanceof Error
            ? error.message
            : t("toast.modeCreatedError.description"),
        variant: "destructive",
      });
    },
  });

  const handleUpdateMode = () => {
    if (!selectedMode) return;

    // Don't send the icon in the API call
    const { icon, ...modeWithoutIcon } = selectedMode;

    updateModeMutation.mutate({
      id: selectedMode.id,
      updates: modeWithoutIcon,
    });
  };

  const handleDeleteMode = (id: string) => {
    deleteModeMutation.mutate(id);
  };

  const handleCopyMode = (mode: SchedulingMode) => {
    // Extract needed data for the copy
    const { icon, isBuiltIn, isDefault, id, ...copyData } = mode;

    createModeMutation.mutate({
      ...copyData,
      name: `Copy of ${mode.name}`,
      isPreferred: false,
    });
  };

  const handleSetPreferred = (mode: SchedulingMode) => {
    // Add console logs to debug
    console.log("Setting preferred mode:", mode.id, mode.isBuiltIn);

    setPreferredModeMutation.mutate(
      {
        id: mode.id,
        isBuiltIn: mode.isBuiltIn,
      },
      {
        onSuccess: (data) => {
          console.log("Set preferred success:", data);
          // Force refetch both queries to ensure UI updates
          queryClient.invalidateQueries({ queryKey: ["schedulerModes"] });
          queryClient.invalidateQueries({ queryKey: ["preferredMode"] });

          toast({
            title: "Default changed",
            description: `${mode.name} is now your preferred scheduling mode`,
          });
        },
        onError: (error) => {
          console.error("Set preferred error:", error);
        },
      }
    );
  };

  // Derive all modes from the query data
  const allModes = React.useMemo(() => {
    if (!modesData?.modes) return [];
    return adaptApiModesToUiModes(modesData.modes);
  }, [modesData?.modes]);

  // Show loading state
  if (isLoadingModes) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <div className="h-8 w-48 mb-2">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="h-4 w-96">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (modesError) {
    return (
      <ErrorState
        title={t("errorState.title")}
        description={
          modesError instanceof Error
            ? modesError.message
            : t("errorState.description")
        }
        action={t("errorState.action")}
        retryAction={refetchModes}
      />
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-4 w-full">
        {/* Create new mode button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t("availableModes")}</h3>
          <CreateModeDialog />
        </div>

        {/* List of modes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {allModes.map((mode) => (
            <Card key={mode.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIconForMode({ ...mode, icon: undefined })}
                    {mode.isBuiltIn
                      ? t(
                          `modes.${mode.name
                            .toLowerCase()
                            .replace(/\s+/g, "_")}.title`
                        )
                      : mode.name}
                  </div>
                  <div className="flex items-center gap-1">
                    {/* {mode.isPreferred && (
                      <Badge variant="secondary" className="mr-1">
                        {t("card.default")}
                      </Badge>
                    )} */}
                    {mode.isBuiltIn && (
                      <Badge variant="outline">{t("card.builtIn")}</Badge>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {mode.isBuiltIn
                    ? t(
                        `modes.${mode.name
                          .toLowerCase()
                          .replace(/\s+/g, "_")}.description`
                      )
                    : mode.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      {t("card.defaultDurationLabel")}
                    </p>
                    <p className="font-medium">
                      {t("card.defaultDurationValue", {
                        duration: mode.config.defaultDuration,
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      {t("card.dailyLimitLabel")}
                    </p>
                    <p className="font-medium">
                      {t("card.dailyLimitValue", {
                        tasks: mode.config.maxTasksPerDay,
                        hours: mode.config.maxHoursPerDay,
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      {t("card.breaksLabel")}
                    </p>
                    <p className="font-medium">
                      {mode.config.optimization.addBreaks.enabled
                        ? t("card.breaksValue", {
                            duration: mode.config.breakBetweenTasks,
                          })
                        : t("card.disabled")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      {t("card.focusOptimization")}
                    </p>
                    <p className="font-medium">
                      {mode.config.optimization.optimizeFocusTime
                        ? t("card.enabled")
                        : t("card.disabled")}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 flex justify-between">
                {/* Replaced dialog with our new component */}
                <ModeDetailsDialog
                  mode={mode}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleUpdateMode={handleUpdateMode}
                  handleDeleteMode={handleDeleteMode}
                  handleCopyMode={handleCopyMode}
                  updateModeMutation={updateModeMutation}
                  deleteModeMutation={deleteModeMutation}
                  createModeMutation={createModeMutation}
                />

                {/* <div className="flex gap-2">
                  {!mode.isPreferred && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleSetPreferred(mode)}
                      disabled={setPreferredModeMutation.isPending}
                    >
                      {setPreferredModeMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Star className="h-3.5 w-3.5" />
                      )}
                      Set as Default
                    </Button>
                  )}

                  {mode.isPreferred && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="gap-1 pointer-events-none"
                    >
                      <StarOff className="h-3.5 w-3.5" />
                      Default Mode
                    </Button>
                  )}
                </div> */}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Show message if no modes are available */}
        {allModes.length === 0 && !isLoadingModes && (
          <div className="py-12 text-center border rounded-lg">
            <h3 className="text-lg font-medium">
              {t("noSchedulingModes.title")}
            </h3>
            <p className="text-muted-foreground mt-1">
              {t("noSchedulingModes.description")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesTab;
