import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  Star,
  TimerOff,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export interface GamifiedGoal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  xp: number;
  dueDate?: string;
  category?: string;
  tags?: string[];
}
// import { GamifiedGoal } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface GamedGoalsViewProps {
  activeTab: "daily" | "weekly" | "monthly";
}

// Mock data for different goal types
const mockDailyGoals: GamifiedGoal[] = [
  {
    id: "d1",
    title: "Complete 3 priority tasks",
    completed: false,
    xp: 20,
    tags: ["productivity"],
  },
  {
    id: "d2",
    title: "Log your mood",
    completed: true,
    xp: 10,
    category: "wellbeing",
  },
  {
    id: "d3",
    title: "Write 100 words",
    completed: false,
    xp: 15,
    category: "creativity",
  },
  {
    id: "d4",
    title: "Review team progress",
    completed: false,
    xp: 20,
    category: "management",
  },
  {
    id: "d5",
    title: "Clear email inbox",
    completed: true,
    xp: 10,
    tags: ["maintenance"],
  },
];

const mockWeeklyGoals: GamifiedGoal[] = [
  {
    id: "w1",
    title: "Finish Project Phase 1",
    description: "Complete all tasks related to the initial planning phase",
    completed: false,
    xp: 50,
    dueDate: "2025-04-10",
    category: "project",
    tags: ["critical"],
  },
  {
    id: "w2",
    title: "Attend 2 team meetings",
    description: "Participate in weekly sync and planning sessions",
    completed: true,
    xp: 30,
    dueDate: "2025-04-08",
    category: "teamwork",
  },
  {
    id: "w3",
    title: "Code review for 3 pull requests",
    description: "Review and provide feedback on team contributions",
    completed: false,
    xp: 40,
    dueDate: "2025-04-12",
    category: "development",
    tags: ["collaboration"],
  },
];

const mockMonthlyGoals: GamifiedGoal[] = [
  {
    id: "m1",
    title: "Complete 20 tasks",
    description: "Maintain consistent productivity over the month",
    completed: false,
    xp: 100,
    dueDate: "2025-04-30",
    category: "productivity",
    tags: ["habit"],
  },
  {
    id: "m2",
    title: "Launch MVP",
    description: "Deploy the first version of the product to production",
    completed: false,
    xp: 200,
    dueDate: "2025-04-25",
    category: "project",
    tags: ["milestone"],
  },
  {
    id: "m3",
    title: "Maintain daily streak",
    description: "Keep your daily usage streak going for the whole month",
    completed: false,
    xp: 150,
    dueDate: "2025-04-30",
    category: "consistency",
    tags: ["habit"],
  },
];

const GamedGoalsView: React.FC<GamedGoalsViewProps> = ({ activeTab }) => {
  // State for manage goals data
  const [dailyGoals, setDailyGoals] = useState<GamifiedGoal[]>(mockDailyGoals);
  const [weeklyGoals, setWeeklyGoals] =
    useState<GamifiedGoal[]>(mockWeeklyGoals);
  const [monthlyGoals, setMonthlyGoals] =
    useState<GamifiedGoal[]>(mockMonthlyGoals);

  // Toggle goal completion
  const toggleGoalCompletion = (
    id: string,
    type: "daily" | "weekly" | "monthly"
  ) => {
    if (type === "daily") {
      setDailyGoals((prev) =>
        prev.map((goal) =>
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        )
      );
    } else if (type === "weekly") {
      setWeeklyGoals((prev) =>
        prev.map((goal) =>
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        )
      );
    } else {
      setMonthlyGoals((prev) =>
        prev.map((goal) =>
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        )
      );
    }
  };

  // Helper to get active goals based on the tab
  const getActiveGoals = () => {
    switch (activeTab) {
      case "daily":
        return dailyGoals;
      case "weekly":
        return weeklyGoals;
      case "monthly":
        return monthlyGoals;
      default:
        return [];
    }
  };

  // Calculate completion progress
  const calculateProgress = (goals: GamifiedGoal[]) => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter((goal) => goal.completed).length;
    return Math.round((completedGoals / goals.length) * 100);
  };

  const activeGoals = getActiveGoals();
  const progress = calculateProgress(activeGoals);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-card to-card/80 rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {activeTab === "daily" && (
                <ListTodo className="h-5 w-5 text-blue-500" />
              )}
              {activeTab === "weekly" && (
                <Calendar className="h-5 w-5 text-purple-500" />
              )}
              {activeTab === "monthly" && (
                <Trophy className="h-5 w-5 text-amber-500" />
              )}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Goals
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {activeTab === "daily" && "Quick tasks to accomplish today"}
              {activeTab === "weekly" &&
                "Objectives to complete this week (Apr 5 - Apr 11)"}
              {activeTab === "monthly" && "Strategic goals for April 2025"}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{progress}% Complete</span>
              <Badge
                variant={progress === 100 ? "secondary" : "outline"}
                className="flex items-center gap-1"
              >
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                {activeGoals.filter((g) => g.completed).length}/
                {activeGoals.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2 w-full md:w-60 mt-2" />
          </div>
        </div>
      </div>

      {/* Goals Grid Layout */}
      <div className="grid grid-cols-1 gap-4">
        {activeGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onToggle={() => toggleGoalCompletion(goal.id, activeTab)}
            type={activeTab}
          />
        ))}

        {/* Add Goal Button */}
        <Button
          variant="outline"
          className="border-dashed h-auto py-6 border-2 group hover:border-primary/30 hover:bg-primary/5 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
          Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Goal
        </Button>
      </div>

      {/* Tips and Guide Accordion */}
      <Accordion
        type="single"
        collapsible
        className="bg-muted/40 rounded-lg border mt-6"
      >
        <AccordionItem value="tips" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm">Tips for {activeTab} goals</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2 text-sm">
              {activeTab === "daily" && (
                <>
                  <p>• Focus on 3-5 achievable goals per day</p>
                  <p>• Prioritize important tasks early in the day</p>
                  <p>• Daily goals reset at midnight</p>
                  <p>• Completing all daily goals earns a bonus streak point</p>
                </>
              )}

              {activeTab === "weekly" && (
                <>
                  <p>• Break down larger projects into weekly chunks</p>
                  <p>• Weekly goals should be specific and measurable</p>
                  <p>• Review weekly goals every Monday morning</p>
                  <p>• Weekly goals reset every Sunday at midnight</p>
                </>
              )}

              {activeTab === "monthly" && (
                <>
                  <p>• Monthly goals should align with quarterly objectives</p>
                  <p>• Focus on habit building and major milestones</p>
                  <p>• Schedule mid-month review to adjust if needed</p>
                  <p>• Completing monthly goals earns significant XP bonuses</p>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// Goal Card Component
interface GoalCardProps {
  goal: GamifiedGoal;
  onToggle: () => void;
  type: "daily" | "weekly" | "monthly";
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onToggle, type }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Select background color based on type and completion
  const getBgColor = () => {
    if (goal.completed) return "bg-muted/50";

    switch (type) {
      case "daily":
        return "bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10";
      case "weekly":
        return "bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/10";
      case "monthly":
        return "bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/10";
      default:
        return "bg-card";
    }
  };

  // Get border color based on type
  const getBorderColor = () => {
    if (goal.completed) return "border-muted";

    switch (type) {
      case "daily":
        return "border-blue-200 dark:border-blue-800/30";
      case "weekly":
        return "border-purple-200 dark:border-purple-800/30";
      case "monthly":
        return "border-amber-200 dark:border-amber-800/30";
      default:
        return "border-border";
    }
  };

  // Get XP badge color based on XP amount
  const getXpBadgeColor = () => {
    if (goal.completed) return "bg-muted text-muted-foreground";

    if (goal.xp >= 100) {
      return "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950";
    } else if (goal.xp >= 50) {
      return "bg-gradient-to-r from-purple-400 to-purple-300 text-purple-950";
    } else {
      return "bg-gradient-to-r from-blue-400 to-blue-300 text-blue-950";
    }
  };

  return (
    <Card
      className={`${getBgColor()} ${getBorderColor()} transition-all duration-200 hover:shadow-md ${
        goal.completed ? "opacity-80" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`goal-${goal.id}`}
            checked={goal.completed}
            onCheckedChange={onToggle}
            className={`mt-1 ${
              goal.completed ? "bg-primary border-primary" : ""
            } transition-colors`}
          />

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <label
                  htmlFor={`goal-${goal.id}`}
                  className={`text-base font-medium ${
                    goal.completed ? "line-through text-muted-foreground" : ""
                  } transition-colors`}
                >
                  {goal.title}
                </label>

                {goal.description && (
                  <p
                    className={`text-sm mt-1 ${
                      goal.completed
                        ? "text-muted-foreground/70 line-through"
                        : "text-muted-foreground"
                    } transition-colors`}
                  >
                    {goal.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Badge
                  variant="secondary"
                  className={`${
                    goal.completed ? "bg-muted" : getXpBadgeColor()
                  } flex items-center gap-1 shadow-sm`}
                >
                  {!goal.completed && <Sparkles className="h-3 w-3" />}
                  {goal.xp} XP
                </Badge>

                {type !== "daily" && goal.dueDate && (
                  <Badge
                    variant="outline"
                    className="ml-1 flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {new Date(goal.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Badge>
                )}
              </div>
            </div>

            {(goal.category || (goal.tags && goal.tags.length > 0)) && (
              <div className="flex flex-wrap gap-1 mt-2">
                {goal.category && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {goal.category}
                  </Badge>
                )}

                {goal.tags &&
                  goal.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs px-2 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            )}

            {type !== "daily" && (
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="mt-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {goal.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                    ) : (
                      <TimerOff className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    <span>{goal.completed ? "Completed" : "In progress"}</span>
                  </div>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      {isOpen ? "Less" : "More"}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-2 space-y-2 animate-accordion-down">
                  <Separator />
                  <div className="pt-2 grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Assigned to</span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span>Apr 2, 2025</span>
                    </div>

                    <Button variant="outline" size="sm" className="mt-1 w-full">
                      View Details
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamedGoalsView;
