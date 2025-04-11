import { Goal } from "@/types/goals";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Zap, Lock, Target } from "lucide-react";
import { Progress } from "../ui/progress";

export function GoalCard({ goal }: { goal: Goal }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`mt-1 ${
                goal.status === "completed"
                  ? "text-green-500"
                  : goal.status === "locked"
                  ? "text-muted-foreground"
                  : ""
              }`}
            >
              {goal.icon || <Target className="h-5 w-5" />}
            </div>
            <div className="space-y-1">
              <h3
                className={`font-medium ${
                  goal.status === "completed"
                    ? "text-green-800"
                    : goal.status === "locked"
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                {goal.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
              {goal.status === "completed" && goal.completedAt && (
                <p className="text-xs text-green-600">
                  Completed: {goal.completedAt}
                </p>
              )}
            </div>
          </div>
          <Badge>
            {goal.status === "locked" ? (
              <Lock className="mr-1 h-3 w-3" />
            ) : (
              <Zap className="mr-1 h-3 w-3" />
            )}
            {goal.xp} XP
          </Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress
            value={goal.progress}
            className={`h-2 ${
              goal.status === "completed"
                ? "bg-green-100"
                : goal.status === "locked"
                ? "bg-muted"
                : ""
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
