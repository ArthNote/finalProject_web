import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectGridSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-white" />
            ))}
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
}

export function ProjectListSkeleton() {
  return (
    <Card>
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-32">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>

          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />

          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>

          <Skeleton className="h-4 w-24" />

          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProjectsLoadingSkeleton({ viewMode }: { viewMode: 'grid' | 'list' | 'timeline' }) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <ProjectListSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (viewMode === 'timeline') {
    return (
      <div className="space-y-8">
        <p className="text-center text-muted-foreground">Timeline view coming soon</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ProjectGridSkeleton key={i} />
      ))}
    </div>
  );
}