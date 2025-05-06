"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, CalendarIcon, LineChart, Loader2 } from "lucide-react";
import { getMoodHistory, getTodaysMood, saveMoodEntry } from "@/lib/api/mood";
import { MoodEntry } from "@/types/mood";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";

// Define mood types
const MOODS = [
  { emoji: "😀", label: "great", color: "bg-green-500" },
  { emoji: "🙂", label: "good", color: "bg-emerald-500" },
  { emoji: "😐", label: "neutral", color: "bg-blue-500" },
  { emoji: "😕", label: "bad", color: "bg-amber-500" },
  { emoji: "😢", label: "awful", color: "bg-red-500" },
];

const MoodTracker = () => {
  const t = useTranslations("dashboard.mood");
  const queryClient = useQueryClient();

  const [selectedMood, setSelectedMood] = useState("");
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // Get today's entry if it exists
  const { data: todayEntryResponse, isLoading: isLoadingToday } = useQuery({
    queryKey: ["mood", "today"],
    queryFn: getTodaysMood,
  });

  // Populate form with any existing entry
  useEffect(() => {
    const todayEntry = todayEntryResponse?.data;
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setEnergy(todayEntry.energy);
      setNote(todayEntry.note || "");
      setDate(new Date(todayEntry.date));
    }
  }, [todayEntryResponse?.data]);

  // Save mood entry
  const saveMutation = useMutation({
    mutationFn: async (
      entry: Omit<MoodEntry, "id" | "userId" | "createdAt" | "updatedAt">
    ) => {
      return await saveMoodEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood"] });
      toast({
        title: t("saveSuccess.title"),
        description: t("saveSuccess.description"),
      });
    },
    onError: (error) => {
      toast({
        title: t("saveError.title"),
        description: t("saveError.description"),
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!selectedMood) return;

    const entry: Omit<MoodEntry, "id" | "userId" | "createdAt" | "updatedAt"> =
      {
        date: date.toISOString(),
        mood: selectedMood,
        energy,
        note: note.trim() || undefined,
      };

    saveMutation.mutate(entry);
  };

  // Get mood emoji from mood label
  const getMoodEmoji = (moodLabel: string) => {
    return MOODS.find((mood) => mood.label === moodLabel)?.emoji || "😐";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-6">
        {/* Select Mood */}
        <div className="space-y-2">
          <Label>{t("howAreYouFeeling")}</Label>
          <div className="flex justify-around gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`rounded-full text-2xl p-2 transition-all ${
                  selectedMood === mood.label
                    ? `ring-2 ring-offset-2 ${mood.color} bg-opacity-20`
                    : "hover:bg-accent"
                }`}
                aria-label={t(`moods.${mood.label}`)}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t("energyLevel")}</Label>
            <span className="text-sm font-medium">{energy}/10</span>
          </div>
          <Slider
            value={[energy]}
            min={1}
            max={10}
            step={1}
            onValueChange={(values) => setEnergy(values[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("low")}</span>
            <span>{t("high")}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>{t("notes")}</Label>
          <Textarea
            placeholder={t("notesPlaceholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Date and Actions */}
        <div className="flex items-center justify-between">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="h-3.5 w-3.5" />
                {format(date, "MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                variant="compact"
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date || new Date());
                  setCalendarOpen(false);
                }}
                initialFocus
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-2">
            <Dialog
              open={historyDialogOpen}
              onOpenChange={setHistoryDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-1">
                  <LineChart className="h-3.5 w-3.5" />
                  {t("history")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("moodHistory")}</DialogTitle>
                </DialogHeader>
                <MoodHistory />
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleSave}
              disabled={!selectedMood || saveMutation.isPending}
              size="sm"
              className="gap-1"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {t("save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mood history component to display in dialog
const MoodHistory = () => {
  const t = useTranslations("dashboard.mood");
  const { data: historyResponse, isLoading } = useQuery({
    queryKey: ["mood", "history"],
    queryFn: () => getMoodHistory(14), // Last 14 days
  });
  const locale = useLocale() as "fr" | "en";

  if (isLoading) {
    return <div className="py-4 text-center">{t("loading")}</div>;
  }

  const entries = historyResponse?.data || [];

  if (entries.length === 0) {
    return <div className="py-4 text-center">{t("noMoodEntries")}</div>;
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3 pb-3 border-b">
          <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-medium">{t(`moods.${entry.mood}`)}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(entry.date), "MMM d, yyyy", {
                  locale: locale === "en" ? enUS : fr,
                })}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("energy")}: {entry.energy}/10
            </div>
            {entry.note && <div className="text-sm mt-1">{entry.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get mood emoji
const getMoodEmoji = (moodLabel: string) => {
  return MOODS.find((mood) => mood.label === moodLabel)?.emoji || "😐";
};

export default MoodTracker;
