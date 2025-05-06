import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, Quote, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Tip {
  id: string;
  text: string;
  author?: string;
  source?: string;
  sourceUrl?: string;
  category: "productivity" | "focus" | "motivation" | "wellbeing";
}

const MotivationalTip = () => {
  const t = useTranslations("dashboard.motivationalTip");
  const [refreshKey, setRefreshKey] = useState(0);
  const locale = useLocale() as "en" | "fr";

  // // Fetch tip data
  // const { data: tip, isLoading } = useQuery<Tip>({
  //   queryKey: ["motivational-tip", refreshKey],
  //   queryFn: async () => {
  //     // Replace with actual API call
  //     // Define tips for both languages
  //     const tipsData = {
  //       en: [
  //         {
  //           id: "1",
  //           text: "The most effective way to do it, is to do it.",
  //           author: "Amelia Earhart",
  //           category: "motivation",
  //         },
  //         {
  //           id: "2",
  //           text: "Don't count the days, make the days count.",
  //           author: "Muhammad Ali",
  //           category: "motivation",
  //         },
  //         {
  //           id: "3",
  //           text: "The Pomodoro Technique isn't just about setting a timer; it's about respecting your mind's natural rhythm for sustained productivity.",
  //           category: "focus",
  //           source: "Productivity Research Institute",
  //           sourceUrl: "https://example.com/focus-research",
  //         },
  //         {
  //           id: "4",
  //           text: "Regularly taking short breaks improves concentration and prevents mental fatigue. Even a 5-minute break every hour can increase productivity by 30%.",
  //           category: "wellbeing",
  //         },
  //         {
  //           id: "5",
  //           text: "Start with the task that brings the most anxiety. Once completed, the rest of your day will feel lighter and more manageable.",
  //           category: "productivity",
  //         },
  //         {
  //           id: "6",
  //           text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  //           author: "Winston Churchill",
  //           category: "motivation",
  //         },
  //         {
  //           id: "7",
  //           text: "Practice mindful breathing for 2 minutes when feeling overwhelmed.",
  //           category: "wellbeing",
  //         },
  //       ],
  //       fr: [
  //         {
  //           id: "1",
  //           text: "La façon la plus efficace de le faire, c'est de le faire.",
  //           author: "Amelia Earhart",
  //           category: "motivation",
  //         },
  //         {
  //           id: "2",
  //           text: "Ne compte pas les jours, fais en sorte que les jours comptent.",
  //           author: "Muhammad Ali",
  //           category: "motivation",
  //         },
  //         {
  //           id: "3",
  //           text: "La technique Pomodoro n'est pas qu'une question de minuteur ; c'est respecter le rythme naturel de votre esprit pour une productivité durable.",
  //           category: "focus",
  //           source: "Institut de Recherche sur la Productivité",
  //           sourceUrl: "https://example.com/focus-research",
  //         },
  //         {
  //           id: "4",
  //           text: "Prendre régulièrement de courtes pauses améliore la concentration et prévient la fatigue mentale. Même une pause de 5 minutes par heure peut augmenter la productivité de 30%.",
  //           category: "wellbeing",
  //         },
  //         {
  //           id: "5",
  //           text: "Commencez par la tâche qui provoque le plus d'anxiété. Une fois terminée, le reste de votre journée semblera plus léger et plus gérable.",
  //           category: "productivity",
  //         },
  //         {
  //           id: "6",
  //           text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
  //           author: "Winston Churchill",
  //           category: "motivation",
  //         },
  //         {
  //           id: "7",
  //           text: "Pratiquez la respiration consciente pendant 2 minutes lorsque vous vous sentez dépassé.",
  //           category: "wellbeing",
  //         },
  //       ],
  //     };

  //     const tips = tipsData[locale];

  //     // Return a random tip
  //     return tips[Math.floor(Math.random() * tips.length)];
  //   },
  //   staleTime: Infinity, // Don't refetch automatically
  // });

  const tipsData = {
    en: [
      {
        id: "1",
        text: "The most effective way to do it, is to do it.",
        author: "Amelia Earhart",
        category: "motivation",
      },
      {
        id: "2",
        text: "Don't count the days, make the days count.",
        author: "Muhammad Ali",
        category: "motivation",
      },
      {
        id: "3",
        text: "The Pomodoro Technique isn't just about setting a timer; it's about respecting your mind's natural rhythm for sustained productivity.",
        category: "focus",
        source: "Productivity Research Institute",
        sourceUrl: "https://example.com/focus-research",
      },
      {
        id: "4",
        text: "Regularly taking short breaks improves concentration and prevents mental fatigue. Even a 5-minute break every hour can increase productivity by 30%.",
        category: "wellbeing",
      },
      {
        id: "5",
        text: "Start with the task that brings the most anxiety. Once completed, the rest of your day will feel lighter and more manageable.",
        category: "productivity",
      },
      {
        id: "6",
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "motivation",
      },
      {
        id: "7",
        text: "Practice mindful breathing for 2 minutes when feeling overwhelmed.",
        category: "wellbeing",
      },
    ],
    fr: [
      {
        id: "1",
        text: "La façon la plus efficace de le faire, c'est de le faire.",
        author: "Amelia Earhart",
        category: "motivation",
      },
      {
        id: "2",
        text: "Ne compte pas les jours, fais en sorte que les jours comptent.",
        author: "Muhammad Ali",
        category: "motivation",
      },
      {
        id: "3",
        text: "La technique Pomodoro n'est pas qu'une question de minuteur ; c'est respecter le rythme naturel de votre esprit pour une productivité durable.",
        category: "focus",
        source: "Institut de Recherche sur la Productivité",
        sourceUrl: "https://example.com/focus-research",
      },
      {
        id: "4",
        text: "Prendre régulièrement de courtes pauses améliore la concentration et prévient la fatigue mentale. Même une pause de 5 minutes par heure peut augmenter la productivité de 30%.",
        category: "wellbeing",
      },
      {
        id: "5",
        text: "Commencez par la tâche qui provoque le plus d'anxiété. Une fois terminée, le reste de votre journée semblera plus léger et plus gérable.",
        category: "productivity",
      },
      {
        id: "6",
        text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
        author: "Winston Churchill",
        category: "motivation",
      },
      {
        id: "7",
        text: "Pratiquez la respiration consciente pendant 2 minutes lorsque vous vous sentez dépassé.",
        category: "wellbeing",
      },
    ],
  };

  const tips = tipsData[locale];

  const tip = tips[Math.floor(Math.random() * tips.length)];

  // Refresh the tip
  const refreshTip = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // // Placeholder for loading state
  // if (isLoading) {
  //   return (
  //     <div className="space-y-2">
  //       <Skeleton className="h-4 w-3/4" />
  //       <Skeleton className="h-4 w-full" />
  //       <Skeleton className="h-4 w-1/2" />
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-3 ">
      <div className="flex items-start">
        <Quote className="h-5 w-5 text-primary/60 mr-2 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <p className="text-sm">{tip?.text}</p>

          {tip?.author && (
            <p className="text-xs text-muted-foreground font-medium">
              — {tip.author}
            </p>
          )}

          {tip?.source && (
            <div className="text-xs text-muted-foreground">
              {t("source")}:
              {tip.sourceUrl ? (
                <a
                  href={tip.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline inline-flex items-center"
                >
                  {tip.source}
                  <ExternalLink className="h-3 w-3 ml-0.5" />
                </a>
              ) : (
                <span className="ml-1">{tip.source}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshTip}
          className="h-7 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1.5" />
          {t("refreshTip")}
        </Button>
      </div>
    </div>
  );
};

export default MotivationalTip;
