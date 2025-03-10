import React from "react";
import { Button } from "@/components/ui/button";
import { FolderOpenIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: string;
  actionHandler?: () => void;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title = "No data available",
  description = "There are no items to display at this time.",
  action,
  actionHandler,
  icon = <FolderOpenIcon className="h-10 w-10 text-muted-foreground" />,
}: EmptyStateProps) => {
  return (
    <div className="flex h-[500px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {action && actionHandler && (
          <Button onClick={actionHandler} className="mt-4" variant="outline">
            {action}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
