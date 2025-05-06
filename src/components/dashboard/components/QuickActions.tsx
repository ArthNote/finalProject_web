import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PlusCircle,
  Calendar as CalendarIcon,
  ListChecks,
  Sparkles,
  Timer,
  Target,
  Settings,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTaskSheet from "@/components/tasks/CreateTaskSheet";
import AiTasksSheet from "@/components/tasks/AiTasksSheet";
import { useRouter } from "@/i18n/navigation";

const QuickActions = () => {
  const t = useTranslations("dashboard.quickActions");
  const router = useRouter();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [aiTasksOpen, setAiTasksOpen] = useState(false);
  const [aiTaskInput, setAiTaskInput] = useState("");

  // Navigation functions
  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Open AI task generator
  const generatePlan = () => {
    setAiTasksOpen(true);
  };

  // Action groups
  const actionGroups = [
    {
      title: t("tasks"),
      actions: [
        {
          icon: <PlusCircle className="h-4 w-4 mr-2" />,
          label: t("addTask"),
          onClick: () => setCreateTaskOpen(true),
        },
        {
          icon: <Sparkles className="h-4 w-4 mr-2" />,
          label: t("generateAi"),
          onClick: generatePlan,
        },
      ],
    },
    {
      title: t("navigate"),
      actions: [
        {
          icon: <CalendarIcon className="h-4 w-4 mr-2" />,
          label: t("calendar"),
          onClick: () => navigateTo("/calendar"),
        },
        {
          icon: <Target className="h-4 w-4 mr-2" />,
          label: t("goals"),
          onClick: () => navigateTo("/goals"),
        },
        {
          icon: <ListChecks className="h-4 w-4 mr-2" />,
          label: t("tasks"),
          onClick: () => navigateTo("/tasks"),
        },
      ],
    },
    {
      title: t("tools"),
      actions: [
        {
          icon: <Timer className="h-4 w-4 mr-2" />,
          label: t("pomodoro"),
          onClick: () => {
            // Scroll to Pomodoro section
            document
              .querySelector('[data-section="pomodoro"]')
              ?.scrollIntoView({ behavior: "smooth" });
          },
        },
        // {
        //   icon: <BarChart className="h-4 w-4 mr-2" />,
        //   label: t("analytics"),
        //   onClick: () => navigateTo("/analytics"),
        // },
        {
          icon: <Settings className="h-4 w-4 mr-2" />,
          label: t("settings"),
          onClick: () => navigateTo("/settings"),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {actionGroups.map((group, idx) => (
        <div key={idx} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {group.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.actions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={action.onClick}
                className="justify-start h-10"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Task sheets */}
      <CreateTaskSheet open={createTaskOpen} onOpenChange={setCreateTaskOpen} />

      <AiTasksSheet
        open={aiTasksOpen}
        onOpenChange={setAiTasksOpen}
        aiTaskInput={aiTaskInput}
      />
    </div>
  );
};

export default QuickActions;
