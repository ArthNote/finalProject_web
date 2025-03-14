import React from "react";
import TasksSidebar from "@/components/sidebar/TasksSidebar";
import { Card } from "@/components/ui/card";

const TasksPage = () => {
  return (
    <Card className="flex h-[90vh]">
      <TasksSidebar />
      <main className="flex-1 p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-medium tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage your schedule and daily activities
            </p>
          </div>

          {/* Content Area */}
          <div className="mt-8 rounded-lg border bg-white dark:bg-background p-6">
            <div className="text-muted-foreground/80">
              Tasks content will go here
            </div>
          </div>
        </div>
      </main>
    </Card>
  );
};

export default TasksPage;
