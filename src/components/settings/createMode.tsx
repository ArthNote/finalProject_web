import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { SchedulingMode } from "@/types/mode";
import { BUILT_IN_MODES } from "@/lib/modes";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedulerMode } from "@/lib/api/schedulerPrefs";
import { useTranslations } from "next-intl";

const CreateModeDialog = () => {
  // Use an ID reference instead of comparing the entire config object
  const [selectedModeId, setSelectedModeId] = useState(BUILT_IN_MODES[0].id);
  const [newMode, setNewMode] = useState<Partial<SchedulingMode>>({
    name: "",
    description: "",
    config: { ...BUILT_IN_MODES[0].config },
  });

  const tt = useTranslations("settings.preferences");
  const t = useTranslations("settings.preferences.createMode");

  const queryClient = useQueryClient();

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
        title: tt("toast.modeCreatedSuccess.title"),
        description: tt("toast.modeCreatedSuccess.description"),
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
        title: tt("toast.modeCreatedError.title"),
        description:
          error instanceof Error
            ? error.message
            : tt("toast.modeCreatedError.description"),
        variant: "destructive",
      });
    },
  });

  const handleCreateMode = () => {
    if (!newMode.name) {
      toast({
        title: tt("toast.nameRequired.title"),
        description: tt("toast.nameRequired.description"),
        variant: "destructive",
      });
      return;
    }

    // Remove the icon property when sending to API
    const { icon, ...modeWithoutIcon } = newMode as any;

    createModeMutation.mutate({
      name: newMode.name,
      description: newMode.description || "Custom scheduling mode",
      config: newMode.config || BUILT_IN_MODES[0].config,
      isPreferred: false,
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("nameLabel")}</Label>
            <Input
              id="name"
              placeholder={t("namePlaceholder")}
              value={newMode.name}
              onChange={(e) => setNewMode({ ...newMode, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("descriptionLabel")}</Label>
            <Textarea
              id="description"
              placeholder={t("descriptionPlaceholder")}
              value={newMode.description}
              onChange={(e) =>
                setNewMode({ ...newMode, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-3">
            <Label>{t("chooseTemplate")}</Label>

            {/* Mode selection cards in vertical layout */}
            <div className="space-y-2">
              {BUILT_IN_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={cn(
                    "flex items-start p-3 border rounded-md w-full text-left",
                    "hover:bg-accent/50 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    selectedModeId === mode.id
                      ? "border-primary bg-accent/30"
                      : "border-border"
                  )}
                  onClick={() => {
                    // Set the selected mode ID
                    setSelectedModeId(mode.id);

                    // Update the newMode with a fresh copy of the config
                    setNewMode({
                      ...newMode,
                      config: JSON.parse(JSON.stringify(mode.config)),
                    });

                    // Log to confirm the click is detected
                    console.log("Mode selected:", mode.name);
                  }}
                >
                  <div className="shrink-0 mt-0.5 mr-3">{mode.icon}</div>
                  <div className="flex-grow overflow-hidden">
                    <h4 className="font-medium text-sm mb-1">
                      {tt(
                        `modes.${mode.name
                          .toLowerCase()
                          .replace(/\s+/g, "_")}.title`
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {tt(
                        `modes.${mode.name
                          .toLowerCase()
                          .replace(/\s+/g, "_")}.description`
                      )}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full",
                        selectedModeId === mode.id
                          ? "bg-primary border-2 border-background"
                          : "border-2 border-muted-foreground"
                      )}
                    ></div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {t("chooseTemplateDescription")}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button
            onClick={handleCreateMode}
            disabled={createModeMutation.isPending}
          >
            {createModeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("createMode")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModeDialog;
