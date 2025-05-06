import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Zap, Target } from "lucide-react";
import { Progress } from "../ui/progress";
import { Goal } from "@/types/gamification";
import { useLocale, useTranslations } from "next-intl";

interface GoalCardProps {
  goal: Goal;
  onProgressUpdate: (progress: number) => void;
}

export function GoalCard({ goal, onProgressUpdate }: GoalCardProps) {
  const t = useTranslations("goals.goals");
  const locale = useLocale() as "en" | "fr";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`mt-1 ${
                goal.status === "completed" ? "text-green-500" : ""
              }`}
            >
              <Target className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3
                className={`font-medium ${
                  goal.status === "completed" ? "text-green-800" : ""
                }`}
              >
                {t(
                  `${goal.type.toLowerCase()}.goals.${goal.title
                    .toLowerCase()
                    .replace(/ /g, "_")}.title`
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(
                  `${goal.type.toLowerCase()}.goals.${goal.title
                    .toLowerCase()
                    .replace(/ /g, "_")}.description`
                )}
              </p>
              {goal.status === "completed" && goal.completedAt && (
                <p className="text-xs text-green-600">
                  {t("completed", {
                    date: new Date(goal.completedAt).toLocaleString(),
                  })}
                </p>
              )}
            </div>
          </div>
          <Badge>
            <Zap className="mr-1 h-3 w-3" />
            {goal.xpReward} XP
          </Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span>{t("progress")}</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress
            value={goal.progress}
            className={`h-2 ${
              goal.status === "completed" ? "bg-green-100" : ""
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
