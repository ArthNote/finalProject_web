import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while fetching the data. Please try again.",
  retryAction,
}: ErrorStateProps) {
  return (
    <div className="flex h-[450px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <ExclamationTriangleIcon className="h-10 w-10 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {retryAction && (
          <Button onClick={retryAction} className="mt-4" variant="outline">
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
