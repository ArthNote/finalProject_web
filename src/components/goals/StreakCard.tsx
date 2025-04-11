import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { StreakCardProps } from "@/types/goals";

export const StreakCard: React.FC<StreakCardProps> = ({ streak, longestStreak }) => {
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-orange-100/50 to-orange-50/30 dark:from-orange-900/20 dark:to-orange-950/10 pb-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" /> Daily Streak
        </h3>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-4xl font-bold text-orange-500">{streak}</div>
            <div className="text-sm text-muted-foreground">Current</div>
          </div>

          <div className="h-10 w-px bg-border mx-4"></div>

          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-muted-foreground">
              {longestStreak}
            </div>
            <div className="text-sm text-muted-foreground">Longest</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="flex justify-between gap-2 mt-3">
            {Array.from({ length: 7 }).map((_, i) => {
              const isActive = i < streak % 7;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full mb-1 ${
                      isActive ? "bg-orange-500" : "bg-muted"
                    }`}
                  ></div>
                  <div className="text-xs text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-center text-sm bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 p-2 rounded-md">
          <span className="font-medium">Next Bonus:</span> +25 XP at 10 days
          streak
        </div>
      </CardContent>
    </Card>
  );
};
